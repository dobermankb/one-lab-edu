import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductInternalModel } from '@core/model/product_internal.model';
import { ProductModel } from '@core/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductInternalService {

  private readonly apiUrl = 'products_internal';

  constructor(private firebaseFirestore: AngularFirestore) { }

  getAllProductsInternal(): Observable<ProductInternalModel[]> {
    return this.firebaseFirestore
      .collection<ProductInternalModel>(`${this.apiUrl}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError(error => {
          return of([] as ProductInternalModel[]);
        })
      );
  }

  getProductInternal$ = (uid: string) =>
    this.firebaseFirestore
      .doc<ProductInternalModel>(`${this.apiUrl}/${uid}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError(error => {
          return of(null);
        })
      )
  getCheckedProductInternalWithBarcode$ = (barcode?: string) =>
    this.firebaseFirestore
      .collection<ProductInternalModel>(`${this.apiUrl}`,
        ref => ref.where('barcode', '==', barcode))
      .valueChanges()
      .pipe(
        map(productsInternal => productsInternal.filter(productInternal => productInternal.status)),
        map(productsInternal => productsInternal.length > 0 ? productsInternal[0] : null),
        take(1),
        catchError(error => of(null))
      )

  setProductInternal = (productInternalModel: ProductInternalModel) =>
    this.firebaseFirestore
      .doc<ProductInternalModel>(`${this.apiUrl}/${productInternalModel.uid}`)
      .set(productInternalModel)

  addProductInternal = (productInternalModel: ProductInternalModel) =>
    this.firebaseFirestore
      .collection<ProductInternalModel>(`${this.apiUrl}`)
      .add(productInternalModel)
      .then(docRef => {
        this.setProductInternal({ ...productInternalModel, uid: docRef.id });
        return docRef.id;
      })
  deleteProductInternal = (productInternalModel: ProductInternalModel) =>
    this.firebaseFirestore
      .doc<ProductInternalModel>(`${this.apiUrl}/${productInternalModel.uid}`)
      .delete()
}
