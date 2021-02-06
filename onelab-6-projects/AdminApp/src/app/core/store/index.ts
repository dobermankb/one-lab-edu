import { ActionReducerMap } from '@ngrx/store';
import { sessionUserReducer } from '@core/store/session-user/session-user.reducer';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { SessionUserEffect } from '@core/store/session-user/session-user.effect';
import { RouterEffect } from '@core/store/router/router.effect';
import { routerReducer } from '@ngrx/router-store';
import * as fromRouter from '@ngrx/router-store';

export interface RootState {
  sessionUser: SessionUserState;
  router: fromRouter.RouterReducerState<any>;
}

export const reducers: ActionReducerMap<RootState> = {
  sessionUser: sessionUserReducer,
  router: routerReducer,
};

export const effects = [
  SessionUserEffect,
  RouterEffect
];

