import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { BannersRestService } from '../services/banners/banners.rest.service';
import {  MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';


const routes= [

  { path: '', component: ListComponent},
  
]
@NgModule({
  declarations: [ListComponent,],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule.forChild(routes),
  ],
  providers: [BannersRestService],
})
export class BannersModule { }
