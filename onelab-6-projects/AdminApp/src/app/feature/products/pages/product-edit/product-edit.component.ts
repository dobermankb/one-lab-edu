import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';


import { DestroyService } from '@shared/service/destroy.service';
import { ProductEditComponentStoreService } from './component-store/product-edit.component-store.service';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { ProductModel } from '@core/model/product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  providers: [ProductEditComponentStoreService, DestroyService]
})
export class ProductEditComponent implements OnInit {
  private readonly MAX_LENGTH = 50;

  productEditForm?: FormGroup;

  productToEdit$ = this.productEditStore.product$;
  isLoading$ = this.productEditStore.isLoading$;
  errorMsg$ = this.productEditStore.errorMsg$;
  successMsg$ = this.productEditStore.successMsg$;

  constructor(private activatedRoute: ActivatedRoute,
              private sessionStore: Store<SessionUserState>,
              private productEditStore: ProductEditComponentStoreService,
              private formBuilder: FormBuilder,
              private destroyService$: DestroyService) { }

  ngOnInit(): void {
    this.productEditStore.loadProduct(this.activatedRoute.snapshot.paramMap.get('productUid') || '');
    this.productToEdit$.pipe(takeUntil(this.destroyService$)).subscribe(
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
    // console.log(this.productEditForm?.getRawValue() as ProductModel);
    this.productEditStore.setProduct(this.productEditForm?.getRawValue() as ProductModel);
  }
}
