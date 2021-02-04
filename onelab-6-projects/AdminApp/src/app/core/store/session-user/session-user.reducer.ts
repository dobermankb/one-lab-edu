import { Action, createReducer, on } from '@ngrx/store';
import {
  LoadSessionUserAction, LoadSessionUserCompleteAction, LoadSessionUserFailAction,
  LoginSessionUserAction, LoginSessionUserCompleteAction, LoginSessionUserFailAction,
  LogoutSessionUserAction, LogoutSessionUserCompleteAction, LogoutSessionUserFailAction
} from '@core/store/session-user/session-user.action';

import { initialSessionUserState } from '@core/store/session-user/session-user.state';

const sessionUserReducerInternal = createReducer(
  initialSessionUserState,

  on(LoadSessionUserAction, LoginSessionUserAction, (state) => ({
    ...state,
    isLoading: true,
    errorMsg: null
  })),

  on(LoadSessionUserCompleteAction, LoginSessionUserCompleteAction, (state, { sessionUser }) => ({
    ...state,
    isLoading: false,
    isLoggedIn: true,
    errorMsg: null,
    sessionUser
  })),

  on(LoadSessionUserFailAction, (state) => {
    return ({
      ...state,
      isLoggedIn: false,
      isLoading: false,
    });
  }),

  on(LoginSessionUserFailAction, (state, { error }) => {
    return ({
      ...state,
      isLoading: false,
      errorMsg: error.message
    });
  }),

  on(LogoutSessionUserAction, (state) => ({
    ...state,
    isLoading: true,
    errorMsg: null
  })),

  on(LogoutSessionUserCompleteAction, (state) => ({
    ...state,
    isLoading: false,
    isLoggedIn: false,
    sessionUser: null,
    errorMsg: null
  })),

  on(LogoutSessionUserFailAction, (state, { error }) => {
    return ({
      ...state,
      isLoading: false,
      errorMsg: error.message
    });
  })
);

export const sessionUserReducer = (state = initialSessionUserState, action: Action) =>
  sessionUserReducerInternal(state, action);

