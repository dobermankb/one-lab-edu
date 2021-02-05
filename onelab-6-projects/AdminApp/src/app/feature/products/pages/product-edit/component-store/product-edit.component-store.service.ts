import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ProductModel } from '@core/model/product.model';
import { ProductService } from '@core/service/product.service';

enum LOADING_STATE {
  INIT,
  LOADING,
  LOADED
}

interface ProductEditState {
  product?: ProductModel | null;
  loadingState: LOADING_STATE;
  errorMsg?: string | null;
  successMsg?: string | null;
}

@Injectable()
export class ProductEditComponentStoreService extends ComponentStore<ProductEditState> {
  constructor(private productService: ProductService,
              private router: Router) {
    super({
      product: null,
      errorMsg: null,
      successMsg: null,
      loadingState: LOADING_STATE.INIT
    });
  }
  readonly product$: Observable<ProductModel | null | undefined> = this.select(state => state.product);
  readonly isLoading$: Observable<boolean> = this.select(state => state.loadingState === LOADING_STATE.LOADING);
  readonly isLoaded$: Observable<boolean> = this.select(state => state.loadingState === LOADING_STATE.LOADED);
  readonly errorMsg$: Observable<string | null | undefined> = this.select(state => state.errorMsg);
  readonly successMsg$: Observable<string | null | undefined> = this.select(state => state.successMsg);

  readonly updateError = this.updater((state: ProductEditState, errorMsg: string | null | undefined) => {
    return {
      ...state,
      errorMsg
    };
  });

  readonly updateSuccessMsg = this.updater((state: ProductEditState, successMsg: string | null | undefined) => {
    return {
      ...state,
      successMsg
    };
  });

  readonly setLoading = this.updater((state: ProductEditState, loadingState: LOADING_STATE) => {
    return {
      ...state,
      loadingState
    };
  });

  readonly updateProduct = this.updater((state: ProductEditState, product: ProductModel | null | undefined) => {
    return {
      ...state,
      product
    };
  });

  readonly loadProduct = this.effect((productUid$: Observable<string>) => {
    return productUid$.pipe(
      switchMap((productUid: string) => {
        this.setLoading(LOADING_STATE.LOADING);
        return this.productService.getProduct$(productUid).pipe(
          tapResponse(
            product => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(null);
              this.updateProduct(product);
            },
            (error) => this.updateError(String(error))
          ),
          catchError(() => EMPTY)
        );
      })
    );
  });
  readonly setProduct = this.effect((product$: Observable<ProductModel>) => {
    return product$.pipe(
      switchMap((product: ProductModel) => {
        this.setLoading(LOADING_STATE.LOADING);
        this.updateSuccessMsg(null);
        return from(this.productService.setProduct(product)).pipe(
          tapResponse(
            successful => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(null);
              this.updateSuccessMsg('Successfully updated the product');
              this.updateProduct(product);
            },
            (error) => this.updateError(String(error))
          ),
          catchError(() => of(null))
        );
      })
    );
  });
  readonly goToList = this.effect((dummy$: Observable<void>) => {
    return dummy$.pipe(
      switchMap(() => {
        return from(this.router.navigate([`users/list`]));
      })
    );
  });
  readonly goToProducts = this.effect((uid$: Observable<string>) => {
    return uid$.pipe(
      switchMap((uid: string) => {
        return from(this.router.navigate([`products/list/${uid}`]));
      })
    );
  });
}
