import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundPageComponent } from '@core/static/notfound-page/notfound-page.component';
import { MainGuard } from '@core/guard/main.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'main',
    canActivate: [MainGuard],
    canLoad: [MainGuard],
    data: {
      accessRoles: ['admin', 'seller']
    },
    loadChildren: () => import('./feature/main/main.module').then(m => m.MainModule)
  },
  {
    path: 'auth',
    canActivate: [MainGuard],
    data: {
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
