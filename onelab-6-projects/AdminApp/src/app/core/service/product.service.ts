import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductModel } from '@core/model/product.model';
import { ProductInternalModel } from '@core/model/product_internal.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firebaseFirestore: AngularFirestore) { }

  getAllProducts(): Observable<ProductModel[]> {
    return this.firebaseFirestore.collection<ProductModel>(`products`).valueChanges()
      .pipe(
        take(1),
        catchError(error => {
          return of([] as ProductModel[]);
        })
      );
  }

  getAllProductsOfUser$(userUid: string): Observable<ProductModel[]> {
    return this.firebaseFirestore.collection<ProductModel>('products',
        ref => ref.where('userUid', '==', userUid)).valueChanges().pipe(
      take(1),
      catchError(error => of([] as ProductModel[]))
    );
  }

  getProduct$ = (uid: string) => this.firebaseFirestore.doc<ProductModel>(`products/${uid}`).valueChanges()
    .pipe(
      take(1),
      catchError(error => {
        return of(null);
      })
    )

  setProduct = (productModel: ProductModel) =>
    this.firebaseFirestore.doc<ProductModel>(`products/${productModel.uid}`).set(productModel)

  addProduct = (productModel: ProductModel) =>
    this.firebaseFirestore.collection<ProductModel>(`products`).add(productModel)
      .then(docRef => {
        return this.setProduct({ ...productModel, uid: docRef.id });
      })
  deleteProduct = (productModel: ProductModel) =>
    this.firebaseFirestore.doc<ProductModel>(`products/${productModel.uid}`).delete()
}
