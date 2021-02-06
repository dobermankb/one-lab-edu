import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { UsersListComponent } from './pages/users-list/users-list.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';

@NgModule({
  declarations: [
    UsersListComponent,
    UserEditComponent,
    ProductsListComponent,
    ProductEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class MainModule {
  constructor() {
  }
}
