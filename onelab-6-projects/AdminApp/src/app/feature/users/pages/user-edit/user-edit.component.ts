import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserModel } from '@core/model/user.model';
import { UserEditComponentStoreService } from './component-store/user-edit.component-store.service';
import { DestroyService } from '@shared/service/destroy.service';
import { Store } from '@ngrx/store';
import { RootState } from '@core/store';
import { getCurrentRouteState } from '@core/store/router/router.selector';
import { RouterStateUrl } from '@core/store/router/router.state';
import { selectSessionUser } from '@core/store/session-user/session-user.selector';
import { SessionUserState } from '@core/store/session-user/session-user.state';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UserEditComponentStoreService, DestroyService]
})
export class UserEditComponent implements OnInit, OnDestroy {
  private readonly MAX_LENGTH = 50;
  userEditForm?: FormGroup;

  userToEdit$ = this.userEditStore.user$;
  isLoading$ = this.userEditStore.isLoading$;
  errorMsg$ = this.userEditStore.errorMsg$;
  successMsg$ = this.userEditStore.successMsg$;

  constructor(private store: Store<RootState>,
              private sessionUserStore: Store<SessionUserState>,
              private userEditStore: UserEditComponentStoreService,
              private formBuilder: FormBuilder,
              private destroyService$: DestroyService) {
  }

  get role(): AbstractControl | null | undefined {
    return this.userEditForm?.get('role');
  }

  get status(): AbstractControl | null | undefined {
    return this.userEditForm?.get('status');
  }

  get fullName(): AbstractControl | null | undefined {
    return this.userEditForm?.get('fullName');
  }

  get username(): AbstractControl | null | undefined {
    return this.userEditForm?.get('username');
  }

  get phoneNumber(): AbstractControl | null | undefined {
    return this.userEditForm?.get('phoneNumber');
  }

  get shopName(): AbstractControl | null | undefined {
    return this.userEditForm?.get('shopName');
  }

  get deliveryOptionsPickup(): AbstractControl | null | undefined {
    return this.userEditForm?.get('deliveryOptions')?.get('pickup');
  }

  get deliveryOptionsDelivery(): AbstractControl | null | undefined {
    return this.userEditForm?.get('deliveryOptions')?.get('delivery');
  }


  ngOnInit(): void {
    this.store.select(getCurrentRouteState).pipe(
      map(routeStateUnknown => {
        const routeState = routeStateUnknown as unknown as RouterStateUrl;
        const { userUid } = routeState.params;
        return userUid as string | undefined;
      }),
      withLatestFrom(
        this.sessionUserStore.select(selectSessionUser).pipe(
          filter(sessionUser => !!sessionUser),
          take(1)
        )
      ),
      takeUntil(this.destroyService$)
    ).subscribe(
      ([userUid, sessionUser]) => {
        if (!!userUid) {
          this.userEditStore.loadUser(userUid);
        } else if (!!sessionUser) {
          this.userEditStore.loadUser(sessionUser.uid);
        }
      }
    );
    this.userToEdit$.pipe(takeUntil(this.destroyService$)).subscribe(user => {
      if (user) {
        this.userEditForm = this.formBuilder.group(
          {
            uid: [user.uid, [Validators.required]],
            role: [user.role, [Validators.required]],
            status: [user.status, [Validators.required]],
            fullName: [user.fullName, [Validators.maxLength(this.MAX_LENGTH)]],
            username: [user.username, [Validators.maxLength(this.MAX_LENGTH)]],
            deliveryOptions: this.formBuilder.group({
              pickup: [user.deliveryOptions.pickup, [Validators.nullValidator]],
              delivery: [user.deliveryOptions.delivery, [Validators.nullValidator]],
            }),
            phoneNumber: [user.phoneNumber,
              [Validators.pattern('^([\\s]*)(([+][7])|([8]))([\\s])*([\\d][\\s]*){10}$')]],
            shopName: [user.shopName, [Validators.maxLength(this.MAX_LENGTH)]],
          }
        );
      }
    });
  }
  ngOnDestroy(): void {
    this.userEditForm?.reset();
  }
  onSubmit(): void {
    if (this.userEditForm?.invalid) {
      return;
    }
    this.userEditStore.setUser(this.userEditForm?.getRawValue() as UserModel);
  }
  onNavigateToList(): void {
    this.userEditStore.goToList();
  }
  onNavigateToProducts(uid: string): void {
    this.userEditStore.goToProducts(uid);
  }
}
