import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { MainGuard } from '@core/guard/main.guard';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { CategoriesComponent } from 'src/app/categoriesss/categories/categories.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products-list'
  },
  {
    path: '',
    children: [
      {
        path: 'users-list',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        component: UsersListComponent
      },
      {
        path: 'user-edit/:uid',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        component: UserEditComponent
      },
      {
        path: 'product-edit/:uid',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin', 'seller']
        },
        component: ProductEditComponent
      },
      {
        path: 'user-edit/:uid/products-list',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        component: ProductsListComponent
      },
      {
        path: 'products-list',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin', 'seller']
        },
        component: ProductsListComponent
      },
      {
        path: 'categories',
        component:CategoriesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
  constructor() {}
}
