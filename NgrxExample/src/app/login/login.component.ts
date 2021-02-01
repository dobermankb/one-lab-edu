import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Login} from '../store/login.actions';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: string;
  password: string;
  loginstate$: Observable<{loading: boolean, isLoggedIn: boolean}>;
  form: FormGroup;

  constructor(private store: Store<{ login: {loading: boolean, isLoggedIn: boolean} }>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginstate$ = this.store.pipe(select(state => state.login));
    this.form = this.fb.group({
      login: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  submit(e) {
    e.preventDefault();
    console.log(this.form);
    this.store.dispatch( Login({login: this.form.value.login, password: this.form.get('password').value}));
  }
}
