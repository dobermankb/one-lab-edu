import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from '@core/static/notfound-page/notfound-page.component';
import { MainGuard } from '@core/guard/main.guard';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectLoggedInToMain = () => redirectLoggedInTo(['main']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'main',
    canActivate: [AngularFireAuthGuard, MainGuard],
    canLoad: [MainGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      accessRoles: ['admin', 'seller']
    },
    loadChildren: () => import('./feature/main/main.module').then(m => m.MainModule)
  },
  {
    path: 'auth',
    canActivate: [AngularFireAuthGuard, MainGuard],
    data: {
      authGuardPipe: redirectLoggedInToMain,
      accessRoles: null
    },
    loadChildren: () => import('./feature/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    children: [
      {
        path: '',
        component: NotFoundPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    onSameUrlNavigation: 'reload',
    // preloadingStrategy: PreloadAllModules,
    // enableTracing: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
