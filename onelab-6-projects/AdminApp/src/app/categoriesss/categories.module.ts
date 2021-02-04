import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesComponent } from './categories/categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AngularFireDatabaseModule} from '@angular/fire/database';
 

@NgModule({
  declarations: [
    CategoriesComponent,
    NavComponent,
    ConfirmationDialog,],
  entryComponents: [ConfirmationDialog],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBmx8jugvZ_cb4LPGJw0uHkp9zgJwNSrT0",
    authDomain: "onetech-project.firebaseapp.com",
    databaseURL: "https://onetech-project-default-rtdb.firebaseio.com",
    projectId: "onetech-project",
    storageBucket: "onetech-project.appspot.com",
    messagingSenderId: "301793009323",
    appId: "1:301793009323:web:56dc8e89cac113918161ee"
    }),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  exports:[
    CategoriesComponent,
    NavComponent,
    ConfirmationDialog,
    CommonModule
  ],
})
export class CategoriesModule { }
