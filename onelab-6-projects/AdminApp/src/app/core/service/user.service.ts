import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserModel } from '@core/model/user.model';
import { catchError } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firebaseFirestore: AngularFirestore) { }

  get allUsers$(): Observable<UserModel[]> {
    return this.firebaseFirestore.collection<UserModel>(`users`).valueChanges()
      .pipe(
        catchError(error => {
          return of([] as UserModel[]);
        })
      );
  }

  getUser$(uid: string): Observable<UserModel | undefined | null> {
    return this.firebaseFirestore.doc<UserModel>(`users/${uid}`).valueChanges()
      .pipe(
        catchError(error => {
          return of(null);
        })
      );
  }
}
