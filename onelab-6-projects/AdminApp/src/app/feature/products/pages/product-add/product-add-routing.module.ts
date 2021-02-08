import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductAddComponent } from './component/product-add/product-add.component';

const routes: Routes = [
  {
    path: '',
    component: ProductAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAddRoutingModule { }
