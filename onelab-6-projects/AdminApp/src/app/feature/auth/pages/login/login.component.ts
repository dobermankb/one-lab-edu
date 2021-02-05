import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AuthenticationService } from '@core/service/authentication.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { LoginSessionUserAction } from '@core/store/session-user/session-user.action';
import { selectErrorMsg, selectIsLoading } from '@core/store/session-user/session-user.selector';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(public authenticationService: AuthenticationService,
              public router: Router,
              private formBuilder: FormBuilder,
              private storeSessionUser: Store<SessionUserState>) {
  }

  get email(): AbstractControl | null | undefined {
    return this.loginForm?.get('email');
  }

  get password(): AbstractControl | null | undefined {
    return this.loginForm?.get('password');
  }
  private readonly passwordMinlength = 6;
  private readonly passwordMaxlength = 50;

  loginForm?: FormGroup;

  isLoading$ = this.storeSessionUser.select(selectIsLoading);
  errorMsg$ = this.storeSessionUser.select(selectErrorMsg);

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.maxLength(this.passwordMaxlength)]
        ],
        password: ['', [
          Validators.required,
          Validators.minLength(this.passwordMinlength),
          Validators.maxLength(this.passwordMaxlength)]]
      }
    );
  }
  ngOnDestroy(): void {
    this.loginForm?.reset();
  }

  login(): void {
    if (this.loginForm?.invalid) {
      return;
    }

    this.storeSessionUser
      .dispatch(LoginSessionUserAction({ email: this.email?.value, password: this.password?.value }));
  }
}
