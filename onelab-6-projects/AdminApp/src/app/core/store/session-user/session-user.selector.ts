import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionUserState } from '@core/store/session-user/session-user.state';

export const selectFeature = createFeatureSelector<any, SessionUserState>('sessionUser');

export const selectIsLoading = createSelector(
  selectFeature,
  (state: SessionUserState) => state.isLoading
);

export const selectIsLoggedIn = createSelector(
  selectFeature,
  (state: SessionUserState) => state.isLoggedIn
);

export const selectSessionUser = createSelector(
  selectFeature,
  (state: SessionUserState) => state.sessionUser
);

export const selectIsAdmin = createSelector(
  selectFeature,
  (state: SessionUserState) => state.sessionUser?.role === 'admin'
);

export const selectErrorMsg = createSelector(
  selectFeature,
  (state: SessionUserState) => state.errorMsg
);
