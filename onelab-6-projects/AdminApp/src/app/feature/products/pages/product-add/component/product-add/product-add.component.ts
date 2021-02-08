import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductAddComponentStoreService } from '../component-store/product-add.component-store.service';
import { DestroyService } from '@shared/service/destroy.service';
import { filter, map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '@core/model/product.model';
import { Store } from '@ngrx/store';
import { RootState } from '@core/store';
import { getCurrentRouteState } from '@core/store/router/router.selector';
import { RouterStateUrl } from '@core/store/router/router.state';
import { selectSessionUser } from '@core/store/session-user/session-user.selector';
import { SessionUserState } from '@core/store/session-user/session-user.state';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  providers: [ProductAddComponentStoreService, DestroyService]
})
export class ProductAddComponent implements OnInit, OnDestroy {

  private readonly MAX_LENGTH = 50;

  productAddForm?: FormGroup;
  userUid?: string;
  sessionUserUid?: string;

  categories$ = this.productAddStore.categories$;
  isLoading$ = this.productAddStore.isLoading$;
  errorMsg$ = this.productAddStore.errorMsg$;
  successMsg$ = this.productAddStore.successMsg$;

  constructor(private productAddStore: ProductAddComponentStoreService,
              private formBuilder: FormBuilder,
              private sessionUserStore: Store<SessionUserState>,
              private store: Store<RootState>,
              private destroyService$: DestroyService) { }

  ngOnInit(): void {
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
        this.productAddForm = this.formBuilder.group(
          {
            userUid: [!!this.userUid ? this.userUid : this.sessionUserUid, [Validators.required]],
            categoryNames: [[], [Validators.nullValidator]],
            barcode: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
            imageUrl: ['', [Validators.nullValidator]],
            price: ['', [
              Validators.required,
              Validators.pattern('^([\\d]*[,.]?[\\d]*)$')]],
            description: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH * 4)]],
          }
        );
      }
    );
    this.productAddStore.loadAllLeafCategories();
  }

  ngOnDestroy(): void {

  }

  get name(): AbstractControl | null | undefined {
    return this.productAddForm?.get('name');
  }

  get imageUrl(): AbstractControl | null | undefined {
    return this.productAddForm?.get('imageUrl');
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

  get categoryNames(): AbstractControl | null | undefined {
    return this.productAddForm?.get('categoryNames');
  }

  onSubmit(): void {
    if (this.productAddForm?.invalid) {
      return;
    }
    this.productAddStore.addProduct(this.productAddForm?.getRawValue() as ProductModel);
  }

  onNavigateToList(): void {
    this.productAddStore.goToList(this.userUid);
  }


}
