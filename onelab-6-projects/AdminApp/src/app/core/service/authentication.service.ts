import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel } from '@core/model/user.model';
import { SessionUserModel } from '@core/model/session-user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly apiUrl = 'users';

  constructor(private firebaseAuth: AngularFireAuth,
              private firebaseFirestore: AngularFirestore) {}
  sessionUser$ = this.firebaseAuth.user
      .pipe(
        switchMap(user => {
          if (user) {
            return this.firebaseFirestore
              .doc<UserModel>(`${this.apiUrl}/${user.uid}`)
              .valueChanges()
              .pipe(
                take(1),
                map(dbUser => {
                  return {
                    uid: dbUser?.uid,
                    role: dbUser?.role
                  } as SessionUserModel;
                }),
                catchError(error => {
                  this.logout();
                  return of(null);
                })
              );
          } else {
            return of(null);
          }
        })
      );

  register = (email: string, password: string) => this.firebaseAuth.createUserWithEmailAndPassword(email, password);
  login = (email: string, password: string) => this.firebaseAuth.signInWithEmailAndPassword(email, password);
  logout = () => this.firebaseAuth.signOut();
}
