import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';

import { ProductsListComponentStoreService } from './component-store/products-list.component-store.service';
import { DestroyService } from '@shared/service/destroy.service';
import { ProductModel } from '@core/model/product.model';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { selectSessionUser } from '@core/store/session-user/session-user.selector';

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
    'image',
    'price',
    'description',
    'actions'
  ];
  dataSource = new MatTableDataSource<ProductModel>([]);
  filterInput = '';
  uidToEdit = this.activatedRoute.snapshot.paramMap.get('userUid');
  products$ = this.productsListStore.products$;
  constructor(private activatedRoute: ActivatedRoute,
              private productsListStore: ProductsListComponentStoreService,
              private sessionUserStore: Store<SessionUserState>,
              private destroyService$: DestroyService) {
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterInput;
  }

  ngOnInit(): void {
    if (!this.uidToEdit) {
      this.sessionUserStore.select(selectSessionUser)
        .pipe(
          filter(sessionUser => !!sessionUser),
          takeUntil(this.destroyService$)
        ).subscribe(sessionUser => {
        if (sessionUser) {
          this.uidToEdit = sessionUser.uid;
          this.productsListStore.loadProductsOfUser(this.uidToEdit);
        }
      });
    } else {
      this.productsListStore.loadProductsOfUser(this.uidToEdit);
    }
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
    this.productsListStore.goToEditProduct({ productUid: element.uid, currentRoute: this.activatedRoute });
  }
}
