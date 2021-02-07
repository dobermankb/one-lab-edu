import { ActionReducerMap } from '@ngrx/store';
import { sessionUserReducer } from '@core/store/session-user/session-user.reducer';
import { SessionUserState } from '@core/store/session-user/session-user.state';

export interface RootState {
  sessionUser: SessionUserState;
}

export const reducers: ActionReducerMap<RootState> = {
  sessionUser: sessionUserReducer
};
