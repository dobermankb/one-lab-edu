import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, tap, map, filter, take } from 'rxjs/operators';
import { Store  } from '@ngrx/store';
import { ROUTER_CANCEL } from '@ngrx/router-store';
import { selectIsLoading, selectIsLoggedIn } from '@core/store/session-user/session-user.selector';
import { Router } from '@angular/router';

@Injectable()
export class RouterEffect {

  redirectOnCancel$ = createEffect(() => this.actions$.pipe(
    ofType(ROUTER_CANCEL),
    switchMap(() => this.store.select(selectIsLoading)),
    take(1),
    filter(isLoading => !isLoading),
    switchMap(() => this.store.select(selectIsLoggedIn)),
    take(1),
    map(isLoggedIn => {
      if (!isLoggedIn) {
        return this.router.navigate(['auth']);
      } else {
        return this.router.navigate(['products']);
      }
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router
  ) { }
}
