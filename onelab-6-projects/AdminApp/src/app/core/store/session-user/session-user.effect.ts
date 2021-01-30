import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, catchError, exhaustMap, tap, switchMap, take } from 'rxjs/operators';
import { SessionUserActionType } from '@core/store/session-user/session-user.action.type';
import {
  LoginSessionUserFailAction, LoginSessionUserCompleteAction,
  LogoutSessionUserCompleteAction, LogoutSessionUserFailAction,
  LoadSessionUserAction, LoadSessionUserCompleteAction, LoadSessionUserFailAction
} from '@core/store/session-user/session-user.action';

import { AuthenticationService } from '@core/service/authentication.service';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';

@Injectable()
export class SessionUserEffect implements OnInitEffects {

  loadSessionUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionUserActionType.LOAD),
      switchMap(() => this.authService.sessionUser$
        .pipe(
          take(1),
          map(user => {
            if (user) {
              const sessionUser = {
                uid: user.uid,
                role: user.role,
              };
              return LoadSessionUserCompleteAction( { sessionUser } );
            } else {
              return LoadSessionUserFailAction();
            }
          }),
          catchError((error) => of(LoadSessionUserFailAction()))
        ))
    )
  );

  loginSessionUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionUserActionType.LOGIN),
      map(({ email, password }) => {
        return {
          email,
          password
        };
      }),
      exhaustMap((userCredentials) => from(this.authService.login(userCredentials.email, userCredentials.password))
        .pipe(
          switchMap((authState) => this.authService.sessionUser$
            .pipe(
              take(1),
              map(user => {
                if (user) {
                  const sessionUser = {
                    uid: user.uid,
                    role: user.role,
                  };
                  return LoginSessionUserCompleteAction( { sessionUser } );
                } else {
                  return LoginSessionUserFailAction({ error: Error('No session user!') });
                }
              }),
              catchError((error) => of(LoginSessionUserFailAction({ error })))
            )
          ),
          catchError((error) => {
            return of(LoginSessionUserFailAction( { error }));
          })
        )
      ),
    )
  );

  logoutSessionUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionUserActionType.LOGOUT),
      exhaustMap(() => from(this.authService.logout())
        .pipe(
          map(p => LogoutSessionUserCompleteAction()),
          catchError((error) => {
            return of(LogoutSessionUserFailAction( { error }));
          })
        )),
      )
  );

  loginSessionUserComplete$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SessionUserActionType.LOGIN_COMPLETE),
        exhaustMap(() => this.router.navigate(['/main']))
      ),
    { dispatch: false }
  );

  logoutSessionUserComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionUserActionType.LOGOUT_COMPLETE, SessionUserActionType.LOAD_FAIL),
      exhaustMap(() => this.router.navigate(['/auth']))
    ),
    { dispatch: false }
    );

  logActions$ = createEffect(() =>
    this.actions$.pipe(
      tap(action => {
        // console.log('|EFFECTS LOGGER|', action);
      }),
    ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngrxOnInitEffects(): Action {
    return LoadSessionUserAction();
  }
}
