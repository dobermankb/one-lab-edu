import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

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
  readonly pageSizeOptions = [10, 20, 50];

  readonly displayedColumns = [
    {
      name: 'fullName',
      displayName: 'Full name',
      sortable: true,
    },
    {
      name: 'username',
      displayName: 'Username',
      sortable: true,
    },
    {
      name: 'phoneNumber',
      displayName: 'Phone number',
      sortable: true,
    },
    {
      name: 'shopName',
      displayName: 'Shop name',
      sortable: true,
    },
    {
      name: 'role',
      displayName: 'Role',
      sortable: true,
    },
    {
      name: 'status',
      displayName: 'Status',
      sortable: true,
      configBoolean: {
        display: {
          onTrue: 'Active',
          onFalse: 'Inactive'
        }
      }
    },
    {
      name: 'actions',
      displayName: 'Actions',
      sortable: false,
      configAction: {
        actions: [
          {
            name: 'editAction',
            conditionBaseKey: '',
            tooltip: {
              onTrue: 'Edit user',
              onFalse: 'Edit user'
            },
            icon: {
              onTrue: 'edit',
              onFalse: 'edit',
            },
            color: {
              onTrue: 'primary',
              onFalse: 'primary'
            }
          },
          {
            name: 'toggleAction',
            conditionBaseKey: 'status',
            tooltip: {
              onTrue: 'Toggle status',
              onFalse: 'Toggle status',
            },
            icon: {
              onTrue: 'person',
              onFalse: 'person_off',
            },
            color: {
              onTrue: 'success',
              onFalse: 'warn'
            }
          },
        ]
      }
    }
  ];

  filterInput = '';
  filterSelection = {
    role: ['admin', 'seller'],
    status: [true, false]
  };

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

  private setDataSourceAttributes(): void {
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

  tableActionHandler({ element, actionName }: { element: UserModel, actionName: string }): void {
    if (actionName === 'editAction') {
      this.usersListStore.goToEditUser(element.uid);
    } else if (actionName === 'toggleAction') {
      element.status = !element.status;
      this.usersListStore.setUser(element);
    }
  }
}
