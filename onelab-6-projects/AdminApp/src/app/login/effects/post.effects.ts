import {AngularFireDatabase} from '@angular/fire/database';
import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Effect, Actions,ofType} from '@ngrx/effects';
import {User } from '../models/post.model';
import {Observable } from 'rxjs';
import { switchMap,map  } from 'rxjs/operators';
import { from } from 'rxjs';
import firebase from 'firebase';
import { tap } from 'rxjs/operators';
import * as userActions from '../actions/post.actions';
export type Action=userActions.All;
import { of } from 'rxjs';
@Injectable()
export class UserEffects{
    constructor(private actions:Actions,private db:AngularFireDatabase, public firebaseAuth: AngularFireAuth){
    }
    @Effect() 
        getUser: Observable<any> = this.actions.pipe(ofType(userActions.GET_USER),
        map((action: userActions.GetUser) => action.payload )
               ,switchMap(payload => this.firebaseAuth.authState )
               ,map( authData => {
                   if (authData) {
                       /// User logged in
                       const user = new User(authData.uid, authData.displayName || "");
                       return new userActions.LogInSuccess(user);
                   } else {
                       /// User not logged in
                       return new userActions.LogInFailure();
                   }

               })
        );
        @Effect() login$: Observable<Action> = this.actions.pipe(ofType(userActions.GOOGLE_LOGIN),
        map((action: userActions.GoogleLogin) => action.payload),
        switchMap(payload => {
            return from( this.googleLogin() );
        }),
        map( credential => {
            // successful login
            return new userActions.GetUser();
        })
        
        );
      private googleLogin(): Promise<any> {
            const provider = new firebase.auth.GoogleAuthProvider();
            return this.firebaseAuth.signInWithPopup(provider);
        }
        @Effect() logout$: Observable<Action> = this.actions.pipe(ofType(userActions.LOGOUT)
        ,map((action: userActions.Logout) => action.payload )
        ,switchMap(payload => {
            return of( this.firebaseAuth.signOut() );
        })
        ,map( authData => {
            return new userActions.LogInFailure();
        })
        )
}