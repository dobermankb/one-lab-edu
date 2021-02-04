import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categoriesss/categories/categories.component';
import { NavComponent } from './categoriesss/nav/nav.component';

const routes: Routes = [
    {path:'categories', component: CategoriesComponent},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
