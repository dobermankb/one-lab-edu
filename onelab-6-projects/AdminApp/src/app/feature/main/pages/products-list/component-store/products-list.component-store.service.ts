import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProductModel } from '@core/model/product.model';
import { ProductService } from '@core/service/product.service';

interface ProductsListState {
  products: ProductModel[];
  isLoading: boolean;
  errorMsg?: string | null;
}

@Injectable()
export class ProductsListComponentStoreService extends ComponentStore<ProductsListState> {
  constructor(private productService: ProductService, private router: Router) {
    super({
      products: [],
      errorMsg: null,
      isLoading: false
    });
  }
  readonly products$: Observable<ProductModel[]> = this.select(state => state.products);
  readonly isLoading$: Observable<boolean> = this.select(state => state.isLoading);
  readonly errorMsg$: Observable<string | null | undefined> = this.select(state => state.errorMsg);

  readonly updateError = this.updater((state: ProductsListState, errorMsg: string | null | undefined) => {
    return {
      ...state,
      errorMsg
    };
  });

  readonly setLoading = this.updater((state: ProductsListState, isLoading: boolean) => {
    return {
      ...state,
      isLoading
    };
  });

  readonly updateProducts = this.updater((state: ProductsListState, products: ProductModel[]) => {
    return {
      ...state,
      products
    };
  });

  readonly loadProductsOfUser = this.effect((userUid$: Observable<string>) => {
    return userUid$.pipe(
      switchMap((userUid: string) => {
        this.setLoading(true);
        return this.productService.getAllProductsOfUser$(userUid).pipe(
          tapResponse(
            products => {
              console.log('products = ', products);
              this.setLoading(false);
              this.updateError(null);
              this.updateProducts(products);
            },
            (error) => this.updateError(String(error))
          ),
          catchError(() => of([]))
        );
      })
    );
  });
}
