import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, Observable, of, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsLoading, selectIsLoggedIn, selectSessionUser } from '@core/store/session-user/session-user.selector';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';

@Injectable()
export class MainGuard implements CanLoad, CanActivate {

  constructor(private router: Router, private storeSessionUserStore: Store<SessionUserState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (route.data.accessRoles) {
      return this.storeSessionUserStore.select(selectIsLoading)
        .pipe(
          filter(isLoading => !isLoading),
          take(1),
          mergeMap(isLoading => combineLatest([
            this.storeSessionUserStore.select(selectIsLoggedIn)
              .pipe(
                take(1),
                catchError(error => of(false)),
              ),
            this.storeSessionUserStore.select(selectSessionUser)
              .pipe(
                map(sessionUser => !!route.data.accessRoles.includes(sessionUser?.role)),
                take(1),
                catchError(error => of(false))
              )
          ]).pipe(
            map(([isLoggedIn, permittedRole]) => isLoggedIn && permittedRole),
            catchError(error => of(false))
          ))
        );
    }
    return of(true);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    if (route.data?.accessRoles) {
      return this.storeSessionUserStore.select(selectIsLoading)
        .pipe(
          filter(isLoading => !isLoading),
          take(1),
          mergeMap(isLoading => combineLatest([
            this.storeSessionUserStore.select(selectIsLoggedIn)
              .pipe(
                take(1),
                catchError(error => of(false)),
              ),
            this.storeSessionUserStore.select(selectSessionUser)
              .pipe(
                map(sessionUser => !!route.data?.accessRoles.includes(sessionUser?.role)),
                take(1),
                catchError(error => of(false))
              )
          ]).pipe(
            map(([isLoggedIn, permittedRole]) => isLoggedIn && permittedRole),
            catchError(error => of(false))
          ))
        );
    }
    return of(true);
  }
}
