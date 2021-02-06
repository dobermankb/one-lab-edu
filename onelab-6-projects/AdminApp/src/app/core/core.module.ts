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
import { RouterModule } from '@angular/router';
import { effects, reducers } from '@core/store';
import { MainGuard } from '@core/guard/main.guard';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '@env';
import { LayoutModule } from '@core/layout/layout.module';
import { CustomSerializer } from '@core/store/router/router.state';

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
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
    EffectsModule.forRoot(effects),
    LayoutModule
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
