import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { UserModel } from '@core/model/user.model';
import { UsersListComponentStoreService } from './component-store/users-list.component-store.service';
import { DestroyService } from '@shared/service/destroy.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [UsersListComponentStoreService, DestroyService]
})
export class UsersListComponent implements OnInit, OnDestroy {
  readonly pageSize = 10;
  readonly pageOptions = [10, 20, 50];
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  filterInput = '';
  filterSelection = {
    role: ['admin', 'seller'],
    status: [true, false]
  };

  displayedColumns = [
    'fullName',
    'username',
    'phoneNumber',
    'shopName',
    'role',
    'status',
    'actions',
  ];

  users$ = this.usersListStore.users$;

  dataSource = new MatTableDataSource<UserModel>([]);

  constructor(private usersListStore: UsersListComponentStoreService,
              private destroyService$: DestroyService) {}

  applyFilter(): void {
    this.dataSource.filter = JSON.stringify({
      filterInput: this.filterInput,
      filterSelection: this.filterSelection
    });
  }

  ngOnInit(): void {
    this.usersListStore.loadUsers();

    this.users$.pipe(takeUntil(this.destroyService$)).subscribe(users => {
      this.setDataSourceAttributes();
      this.dataSource.data = users;
    });
  }

  ngOnDestroy(): void {}

  statusToggle(element: UserModel): void {
    element.status = !element.status;
    this.usersListStore.setUser(element);
  }

  onEdit(element: UserModel): void {
    this.usersListStore.goToEditUser(element.uid);
  }

  private setDataSourceAttributes(): void {
    this.dataSource.paginator = this.paginator ? this.paginator : null;
    this.dataSource.sort = this.sort ? this.sort : null;
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
  }
  syncPrimaryPaginator(event: PageEvent): void {
    if (this.paginator) {
      this.paginator.pageIndex = event.pageIndex;
      this.paginator.pageSize = event.pageSize;
    }
    this.paginator?.page.emit(event);
  }
}
