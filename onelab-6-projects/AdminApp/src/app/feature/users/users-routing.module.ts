import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainGuard } from '@core/guard/main.guard';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: '',
    children: [
      {
        path: 'list',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        component: UsersListComponent
      },
      {
        path: 'edit',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin', 'seller']
        },
        component: UserEditComponent
      },
      {
        path: 'edit/:userUid',
        canActivate: [MainGuard],
        data: {
          accessRoles: ['admin']
        },
        component: UserEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
