import * as fromRouter from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { RootState } from '@core/store';

export const getRouterState = (state: RootState) => state.router;

export const getCurrentRouteState = createSelector(
  getRouterState,
  (state: fromRouter.RouterReducerState) => state?.state
);
