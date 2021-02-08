import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserService } from '@core/service/user.service';
import { UserModel } from '@core/model/user.model';

interface UsersListState {
  users: UserModel[];
  isLoading: boolean;
  errorMsg?: string | null;
}

@Injectable()
export class UsersListComponentStoreService extends ComponentStore<UsersListState> {
  constructor(private userService: UserService, private router: Router) {
    super({
      users: [],
      errorMsg: null,
      isLoading: false
    });
  }
  readonly users$: Observable<UserModel[]> = this.select(state => state.users);
  readonly isLoading$: Observable<boolean> = this.select(state => state.isLoading);
  readonly errorMsg$: Observable<string | null | undefined> = this.select(state => state.errorMsg);

  readonly updateError = this.updater((state: UsersListState, errorMsg: string | null | undefined) => {
    return {
      ...state,
      errorMsg
    };
  });

  readonly setLoading = this.updater((state: UsersListState, isLoading: boolean) => {
    return {
      ...state,
      isLoading
    };
  });

  readonly updateUsers = this.updater((state: UsersListState, users: UserModel[]) => {
    return {
      ...state,
      users
    };
  });

  readonly loadUsers = this.effect((dummy$: Observable<void>) => {
    return dummy$.pipe(
      switchMap(() => {
        this.setLoading(true);
        return this.userService.getAllUsers$().pipe(
          tapResponse(
            users => {
              this.setLoading(false);
              this.updateError(null);
              this.updateUsers(users);
            },
            (error) => {
              this.updateError(String(error));
              this.setLoading(false);
            }
          ),
          catchError(() => {
            this.setLoading(false);
            return of([]);
          })
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
              this.updateUsers(
                this.users$.pipe(
                  take(1),
                  map(users => {
                    return users.map(user => {
                      if (user.uid === userToEdit.uid) {
                        return userToEdit;
                      } else {
                        return user;
                      }
                    });
                  }),
                  catchError(error => of([]))
                )
              );
            },
            (error) => {
              this.updateError(String(error));
              this.setLoading(false);
            }
          ),
          catchError(() => {
            this.setLoading(false);
            return of(null);
          })
        );
      })
    );
  });

  readonly goToEditUser = this.effect((userUid$: Observable<string>) => {
    return userUid$.pipe(
      switchMap((userUid: string) => {
        return from(this.router.navigate([`users/edit/${userUid}`]));
      })
    );
  });

}
