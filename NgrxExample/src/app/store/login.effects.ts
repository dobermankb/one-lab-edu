import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  Login,
  LoginSuccess,
  LoginError
} from './login.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Login),
      exhaustMap(action => {
          if (action.login === 'admin' && action.password === '123')
          return of(LoginSuccess());
          else return of(LoginError());
        }
      )
    )
  );

  constructor(
    private actions$: Actions,
  ) {}
}
