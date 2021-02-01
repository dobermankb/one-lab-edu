import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { UserModel } from '@core/model/user.model';
import { UserService } from '@core/service/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '@core/model/product.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

  private readonly MAX_LENGTH = 50;
  userToEdit$: Observable<UserModel | undefined | null>;
  userEditForm?: FormGroup;
  sub: Subscription;
  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private formBuilder: FormBuilder) {
    this.userToEdit$ = this.activatedRoute.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.userService.getUser$(params.get('uid') || '')),
        shareReplay(1),
        catchError(error => of(null))
      );
    this.sub = this.userToEdit$.subscribe(user => {
      if (user) {
        this.userEditForm = this.formBuilder.group(
          {
            uid: [user.uid, [Validators.required]],
            role: [user.role, [Validators.required]],
            status: [user.status, [Validators.required]],
            fullName: [user.fullName, [Validators.maxLength(this.MAX_LENGTH)]],
            username: [user.username, [Validators.maxLength(this.MAX_LENGTH)]],
            phoneNumber: [user.phoneNumber, [Validators.nullValidator]],
            shopName: [user.shopName, [Validators.maxLength(this.MAX_LENGTH)]],
          }
        );
      }
    });
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
    console.log(this.userEditForm?.getRawValue());
    console.log(this.userEditForm);
    this.userService.setUser(this.userEditForm?.getRawValue() as UserModel)
      .then(() => console.log('successful'))
      .catch((error) => console.log(error));
  }
}
