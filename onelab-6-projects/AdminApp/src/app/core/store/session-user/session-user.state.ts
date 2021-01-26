import { SessionUserModel } from '@core/model/session-user.model';

export interface SessionUserState {
  isLoading: boolean;
  isLoggedIn: boolean;
  errorMsg?: string | null;
  sessionUser: SessionUserModel;
}

export const initialSessionUserState: SessionUserState = {
  isLoading: false,
  isLoggedIn: false,
  sessionUser: {
    id: null,
  }
};
