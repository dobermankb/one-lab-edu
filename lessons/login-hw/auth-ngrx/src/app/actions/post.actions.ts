import {Action } from '@ngrx/store';
import {User} from '../models/post.model';

export const GET_USER = '[Auth] GET USER';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAILURE='[AUTH] Login Failure';
export const GOOGLE_LOGIN = '[Auth] Google login attempt';
export const LOGOUT = '[Auth] Logout';

export class GetUser implements Action {
    readonly type = GET_USER;
    constructor(public payload?: any) {}
  }
  
  export class LogInSuccess implements Action {
    readonly type = LOGIN_SUCCESS;
    constructor(public payload: User) {}
  }
  export class LogInFailure implements Action {
    readonly type = LOGIN_FAILURE;
    constructor(public payload?: any) {}
  }
  export class GoogleLogin implements Action {
    readonly type = GOOGLE_LOGIN;
    constructor(public payload?: any) {}
}

/// Logout Actions

export class Logout implements Action {
    readonly type = LOGOUT;
    constructor(public payload?: any) {}
}

  export type All =
    | GetUser
    | LogInSuccess
    | LogInFailure
    |Logout
    | GoogleLogin;