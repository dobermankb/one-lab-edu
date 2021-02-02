import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { UserModel } from '@core/model/user.model';
import { UserService } from '@core/service/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserEditComponentStoreService } from './component-store/user-edit.component-store.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UserEditComponentStoreService]
})
export class UserEditComponent implements OnInit, OnDestroy {
  private readonly MAX_LENGTH = 50;
  userEditForm?: FormGroup;
  userToEdit$: Observable<UserModel | null | undefined>;
  isLoading$ = this.userEditStore.isLoading$;
  errorMsg$ = this.userEditStore.errorMsg$;
  sub = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
              private userEditStore: UserEditComponentStoreService,
              private formBuilder: FormBuilder) {
    this.userEditStore.loadUser(this.activatedRoute.snapshot.paramMap.get('uid') || '');
    this.userToEdit$ = this.userEditStore.user$;
    this.sub.add(this.userToEdit$.subscribe(user => {
      if (user) {
        this.userEditForm = this.formBuilder.group(
          {
            uid: [user.uid, [Validators.required]],
            role: [user.role, [Validators.required]],
            status: [user.status, [Validators.required]],
            fullName: [user.fullName, [Validators.maxLength(this.MAX_LENGTH)]],
            username: [user.username, [Validators.maxLength(this.MAX_LENGTH)]],
            phoneNumber: [user.phoneNumber,
              [Validators.pattern('^([\\s]*)(([+][7])|([8]))([\\s])*([\\d][\\s]*){10}$')]],
            shopName: [user.shopName, [Validators.maxLength(this.MAX_LENGTH)]],
          }
        );
      }
    }));
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

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.userEditForm?.reset();
  }
  onSubmit(): void {
    if (this.userEditForm?.invalid) {
      return;
    }
    this.userEditStore.setUser(this.userEditForm?.getRawValue() as UserModel);
  }
}
