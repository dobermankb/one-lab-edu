import { UserModel } from '@core/model/user.model';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserService } from '@core/service/user.service';
import { Injectable } from '@angular/core';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

enum LOADING_STATE {
  INIT,
  LOADING,
  LOADED
}

interface UserEditState {
  user?: UserModel | null;
  loadingState: LOADING_STATE;
  errorMsg?: string | null;
  successMsg?: string | null;
}

@Injectable()
export class UserEditComponentStoreService extends ComponentStore<UserEditState> {
  constructor(private userService: UserService) {
    super({
      user: null,
      errorMsg: null,
      successMsg: null,
      loadingState: LOADING_STATE.INIT
    });
  }
  readonly user$: Observable<UserModel | null | undefined> = this.select(state => state.user);
  readonly isLoading$: Observable<boolean> = this.select(state => state.loadingState === LOADING_STATE.LOADING);
  readonly isLoaded$: Observable<boolean> = this.select(state => state.loadingState === LOADING_STATE.LOADED);
  readonly errorMsg$: Observable<string | null | undefined> = this.select(state => state.errorMsg);
  readonly successMsg$: Observable<string | null | undefined> = this.select(state => state.successMsg);

  readonly updateError = this.updater((state: UserEditState, errorMsg: string | null | undefined) => {
    return {
      ...state,
      errorMsg
    };
  });

  readonly updateSuccessMsg = this.updater((state: UserEditState, successMsg: string | null | undefined) => {
    return {
      ...state,
      successMsg
    };
  });

  readonly setLoading = this.updater((state: UserEditState, loadingState: LOADING_STATE) => {
    return {
      ...state,
      loadingState
    };
  });

  readonly updateUser = this.updater((state: UserEditState, user: UserModel | null | undefined) => {
    return {
      ...state,
      user
    };
  });

  readonly loadUser = this.effect((userUid$: Observable<string>) => {
    return userUid$.pipe(
      switchMap((userUid: string) => {
        this.setLoading(LOADING_STATE.LOADING);
        return this.userService.getUser$(userUid).pipe(
          tapResponse(
            user => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(null);
              this.updateUser(user);
            },
            (error) => this.updateError(String(error))
          ),
          catchError(() => EMPTY)
        );
      })
    );
  });
  readonly setUser = this.effect((user$: Observable<UserModel>) => {
    return user$.pipe(
      switchMap((user: UserModel) => {
        this.setLoading(LOADING_STATE.LOADING);
        this.updateSuccessMsg(null);
        return from(this.userService.setUser(user)).pipe(
          tapResponse(
            successful => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(null);
              this.updateSuccessMsg('Successfully updated the user');
              this.updateUser(user);
            },
            (error) => this.updateError(String(error))
          ),
          catchError(() => of(null))
        );
      })
    );
  });
}
