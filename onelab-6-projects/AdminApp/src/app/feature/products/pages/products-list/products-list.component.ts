import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, map, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';

import { ProductsListComponentStoreService } from './component-store/products-list.component-store.service';
import { DestroyService } from '@shared/service/destroy.service';
import { ProductModel } from '@core/model/product.model';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { selectSessionUser } from '@core/store/session-user/session-user.selector';
import { RootState } from '@core/store';
import { getCurrentRouteState } from '@core/store/router/router.selector';
import { RouterStateUrl } from '@core/store/router/router.state';
import { UserModel } from '@core/model/user.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  providers: [ProductsListComponentStoreService, DestroyService]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  readonly pageSize = 10;
  readonly pageSizeOptions = [10, 20, 50];
  readonly displayedColumns = [
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
    },
    {
      name: 'barcode',
      displayName: 'Barcode',
      sortable: true,
    },
    {
      name: 'categoryName',
      displayName: 'Category name',
      sortable: true,
    },
    {
      name: 'price',
      displayName: 'Price',
      sortable: true,
    },
    {
      name: 'description',
      displayName: 'Description',
      sortable: true,
    },
    {
      name: 'status',
      displayName: 'Status',
      sortable: true,
      configBoolean: {
        display: {
          onTrue: 'Approved',
          onFalse: 'Waiting approval'
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
              onTrue: 'Edit product',
              onFalse: 'Edit product'
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
            name: 'deleteAction',
            conditionBaseKey: '',
            tooltip: {
              onTrue: 'Delete product',
              onFalse: 'Delete product',
            },
            icon: {
              onTrue: 'delete',
              onFalse: 'delete',
            },
            color: {
              onTrue: 'warn',
              onFalse: 'warn'
            }
          },
        ]
      }
    }
  ];

  dataSource = new MatTableDataSource<ProductModel>([]);
  filterInput = '';
  filterSelection = {
    role: ['admin', 'seller'],
    status: [true, false]
  };
  uidToEdit?: string;
  sessionUserUid?: string;
  products$ = this.productsListStore.products$;
  user$ = this.productsListStore.user$;
  constructor(private productsListStore: ProductsListComponentStoreService,
              private sessionUserStore: Store<SessionUserState>,
              private store: Store<RootState>,
              private destroyService$: DestroyService) {
  }

  applyFilter(): void {
    this.dataSource.filter = JSON.stringify({
      filterInput: this.filterInput,
      filterSelection: this.filterSelection
    });
  }

  ngOnInit(): void {
    this.store.select(getCurrentRouteState).pipe(
      map(routeStateUnknown => {
        const routeState = routeStateUnknown as unknown as RouterStateUrl;
        const { userUid } = routeState.params;
        return userUid as string | undefined;
      }),
      withLatestFrom(
        this.sessionUserStore.select(selectSessionUser).pipe(
          filter(sessionUser => !!sessionUser),
          take(1)
        )
      ),
      takeUntil(this.destroyService$)
    ).subscribe(
      ([userUid, sessionUser]) => {
        if (!!userUid) {
          this.uidToEdit = userUid;
          this.productsListStore.loadProductsOfUser(this.uidToEdit);
          this.productsListStore.loadUser(this.uidToEdit);
        } else if (!!sessionUser) {
          this.uidToEdit = undefined;
          this.sessionUserUid = sessionUser.uid;
          this.productsListStore.loadProductsOfUser(sessionUser.uid);
          this.productsListStore.loadUser(sessionUser.uid);
        }
      }
    );

    this.products$.pipe(takeUntil(this.destroyService$)).subscribe(products => {
      this.dataSource.filterPredicate = (data: ProductModel, filterVal: string) => {
        return this.filterSelection.status.includes(data.status)
          &&
          (filterVal.length === 0
            || !!data.name?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase())
            || !!data.barcode?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase())
            || !!data.categoryName?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase())
            || !!data.description?.trim().toLowerCase().includes(this.filterInput.trim().toLowerCase())
            || !!data.price?.toString().trim().toLowerCase().includes(this.filterInput.trim().toLowerCase()));
      };
      this.dataSource.data = products;
    });
  }

  ngOnDestroy(): void {}

  tableActionHandler({ element, actionName }: { element: ProductModel, actionName: string }): void {
    if (actionName === 'editAction') {
      this.productsListStore.goToEditProduct({ productUid: element.uid, userUid: this.uidToEdit });
    } else if (actionName === 'deleteAction') {
      this.productsListStore.deleteProduct(element);
    }
  }

  onAdd(): void {
    this.productsListStore.goToAddProduct({userUid: this.uidToEdit});
  }
}
