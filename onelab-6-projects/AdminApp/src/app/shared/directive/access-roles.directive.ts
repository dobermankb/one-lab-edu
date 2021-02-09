import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, take, takeUntil } from 'rxjs/operators';

import { DestroyService } from '@shared/service/destroy.service';
import { selectIsLoading, selectIsLoggedIn, selectSessionUser } from '@core/store/session-user/session-user.selector';
import { combineLatest, of } from 'rxjs';
import { SessionUserState } from '@core/store/session-user/session-user.state';

@Directive({
  selector: '[appAccessRoles]',
  providers: [DestroyService]
})
export class AccessRolesDirective implements OnInit, OnDestroy {

  @Input() appAccessRoles?: string[];

  constructor(private sessionUserStore: Store<SessionUserState>,
              private destroyService$: DestroyService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  ngOnInit(): void {
    if (this.appAccessRoles) {
      this.sessionUserStore.select(selectIsLoading)
        .pipe(
          filter(isLoading => !isLoading),
          take(1),
          mergeMap(isLoading => combineLatest([
            this.sessionUserStore.select(selectIsLoggedIn)
              .pipe(
                take(1),
                catchError(error => of(false)),
              ),
            this.sessionUserStore.select(selectSessionUser)
              .pipe(
                map(sessionUser => !!this.appAccessRoles?.includes(sessionUser?.role || '')),
                take(1),
                catchError(error => of(false))
              )
          ]).pipe(
            map(([isLoggedIn, permittedRole]) => isLoggedIn && permittedRole),
            catchError(error => of(false)),
          )),
          takeUntil(this.destroyService$)
        ).subscribe(permitted => {
          if (permitted) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
          }
      });
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnDestroy(): void {}
}
