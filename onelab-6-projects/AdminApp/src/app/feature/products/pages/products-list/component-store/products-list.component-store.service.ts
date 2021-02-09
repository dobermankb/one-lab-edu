import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ProductModel } from '@core/model/product.model';
import { ProductService } from '@core/service/product.service';
import { UserModel } from '@core/model/user.model';
import { UserService } from '@core/service/user.service';

interface ProductsListState {
  user?: UserModel | null;
  products: ProductModel[];
  isLoading: boolean;
  errorMsg?: string | null;
}

@Injectable()
export class ProductsListComponentStoreService extends ComponentStore<ProductsListState> {
  constructor(private productService: ProductService,
              private userService: UserService,
              private router: Router) {
    super({
      user: null,
      products: [],
      errorMsg: null,
      isLoading: false
    });
  }
  readonly user$: Observable<UserModel | null | undefined> = this.select(state => state.user);
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

  readonly updateUser = this.updater((state: ProductsListState, user: UserModel | null | undefined) => {
    return {
      ...state,
      user
    };
  });

  readonly loadUser = this.effect((userUid$: Observable<string>) => {
    return userUid$.pipe(
      switchMap((userUid: string) => {
        this.setLoading(true);
        return this.userService.getUser$(userUid).pipe(
          tapResponse(
            user => {
              this.setLoading(false);
              this.updateError(null);
              this.updateUser(user);
            },
            (error) => {
              this.updateError(String(error));
              this.setLoading(false);
            }
          ),
          catchError(() => {
            this.setLoading(false);
            return of(null);
          })
        );
      })
    );
  });

  readonly loadProductsOfUser = this.effect((userUid$: Observable<string>) => {
    return userUid$.pipe(
      switchMap((userUid: string) => {
        this.setLoading(true);
        return this.productService.getAllProductsOfUser$(userUid).pipe(
          tapResponse(
            products => {
              this.setLoading(false);
              this.updateError(null);
              this.updateProducts(products);
            },
            (error) => {
              this.updateError(String(error));
              this.setLoading(false);
            }
          ),
          catchError(() => {
            this.setLoading(false);
            return of([]);
          })
        );
      })
    );
  });

  readonly deleteProduct = this.effect((productToDelete$: Observable<ProductModel>) => {
    return productToDelete$.pipe(
      switchMap((productToDelete: ProductModel) => {
        this.setLoading(true);
        return from(this.productService.deleteProduct(productToDelete)).pipe(
          tapResponse(
            successful => {
              this.setLoading(false);
              this.updateError(null);
              this.updateProducts(
                this.products$.pipe(
                  take(1),
                  map(products => {
                    return products.filter(product => product.uid !== productToDelete.uid);
                  }),
                  catchError(error => of([]))
                )
              );
            },
            (error) => {
              this.updateError(String(error));
              this.setLoading(false);
            }
          ),
          catchError(() => {
            this.setLoading(false);
            return of(null);
          })
        );
      })
    );
  });


  readonly goToEditProduct =
    this.effect((params$: Observable<{ productUid: string, userUid: string | undefined }>) => {
    return params$.pipe(
      switchMap(({ productUid, userUid }) => {
        if (!!userUid) {
          return from(this.router.navigate([`products/list/${userUid}/edit/${productUid}`]));
        } else {
          return from(this.router.navigate([`products/list/edit/${productUid}`]));
        }
      })
    );
  });
  readonly goToAddProduct =
    this.effect((params$: Observable<{ userUid: string | undefined }>) => {
      return params$.pipe(
        switchMap(({ userUid }) => {
          if (!!userUid) {
            return from(this.router.navigate([`products/list/${userUid}/add`]));
          } else {
            return from(this.router.navigate([`products/list/add`]));
          }
        })
      );
    });
}
