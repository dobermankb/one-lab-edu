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
import { UserService } from '@core/service/user.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  sub: Subscription;
  constructor(private storeSessionUser: Store<SessionUserState>,
              private userService: UserService,
              private router: Router) {
    this.users$ = userService.allUsers$;
    this.dataSource = new MatTableDataSource<UserModel>([]);
    this.sub = userService.allUsers$.subscribe(users =>
      this.dataSource = new MatTableDataSource<UserModel>(users)
    );
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

  applyFilter(eventTarget: any): void {
    let filterValue = (eventTarget as HTMLInputElement).value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

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

  private setDataSourceAttributes(): void {
    console.log(this.paginator, this.sort);
    this.dataSource.paginator = this.paginator ? this.paginator : null;
    this.dataSource.sort = this.sort ? this.sort : null;
  }
}
