import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { MainGuard } from '@core/guard/main.guard';
import { UserEditComponent } from './pages/user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users-list'
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
      }
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
