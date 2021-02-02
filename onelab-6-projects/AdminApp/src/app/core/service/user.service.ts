import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserModel } from '@core/model/user.model';
import { catchError, finalize, shareReplay, take, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firebaseFirestore: AngularFirestore) { }

  getAllUsers$(): Observable<UserModel[]> {
    return this.firebaseFirestore.collection<UserModel>(`users`).valueChanges()
      .pipe(
        take(1),
        catchError(error => {
          return of([] as UserModel[]);
        })
      );
  }

  getUser$ = (uid: string) => this.firebaseFirestore.doc<UserModel>(`users/${uid}`).valueChanges()
    .pipe(
      take(1),
      catchError(error => {
        return of(null);
      })
    )

  setUser = (userModel: UserModel) =>
    this.firebaseFirestore.doc<UserModel>(`users/${userModel.uid}`).set(userModel)
}
