import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel } from '@core/model/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private firebaseAuth: AngularFireAuth,
              private firebaseFirestore: AngularFirestore) {}

  register = (email: string, password: string) => this.firebaseAuth.createUserWithEmailAndPassword(email, password);
  login = (email: string, password: string) => this.firebaseAuth.signInWithEmailAndPassword(email, password);
  logout = () => this.firebaseAuth.signOut();
  get sessionUser$(): Observable<UserModel | null | undefined> {
    return this.firebaseAuth.user
      .pipe(
        switchMap(user => {
          if (user) {
            return this.firebaseFirestore.doc<UserModel>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
  }
}
