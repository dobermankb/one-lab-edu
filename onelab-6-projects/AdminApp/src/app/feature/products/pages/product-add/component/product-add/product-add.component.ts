import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductAddComponentStoreService } from '../component-store/product-add.component-store.service';
import { DestroyService } from '@shared/service/destroy.service';
import { filter, map, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '@core/model/product.model';
import { Store } from '@ngrx/store';
import { RootState } from '@core/store';
import { getCurrentRouteState } from '@core/store/router/router.selector';
import { RouterStateUrl } from '@core/store/router/router.state';
import { selectSessionUser } from '@core/store/session-user/session-user.selector';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { ProductInternalModel } from '@core/model/product_internal.model';
import { DeliveryOptionsModel } from '@core/model/delivery-options.model';
import { ProductParameters } from '@core/model/parameters.model';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  providers: [ProductAddComponentStoreService, DestroyService]
})
export class ProductAddComponent implements OnInit, OnDestroy {

  private readonly MAX_LENGTH = 50;

  productAddForm?: FormGroup = this.formBuilder.group({
    barcode: ['', [Validators.required]]
  });
  checkedOnce = false;

  userUid?: string;
  sessionUserUid?: string;

  categories: string[] = [];
  categories$ = this.productAddStore.categories$;
  isLoading$ = this.productAddStore.isLoading$;
  errorMsg$ = this.productAddStore.errorMsg$;
  successMsg$ = this.productAddStore.successMsg$;

  constructor(private productAddStore: ProductAddComponentStoreService,
              private formBuilder: FormBuilder,
              private sessionUserStore: Store<SessionUserState>,
              private store: Store<RootState>,
              private destroyService$: DestroyService) { }

  filteredCategories = this.categoryName?.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categories.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.categories$
      .pipe(
        takeUntil(this.destroyService$)
      ).subscribe(categories => {
        this.categories = categories.map(category => category.name);
    });
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
          this.userUid = userUid;
        } else if (!!sessionUser) {
          this.userUid = undefined;
          this.sessionUserUid = sessionUser.uid;
        }
      }
    );
    this.productAddStore.loadAllLeafCategories();
  }

  ngOnDestroy(): void {

  }

  get name(): AbstractControl | null | undefined {
    return this.productAddForm?.get('name');
  }

  get price(): AbstractControl | null | undefined {
    return this.productAddForm?.get('price');
  }

  get description(): AbstractControl | null | undefined {
    return this.productAddForm?.get('description');
  }

  get barcode(): AbstractControl | null | undefined {
    return this.productAddForm?.get('barcode');
  }

  get categoryName(): AbstractControl | null | undefined {
    return this.productAddForm?.get('categoryName');
  }

  get status(): AbstractControl | null | undefined {
    return this.productAddForm?.get('status');
  }
  get parametersHeight(): AbstractControl | null | undefined {
    return this.productAddForm?.get('parametersHeight');
  }

  get parametersWidth(): AbstractControl | null | undefined {
    return this.productAddForm?.get('parametersWidth');
  }

  get parametersLength(): AbstractControl | null | undefined {
    return this.productAddForm?.get('parametersLength');
  }

  get parametersWeight(): AbstractControl | null | undefined {
    return this.productAddForm?.get('parametersWeight');
  }

  get deliveryOptionsPickup(): AbstractControl | null | undefined {
    return this.productAddForm?.get('deliveryOptionsPickup');
  }

  get deliveryOptionsDelivery(): AbstractControl | null | undefined {
    return this.productAddForm?.get('deliveryOptionsDelivery');
  }

  onReset(): void {
    this.checkedOnce = false;
    this.productAddForm = this.formBuilder.group({
      barcode: ['', [Validators.required]]
    });
  }

  onCheckBarcode(): void {
    if (!this.barcode?.valid) {
      return;
    }
    this.checkedOnce = true;
    this.productAddStore.loadProductInternal(this.barcode?.value);
    this.productAddStore.productInternal$
      .pipe(
        takeUntil(this.destroyService$)
      ).subscribe(
      productInternal => {
        if (!!productInternal) {
          this.productAddForm = this.formBuilder.group(
            {
              internalUid: [productInternal.uid],
              userUid: [!!this.userUid ? this.userUid : this.sessionUserUid, [Validators.required]],
              categoryName: [productInternal.categoryName, [Validators.nullValidator]],
              barcode: [productInternal.barcode, [Validators.required]],
              deliveryOptionsPickup: [false, [Validators.required]],
              deliveryOptionsDelivery: [false, [Validators.required]],
              parametersHeight: [productInternal.parameters.height, [Validators.required]],
              parametersWidth: [productInternal.parameters.width, [Validators.required]],
              parametersLength: [productInternal.parameters.length, [Validators.required]],
              parametersWeight: [productInternal.parameters.weight, [Validators.required]],
              status: [productInternal.status, [Validators.required]],
              name: [productInternal.name, [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
              price: ['', [
                Validators.required,
                Validators.pattern('^([\\d]*[,.]?[\\d]*)$')]],
              description: [productInternal.description, [Validators.required, Validators.maxLength(this.MAX_LENGTH * 4)]],
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
        } else {
          this.productAddForm = this.formBuilder.group(
            {
              userUid: [!!this.userUid ? this.userUid : this.sessionUserUid, [Validators.required]],
              categoryName: ['', [Validators.nullValidator]],
              barcode: [this.barcode?.value, [Validators.required]],
              deliveryOptionsPickup: [false, [Validators.required]],
              deliveryOptionsDelivery: [false, [Validators.required]],
              parametersHeight: ['', [Validators.required]],
              parametersWidth: ['', [Validators.required]],
              parametersLength: ['', [Validators.required]],
              parametersWeight: ['', [Validators.required]],
              status: [false, [Validators.required]],
              name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
              price: ['', [
                Validators.required,
                Validators.pattern('^([\\d]*[,.]?[\\d]*)$')]],
              description: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH * 4)]],
            }
          );
          this.barcode?.disable();
          this.filteredCategories = this.categoryName?.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
      }
    );
  }

  onSubmit(): void {
    if (this.productAddForm?.invalid) {
      return;
    }
    const submitProduct = {
      barcode: this.productAddForm?.get('barcode')?.value,
      userUid: this.productAddForm?.get('userUid')?.value,
      internalUid: this.productAddForm?.get('internalUid')?.value,
      price: this.productAddForm?.get('price')?.value,
      deliveryOptions: {
        pickup: this.productAddForm?.get('deliveryOptionsPickup')?.value,
        delivery: this.productAddForm?.get('deliveryOptionsDelivery')?.value
      } as DeliveryOptionsModel,

      categoryName: this.productAddForm?.get('categoryName')?.value,
      description: this.productAddForm?.get('description')?.value,
      name: this.productAddForm?.get('name')?.value,
      parameters: {
        height: this.productAddForm?.get('parametersHeight')?.value,
        width: this.productAddForm?.get('parametersWidth')?.value,
        length: this.productAddForm?.get('parametersLength')?.value,
        weight: this.productAddForm?.get('parametersWeight')?.value
      } as ProductParameters,
      status: this.productAddForm?.get('status')?.value,
    } as ProductModel;
    const submitProductInternal = {
      categoryName: this.productAddForm?.get('categoryName')?.value,
      barcode: this.productAddForm?.get('barcode')?.value,
      description: this.productAddForm?.get('description')?.value,
      name: this.productAddForm?.get('name')?.value,
      parameters: {
        height: this.productAddForm?.get('parametersHeight')?.value,
        width: this.productAddForm?.get('parametersWidth')?.value,
        length: this.productAddForm?.get('parametersLength')?.value,
        weight: this.productAddForm?.get('parametersWeight')?.value
      } as ProductParameters,
      status: this.productAddForm?.get('status')?.value,
    } as ProductInternalModel;

    this.productAddStore.addProduct({ product: submitProduct, productInternal: submitProductInternal });
  }

  onNavigateToList(): void {
    this.productAddStore.goToList(this.userUid);
  }
}
