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

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  providers: [ProductsListComponentStoreService, DestroyService]
})
export class ProductsListComponent implements OnInit, OnDestroy {

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
  displayedColumns = [
    'name',
    'barcode',
    'category',
    'price',
    'description',
    'status',
    'actions'
  ];
  dataSource = new MatTableDataSource<ProductModel>([]);
  filterInput = '';
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
    this.dataSource.filter = this.filterInput;
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
      this.setDataSourceAttributes();
      this.dataSource.data = products;
    });
  }

  ngOnDestroy(): void {}

  private setDataSourceAttributes(): void {
    this.dataSource.paginator = this.paginator ? this.paginator : null;
    this.dataSource.sort = this.sort ? this.sort : null;
  }
  syncPrimaryPaginator(event: PageEvent): void {
    if (this.paginator) {
      this.paginator.pageIndex = event.pageIndex;
      this.paginator.pageSize = event.pageSize;
    }
    this.paginator?.page.emit(event);
  }

  onEdit(element: ProductModel): void {
    this.productsListStore.goToEditProduct({ productUid: element.uid, userUid: this.uidToEdit });
  }
  onDelete(element: ProductModel): void {
    this.productsListStore.deleteProduct(element);
  }
  onAdd(): void {
    this.productsListStore.goToAddProduct({userUid: this.uidToEdit});
  }
}
