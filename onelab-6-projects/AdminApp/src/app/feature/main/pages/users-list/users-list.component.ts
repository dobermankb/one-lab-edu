import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SessionUserModel } from '@core/model/session-user.model';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import {
  selectErrorMsg,
  selectIsLoading,
  selectIsLoggedIn,
  selectSessionUser
} from '@core/store/session-user/session-user.selector';
import { LogoutSessionUserAction } from '@core/store/session-user/session-user.action';
import { UserModel } from '@core/model/user.model';
import { AuthenticationService } from '@core/service/authentication.service';
import { UserService } from '@core/service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {

  users$: Observable<UserModel[]>;
  constructor(private storeSessionUser: Store<SessionUserState>,
              private userService: UserService,
              private router: Router) {
    this.users$ = userService.allUsers$;
  }

  get sessionUser$(): Observable<SessionUserModel | null | undefined> {
    return this.storeSessionUser.select(selectSessionUser);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.storeSessionUser.select(selectIsLoggedIn);
  }

  get isLoading$(): Observable<boolean> {
    return this.storeSessionUser.select(selectIsLoading);
  }

  get errorMsg$(): Observable<string | null | undefined> {
    return this.storeSessionUser.select(selectErrorMsg);
  }

  get displayedColumns(): string[] {
    return [
      'fullName',
      'username',
      'phoneNumber',
      'role',
      'shopName',
      'status',
      'toggleStatus',
      'actions',
    ];
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  logout = () => {
    this.storeSessionUser.dispatch(LogoutSessionUserAction());
  }

  statusToggle = (element?: UserModel) => {
    console.log(element);
    alert(`statusToggle function ${element?.fullName}`);
    // console.log('Status is toggled ' + element);
  }

  onEdit = (element?: UserModel) => {
    // alert(element?.fullName + ' edit');
    this.router.navigate([`main/user-edit/${element?.uid}`]);
  }

  onSave = (element?: UserModel) => {
    alert(element?.fullName + ' saved');
  }
}
