import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainGuard } from '@core/guard/main.guard';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    children: [
      {
        path: '',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin', 'seller']
        },
        component: ProductsListComponent,
      },
      {
        path: 'add',
        canActivate: [MainGuard],
        canLoad: [MainGuard],
        data: {
          accessRoles: ['admin', 'seller']
        },
        loadChildren: () => import('./pages/product-add/product-add.module').then(m => m.ProductAddModule)
      },
      {
        path: 'edit/:productUid',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin', 'seller']
        },
        component: ProductEditComponent
      },
      {
        path: ':userUid/edit/:productUid',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        component: ProductEditComponent
      },
      {
        path: ':userUid',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        component: ProductsListComponent
      },
      {
        path: ':userUid/add',
        canActivate: [MainGuard],
        canLoad: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        loadChildren: () => import('./pages/product-add/product-add.module').then(m => m.ProductAddModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }