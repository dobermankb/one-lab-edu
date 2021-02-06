import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from '@core/static/notfound-page/notfound-page.component';
import { MainGuard } from '@core/guard/main.guard';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainLayoutComponent } from '@core/layout/main-layout/main-layout.component';

const redirectLoggedInToProducts = () => redirectLoggedInTo(['products']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },
  {
    path: 'products',
    component: MainLayoutComponent,
    canActivate: [AngularFireAuthGuard, MainGuard],
    canLoad: [MainGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      accessRoles: ['admin', 'seller']
    },
    loadChildren: () => import('./feature/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'users',
    component: MainLayoutComponent,
    canActivate: [AngularFireAuthGuard, MainGuard],
    canLoad: [MainGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      accessRoles: ['admin', 'seller']
    },
    loadChildren: () => import('./feature/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'auth',
    canActivate: [AngularFireAuthGuard, MainGuard],
    canLoad: [MainGuard],
    data: {
      authGuardPipe: redirectLoggedInToProducts,
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
    relativeLinkResolution: 'corrected',
    // paramsInheritanceStrategy: 'always',
    // preloadingStrategy: PreloadAllModules,
    // enableTracing: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
