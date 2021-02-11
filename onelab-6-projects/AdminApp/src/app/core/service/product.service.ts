import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductModel } from '@core/model/product.model';
import { ProductInternalModel } from '@core/model/product_internal.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'products';

  constructor(private firebaseFirestore: AngularFirestore) { }

  getAllProducts(): Observable<ProductModel[]> {
    return this.firebaseFirestore
      .collection<ProductModel>(`${this.apiUrl}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError(error => {
          return of([] as ProductModel[]);
        })
      );
  }

  getAllProductsOfUser$(userUid: string): Observable<ProductModel[]> {
    return this.firebaseFirestore
      .collection<ProductModel>(`${this.apiUrl}`,
        ref => ref.where('userUid', '==', userUid))
      .valueChanges()
      .pipe(
        take(1),
        catchError(error => of([] as ProductModel[]))
      );
  }

  getProduct$ = (uid: string) => this.firebaseFirestore
    .doc<ProductModel>(`${this.apiUrl}/${uid}`)
    .valueChanges()
    .pipe(
      take(1),
      catchError(error => {
        return of(null);
      })
    )

  setProduct = (productModel: ProductModel) =>
    this.firebaseFirestore
      .doc<ProductModel>(`${this.apiUrl}/${productModel.uid}`)
      .set(productModel)

  addProduct = (productModel: ProductModel) =>
    this.firebaseFirestore
      .collection<ProductModel>(`${this.apiUrl}`)
      .add(productModel)
      .then(docRef => {
        return this.setProduct({ ...productModel, uid: docRef.id });
      })
  deleteProduct = (productModel: ProductModel) =>
    this.firebaseFirestore
      .doc<ProductModel>(`${this.apiUrl}/${productModel.uid}`)
      .delete()
}
