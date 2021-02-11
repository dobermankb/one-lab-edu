import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ProductModel } from '@core/model/product.model';
import { ProductService } from '@core/service/product.service';
import { CategoryModel } from '@core/model/Category.model';
import { CategoryService } from '@core/service/category.service';
import { ProductInternalModel } from '@core/model/product_internal.model';
import { ProductInternalService } from '@core/service/product-internal.service';

enum LOADING_STATE {
  INIT,
  LOADING,
  LOADED
}

interface ProductAddState {
  productInternal?: ProductInternalModel | null;
  categories: CategoryModel[];
  loadingState: LOADING_STATE;
  errorMsg?: string | null;
  successMsg?: string | null;
}

@Injectable()
export class ProductAddComponentStoreService extends ComponentStore<ProductAddState> {
  constructor(private productService: ProductService,
              private productInternalService: ProductInternalService,
              private categoryService: CategoryService,
              private router: Router) {
    super({
      productInternal: undefined,
      categories: [],
      errorMsg: null,
      successMsg: null,
      loadingState: LOADING_STATE.INIT
    });
  }
  readonly productInternal$: Observable<ProductInternalModel | null | undefined> = this.select(state => state.productInternal);
  readonly categories$: Observable<CategoryModel[]> = this.select(state => state.categories);
  readonly isLoading$: Observable<boolean> = this.select(state => state.loadingState === LOADING_STATE.LOADING);
  readonly isLoaded$: Observable<boolean> = this.select(state => state.loadingState === LOADING_STATE.LOADED);
  readonly errorMsg$: Observable<string | null | undefined> = this.select(state => state.errorMsg);
  readonly successMsg$: Observable<string | null | undefined> = this.select(state => state.successMsg);

  readonly updateError = this.updater((state: ProductAddState, errorMsg: string | null | undefined) => {
    return {
      ...state,
      errorMsg
    };
  });

  readonly updateSuccessMsg = this.updater((state: ProductAddState, successMsg: string | null | undefined) => {
    return {
      ...state,
      successMsg
    };
  });

  readonly setLoading = this.updater((state: ProductAddState, loadingState: LOADING_STATE) => {
    return {
      ...state,
      loadingState
    };
  });

  readonly updateCategories = this.updater((state: ProductAddState, categories: CategoryModel[]) => {
    return {
      ...state,
      categories
    };
  });

  readonly updateProductInternal = this.updater((state: ProductAddState, productInternal: ProductInternalModel | null | undefined) => {
    return {
      ...state,
      productInternal
    };
  });

  readonly loadProductInternal = this.effect((barcode$: Observable<string | undefined>) => {
    return barcode$.pipe(
      switchMap((barcode: string | undefined) => {
        this.setLoading(LOADING_STATE.LOADING);
        this.updateSuccessMsg(null);
        return this.productInternalService.getCheckedProductInternalWithBarcode$(barcode).pipe(
          tapResponse(
            productInternal => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(null);
              this.updateProductInternal(productInternal);
            },
            (error) => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(String(error));
            }
          ),
          catchError(() => {
            this.setLoading(LOADING_STATE.LOADED);
            return of([]);
          })
        );
      })
    );
  });


  readonly loadAllLeafCategories = this.effect((dummy$: Observable<void>) => {
    return dummy$.pipe(
      switchMap(() => {
        this.setLoading(LOADING_STATE.LOADING);
        this.updateSuccessMsg(null);
        return this.categoryService.getAllLeafCategories().pipe(
          tapResponse(
            categories => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(null);
              this.updateCategories(categories);
            },
            (error) => {
              this.setLoading(LOADING_STATE.LOADED);
              this.updateError(String(error));
            }
          ),
          catchError(() => {
            this.setLoading(LOADING_STATE.LOADED);
            return of([]);
          })
        );
      })
    );
  });

  readonly addProduct = this.effect((product$: Observable<{ product: ProductModel, productInternal: ProductInternalModel}>) => {
    return product$.pipe(
      switchMap(({ product, productInternal}) => {
        this.setLoading(LOADING_STATE.LOADING);
        this.updateSuccessMsg(null);
        return this.productInternal$.pipe(
          take(1),
          switchMap(thisProductInternal => {
            if (!!thisProductInternal) {
              return from(this.productService.addProduct(product)).pipe(
                tapResponse(
                  successful => {
                    this.setLoading(LOADING_STATE.LOADED);
                    this.updateError(null);
                    this.updateSuccessMsg('Successfully added the product');
                  },
                  (error) => {
                    this.setLoading(LOADING_STATE.LOADED);
                    this.updateError(String(error));
                  }
                ),
                catchError(() => {
                  this.setLoading(LOADING_STATE.LOADED);
                  return of(null);
                })
              );
            } else {
              return from(this.productInternalService.addProductInternal(productInternal)).pipe(
                switchMap((internalUid: string) => from(this.productService.addProduct({
                  ...product,
                  internalUid
                }))),
                tapResponse(
                  successful => {
                    this.setLoading(LOADING_STATE.LOADED);
                    this.updateError(null);
                    this.updateSuccessMsg('Successfully added to the queue for checking');
                  },
                  (error) => {
                    this.setLoading(LOADING_STATE.LOADED);
                    this.updateError(String(error));
                  }
                ),
                catchError(() => {
                  this.setLoading(LOADING_STATE.LOADED);
                  return of(null);
                })
              );
            }
          })
        );
      })
    );
  });
  readonly goToList = this.effect((userUid$: Observable<string | undefined>) => {
    return userUid$.pipe(
      switchMap((userUid?: string) => {
        if (!!userUid) {
          return from(this.router.navigate([`products/list/${userUid}`]));
        } else {
          return from(this.router.navigate([`products/list`]));
        }
      })
    );
  });
}
