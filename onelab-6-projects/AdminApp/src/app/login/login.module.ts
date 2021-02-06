import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularFireAuthModule} from '@angular/fire/auth';

import {AngularFireModule} from '@angular/fire';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule } from '@ngrx/store-devtools';
import {UserEffects} from './effects/post.effects';
import {userReducer} from './reducers/post.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBeX4TqKbPmmuO3JKGUfN3w1ZzxnrYyHuQ",
      authDomain: "authentication-angular-37dd6.firebaseapp.com",
      projectId: "authentication-angular-37dd6",
      storageBucket: "authentication-angular-37dd6.appspot.com",
      messagingSenderId: "971034098233",
      appId: "1:971034098233:web:f47323c25bbed673b36be8"
    }),
    AngularFireAuthModule,
    //EffectsModule.forRoot([UserEffects]),
    //StoreModule.forRoot({user: userReducer}),
    //StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [UserEffects],
})
export class LoginModule { }
