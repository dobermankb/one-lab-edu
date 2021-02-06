import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { DestroyService } from '@shared/service/destroy.service';
import { ProductEditComponentStoreService } from './component-store/product-edit.component-store.service';
import { ProductModel } from '@core/model/product.model';
import { getCurrentRouteState } from '@core/store/router/router.selector';
import { RootState } from '@core/store';
import { RouterStateUrl } from '@core/store/router/router.state';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  providers: [ProductEditComponentStoreService, DestroyService]
})
export class ProductEditComponent implements OnInit, OnDestroy {
  private readonly MAX_LENGTH = 50;

  productEditForm?: FormGroup;
  userUid?: string;

  productToEdit$ = this.productEditStore.product$;
  isLoading$ = this.productEditStore.isLoading$;
  errorMsg$ = this.productEditStore.errorMsg$;
  successMsg$ = this.productEditStore.successMsg$;

  constructor(private productEditStore: ProductEditComponentStoreService,
              private formBuilder: FormBuilder,
              private destroyService$: DestroyService,
              private store: Store<RootState>) {
  }

  ngOnInit(): void {
    this.store.select(getCurrentRouteState).pipe(
      takeUntil(this.destroyService$)
    ).subscribe(
      (routeStateUnknown: unknown) => {
        const routeState = routeStateUnknown as RouterStateUrl;
        const { productUid, userUid } = routeState.params;
        if (!!productUid) {
          this.productEditStore.loadProduct(productUid);
        }
        if (!!userUid) {
          this.userUid = userUid;
        }
      }
    );
    this.productToEdit$.pipe(
      filter(product => !!product),
      distinctUntilChanged(),
      takeUntil(this.destroyService$)
    ).subscribe(
      product => {
        if (product) {
          this.productEditForm = this.formBuilder.group(
            {
              uid: [product.uid, [Validators.required]],
              userUid: [product.userUid, [Validators.required]],
              categoryUid: [product.categoryUid, [Validators.required]],
              barcode: [product.barcode, [Validators.required]],
              name: [product.name, [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
              imageUrl: [product.imageUrl, [Validators.required]],
              price: [product.price, [
                Validators.required,
                Validators.pattern('^([\\d]*[,.]?[\\d]*)$')]],
              description: [product.description, [Validators.required, Validators.maxLength(this.MAX_LENGTH * 4)]],
            }
          );
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.productEditForm?.reset();
  }

  get name(): AbstractControl | null | undefined {
    return this.productEditForm?.get('name');
  }

  get imageUrl(): AbstractControl | null | undefined {
    return this.productEditForm?.get('imageUrl');
  }

  get price(): AbstractControl | null | undefined {
    return this.productEditForm?.get('price');
  }

  get description(): AbstractControl | null | undefined {
    return this.productEditForm?.get('description');
  }

  onSubmit(): void {
    if (this.productEditForm?.invalid) {
      return;
    }
    this.productEditStore.setProduct(this.productEditForm?.getRawValue() as ProductModel);
  }

  onNavigateToList(): void {
    this.productEditStore.goToList(this.userUid);
  }
}
