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
          map(sessionUser => {
            if (sessionUser) {
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
              map(sessionUser => {
                if (sessionUser) {
                  return LoginSessionUserCompleteAction( { sessionUser } );
                } else {
                  return LoginSessionUserFailAction({ error: Error('User is not permitted to enter!') });
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
        exhaustMap(() => this.router.navigate(['/products']))
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

  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngrxOnInitEffects(): Action {
    return LoadSessionUserAction();
  }
}
