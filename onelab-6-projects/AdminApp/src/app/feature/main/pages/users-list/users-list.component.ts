import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsersListComponentStoreService } from './component-store/users-list.component-store.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [UsersListComponentStoreService]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  sub = new Subscription();
  filterInput = '';
  filterSelection = {
    role: ['admin', 'seller'],
    status: [true, false]
  };
  constructor(private storeSessionUser: Store<SessionUserState>,
              private usersListStore: UsersListComponentStoreService,
              private router: Router) {
    this.usersListStore.loadUsers('dummy');
    this.users$ = this.usersListStore.users$;
    this.dataSource = new MatTableDataSource<UserModel>([]);
    this.sub.add(this.users$.subscribe(users => {
      this.dataSource = new MatTableDataSource<UserModel>(users);
      this.dataSource.filterPredicate = (data: UserModel, filter: string) => {
        return this.filterSelection.role.includes(data.role)
          && this.filterSelection.status.includes(data.status)
          &&
          (filter.length === 0
            || !!data.fullName?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase())
            || !!data.username?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase())
            || !!data.phoneNumber?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase())
            || !!data.shopName?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase()));
      };
    }));
  }

  isLoggedIn$ = this.storeSessionUser.select(selectIsLoggedIn);
  isLoading$ = this.storeSessionUser.select(selectIsLoading);
  errorMsg$ = this.storeSessionUser.select(selectErrorMsg);
  sessionUser$ = this.storeSessionUser.select(selectSessionUser);

  displayedColumns = [
    'fullName',
    'username',
    'phoneNumber',
    'role',
    'shopName',
    'status',
    'actions',
  ];

  users$: Observable<UserModel[]>;
  dataSource: MatTableDataSource<UserModel>;

  applyFilter(): void {
    let filterValue = this.filterInput;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = JSON.stringify({
      filterInput: this.filterInput,
      filterSelection: this.filterSelection
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  logout = () => {
    this.storeSessionUser.dispatch(LogoutSessionUserAction());
  }

  statusToggle = (element: UserModel) => {
    console.log('Status is toggled ' + element);
    element.status = !element.status;
    this.usersListStore.setUser(element);
  }

  onEdit = (element?: UserModel) => {
    this.router.navigate([`main/user-edit/${element?.uid}`]);
  }

  onResetPassword = (element?: UserModel) => {
    alert('Password reset email sent');
  }

  private setDataSourceAttributes(): void {
    this.dataSource.paginator = this.paginator ? this.paginator : null;
    this.dataSource.sort = this.sort ? this.sort : null;
  }
}
