import { UserModel } from '@core/model/user.model';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserService } from '@core/service/user.service';
import { Injectable } from '@angular/core';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface UserEditState {
  users: UserModel[];
  isLoading: boolean;
  errorMsg?: string | null;
}

@Injectable()
export class UsersListComponentStoreService extends ComponentStore<UserEditState> {
  constructor(private userService: UserService) {
    super({
      users: [],
      errorMsg: null,
      isLoading: false
    });
  }
  readonly users$: Observable<UserModel[]> = this.select(state => state.users);
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

  readonly updateUsers = this.updater((state: UserEditState, users: UserModel[]) => {
    return {
      ...state,
      users
    };
  });

  readonly loadUsers = this.effect((dummy$: Observable<string>) => {
    return dummy$.pipe(
      switchMap((dummy: string) => {
        this.setLoading(true);
        return this.userService.getAllUsers$().pipe(
          tapResponse(
            users => {
              this.setLoading(false);
              this.updateError(null);
              this.updateUsers(users);
            },
            (error) => this.updateError(String(error))
          ),
          catchError(() => of([]))
        );
      })
    );
  });
  readonly setUser = this.effect((userToEdit$: Observable<UserModel>) => {
    return userToEdit$.pipe(
      switchMap((userToEdit: UserModel) => {
        this.setLoading(true);
        return from(this.userService.setUser(userToEdit)).pipe(
          tapResponse(
            successful => {
              this.setLoading(false);
              this.updateError(null);
              // this.updateUsers(this.users$.pipe(
              //   map(user => {
              //     if (user.uid === userToEdit.uid) {
              //       return userToEdit;
              //     } else {
              //       return user;
              //     }
              //   }),
              //   catchError(error => EMPTY)
              // ));
              this.loadUsers('dummy'); // need to change this probably
            },
            (error) => this.updateError(String(error))
          ),
          catchError(() => of(null))
        );
      })
    );
  });
}
