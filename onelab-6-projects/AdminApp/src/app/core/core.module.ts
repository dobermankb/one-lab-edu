import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from '@core/guard/module-import.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from '@core/interceptor/http.error.interceptor';
import { NotFoundPageComponent } from './static/notfound-page/notfound-page.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SessionUserEffect } from '@core/store/session-user/session-user.effect';
import { RouterModule } from '@angular/router';
import { reducers } from '@core/store';
import { MainGuard } from '@core/guard/main.guard';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '@env';

@NgModule({
  declarations: [
    NotFoundPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),
    AngularFireAuthModule,

    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      SessionUserEffect
    ])
  ],
  providers: [
    MainGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
