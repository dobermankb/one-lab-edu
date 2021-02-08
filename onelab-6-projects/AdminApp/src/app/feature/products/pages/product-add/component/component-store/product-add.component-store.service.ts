import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ProductModel } from '@core/model/product.model';
import { ProductService } from '@core/service/product.service';
import { CategoryModel } from '@core/model/Category.model';
import { CategoryService } from '@core/service/category.service';

enum LOADING_STATE {
  INIT,
  LOADING,
  LOADED
}

interface ProductAddState {
  categories: CategoryModel[];
  loadingState: LOADING_STATE;
  errorMsg?: string | null;
  successMsg?: string | null;
}

@Injectable()
export class ProductAddComponentStoreService extends ComponentStore<ProductAddState> {
  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private router: Router) {
    super({
      categories: [],
      errorMsg: null,
      successMsg: null,
      loadingState: LOADING_STATE.INIT
    });
  }
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

  readonly addProduct = this.effect((product$: Observable<ProductModel>) => {
    return product$.pipe(
      switchMap((product: ProductModel) => {
        this.setLoading(LOADING_STATE.LOADING);
        this.updateSuccessMsg(null);
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
