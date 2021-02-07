import { createAction, props } from '@ngrx/store';
import { SessionUserActionType } from '@core/store/session-user/session-user.action.type';
import { SessionUserModel } from '@core/model/session-user.model';

export const LoadSessionUserAction = createAction(
  SessionUserActionType.LOAD
);

export const LoadSessionUserCompleteAction = createAction(
  SessionUserActionType.LOAD_COMPLETE,
  props<{ sessionUser: SessionUserModel }>()
);

export const LoadSessionUserFailAction = createAction(
  SessionUserActionType.LOAD_FAIL
);

export const LoginSessionUserAction = createAction(
  SessionUserActionType.LOGIN,
  props<{ email: string, password: string }>()
);

export const LoginSessionUserCompleteAction = createAction(
  SessionUserActionType.LOGIN_COMPLETE,
  props<{ sessionUser: SessionUserModel }>()
);

export const LoginSessionUserFailAction = createAction(
  SessionUserActionType.LOGIN_FAIL,
  props<{ error: Error }>()
);

export const LogoutSessionUserAction = createAction(
  SessionUserActionType.LOGOUT
);

export const LogoutSessionUserCompleteAction = createAction(
  SessionUserActionType.LOGOUT_COMPLETE
);

export const LogoutSessionUserFailAction = createAction(
  SessionUserActionType.LOGOUT_FAIL,
  props<{ error: Error }>()
);
