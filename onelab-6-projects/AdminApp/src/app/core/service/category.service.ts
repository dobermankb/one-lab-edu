import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { CategoryModel } from '@core/model/Category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = 'categories';

  constructor(private firebaseFirestore: AngularFirestore) { }

  getAllLeafCategories(): Observable<CategoryModel[]> {
    return this.firebaseFirestore
      .collection<CategoryModel>(`${this.apiUrl}`,
        ref => ref.where('level', '==', 3))
      .valueChanges()
      .pipe(
        map(categories => categories.sort(
          (categoryA, categoryB) => categoryA.name.localeCompare(categoryB.name))),
        take(1),
        catchError(error => {
          return of([] as CategoryModel[]);
        })
      );
  }
}
