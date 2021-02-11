import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserModel } from '@core/model/user.model';
import { catchError, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'users';

  constructor(private firebaseFirestore: AngularFirestore) { }

  getAllUsers$(): Observable<UserModel[]> {
    return this.firebaseFirestore
      .collection<UserModel>(`${this.apiUrl}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError(error => {
          return of([] as UserModel[]);
        })
      );
  }

  getUser$ = (uid: string) =>
    this.firebaseFirestore
      .doc<UserModel>(`${this.apiUrl}/${uid}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError(error => {
          return of(null);
        })
      )

  setUser = (userModel: UserModel) =>
    this.firebaseFirestore
      .doc<UserModel>(`${this.apiUrl}/${userModel.uid}`)
      .set(userModel)
}
