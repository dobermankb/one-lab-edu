import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule } from '@ngrx/store-devtools';
import {UserEffects} from './effects/post.effects';
import {userReducer} from './reducers/post.reducer';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBeX4TqKbPmmuO3JKGUfN3w1ZzxnrYyHuQ",
      authDomain: "authentication-angular-37dd6.firebaseapp.com",
      projectId: "authentication-angular-37dd6",
      storageBucket: "authentication-angular-37dd6.appspot.com",
      messagingSenderId: "971034098233",
      appId: "1:971034098233:web:f47323c25bbed673b36be8"
    }),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    EffectsModule.forRoot([UserEffects]),
    StoreModule.forRoot({user: userReducer}),
    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [UserEffects],
  bootstrap: [AppComponent]
})
export class AppModule { }
