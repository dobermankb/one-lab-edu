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
import { DeliveryOptionsModel } from '@core/model/delivery-options.model';
import { ProductParameters } from '@core/model/parameters.model';

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

  categories$ = this.productEditStore.categories$;
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
    this.productEditStore.loadAllLeafCategories();
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
              internalUid: [product.uid, [Validators.required]],
              userUid: [product.userUid, [Validators.required]],
              barcode: [product.barcode, [Validators.required]],
              price: [product.price, [
                Validators.required,
                Validators.pattern('^([\\d]*[,.]?[\\d]*)$')]],
              categoryName: [product.categoryName, [Validators.nullValidator]],
              deliveryOptionsPickup: [product.deliveryOptions.pickup, [Validators.required]],
              deliveryOptionsDelivery: [product.deliveryOptions.delivery, [Validators.required]],
              parametersHeight: [product.parameters.height, [Validators.required]],
              parametersWidth: [product.parameters.width, [Validators.required]],
              parametersLength: [product.parameters.length, [Validators.required]],
              parametersWeight: [product.parameters.weight, [Validators.required]],
              status: [product.status, [Validators.required]],
              name: [product.name, [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
              description: [product.description, [Validators.required, Validators.maxLength(this.MAX_LENGTH * 4)]],
            }
          );
          this.barcode?.disable();
          this.categoryName?.disable();
          this.status?.disable();
          this.name?.disable();
          this.description?.disable();
          this.parametersHeight?.disable();
          this.parametersWidth?.disable();
          this.parametersLength?.disable();
          this.parametersWeight?.disable();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.productEditForm?.reset();
  }

  get price(): AbstractControl | null | undefined {
    return this.productEditForm?.get('price');
  }

  get description(): AbstractControl | null | undefined {
    return this.productEditForm?.get('description');
  }

  get barcode(): AbstractControl | null | undefined {
    return this.productEditForm?.get('barcode');
  }

  get categoryName(): AbstractControl | null | undefined {
    return this.productEditForm?.get('categoryName');
  }

  get status(): AbstractControl | null | undefined {
    return this.productEditForm?.get('status');
  }
  get parametersHeight(): AbstractControl | null | undefined {
    return this.productEditForm?.get('parametersHeight');
  }

  get parametersWidth(): AbstractControl | null | undefined {
    return this.productEditForm?.get('parametersWidth');
  }

  get parametersLength(): AbstractControl | null | undefined {
    return this.productEditForm?.get('parametersLength');
  }

  get parametersWeight(): AbstractControl | null | undefined {
    return this.productEditForm?.get('parametersWeight');
  }

  get deliveryOptionsPickup(): AbstractControl | null | undefined {
    return this.productEditForm?.get('deliveryOptionsPickup');
  }

  get deliveryOptionsDelivery(): AbstractControl | null | undefined {
    return this.productEditForm?.get('deliveryOptionsDelivery');
  }

  get name(): AbstractControl | null | undefined {
    return this.productEditForm?.get('name');
  }

  onSubmit(): void {
    if (this.productEditForm?.invalid) {
      return;
    }
    const submitProduct = {
      uid: this.productEditForm?.get('uid')?.value,
      barcode: this.productEditForm?.get('barcode')?.value,
      userUid: this.productEditForm?.get('userUid')?.value,
      internalUid: this.productEditForm?.get('internalUid')?.value,
      price: this.productEditForm?.get('price')?.value,
      deliveryOptions: {
        pickup: this.productEditForm?.get('deliveryOptionsPickup')?.value,
        delivery: this.productEditForm?.get('deliveryOptionsDelivery')?.value
      } as DeliveryOptionsModel,

      categoryName: this.productEditForm?.get('categoryName')?.value,
      description: this.productEditForm?.get('description')?.value,
      name: this.productEditForm?.get('name')?.value,
      parameters: {
        height: this.productEditForm?.get('parametersHeight')?.value,
        width: this.productEditForm?.get('parametersWidth')?.value,
        length: this.productEditForm?.get('parametersLength')?.value,
        weight: this.productEditForm?.get('parametersWeight')?.value
      } as ProductParameters,
      status: this.productEditForm?.get('status')?.value,
    } as ProductModel;
    this.productEditStore.setProduct(submitProduct);
  }

  onNavigateToList(): void {
    this.productEditStore.goToList(this.userUid);
  }
}
