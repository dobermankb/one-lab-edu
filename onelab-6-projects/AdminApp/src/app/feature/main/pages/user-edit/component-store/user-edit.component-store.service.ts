import { UserModel } from '@core/model/user.model';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserService } from '@core/service/user.service';
import { Injectable } from '@angular/core';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

interface UserEditState {
  user?: UserModel | null;
  isLoading: boolean;
  errorMsg?: string | null;
}

@Injectable()
export class UserEditComponentStoreService extends ComponentStore<UserEditState> {
  constructor(private userService: UserService) {
    super({
      user: null,
      errorMsg: null,
      isLoading: false
    });
  }
  readonly user$: Observable<UserModel | null | undefined> = this.select(state => state.user);
  readonly isLoading$: Observable<boolean> = this.select(state => state.isLoading);
  readonly errorMsg$: Observable<string | null | undefined> = this.select(state => state.errorMsg);

  readonly updateError = this.updater((state: UserEditState, errorMsg: string | null | undefined) => {
    return {
      ...state,
      errorMsg
    };
  });

  readonly setLoading = this.updater((state: UserEditState, isLoading: boolean) => {
    return {
      ...state,
      isLoading
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
        this.setLoading(true);
        return this.userService.getUser$(userUid).pipe(
          tapResponse(
            user => {
              this.setLoading(false);
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
        this.setLoading(true);
        return from(this.userService.setUser(user)).pipe(
          tapResponse(
            successful => {
              this.setLoading(false);
              this.updateError(null);
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
