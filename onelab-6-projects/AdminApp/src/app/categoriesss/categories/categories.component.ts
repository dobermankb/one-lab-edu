import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {from, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {ConfirmationDialog} from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

interface Category{
  name:string,
  parent:string
}
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  myControl = new FormControl();
  selected:any="";
  categoriesCol:AngularFirestoreCollection<Category>;
  orderedcategory:any;
  orderedcategory1:any;
  categories:any;
  post:AngularFirestoreCollection<Category>;
  name1:string="";
  name2:string="";
  parent:string="";
  checked = false;
  constructor(public db:AngularFirestore, private dialog: MatDialog, private _snackBar: MatSnackBar) { 
    this.categoriesCol=this.db.collection('categories');
    this.post=this.db.collection('categories',ref => ref.where('parent', '==', "none"));
  }

  ngOnInit(): void {     
  
    this.categoriesCol=this.db.collection('categories');
    this.categories=this.categoriesCol.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data=a.payload.doc.data() as Category;
        const id=a.payload.doc.id;
        return {id, data};
      })
    }

    ));
    
   }
   showSubCategories(selected:any,idx:string){
     this.selected=selected;
    this.parent=idx;
    this.post=this.db.collection('categories',ref => ref.where('parent', '==', idx));
    this.orderedcategory=this.post.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data=a.payload.doc.data() as Category;
          const id=a.payload.doc.id;
          const children=this.db.collection('categories',ref => ref.where('parent', '==', id)).snapshotChanges().pipe(
            map(actions => {
              return actions.map(a => {
                const data=a.payload.doc.data() as Category;
                const id=a.payload.doc.id;
                return {id, data};
              })
            }
        
            ));
          //const id=a.payload.doc.id;
          return {children,id, data};
        })
      }
  
      ));   
   }
   update(event:any,id:any){
     if (event){
       console.log(event);
     this.db.collection("categories").doc(id).update({ cheched:true });
     }
     else{
      this.db.collection("categories").doc(id).update({ cheched:false });
     }
   }
   addCategory1(name:string){
    this.db.collection("categories").add({name:name,parent:"none", level:1});
    this.openSnackBar("Вы добавили категорию первого уровня", name);
   }
   addCategory2(name:string){
    this.db.collection("categories").add({name:name,parent:this.parent, level:2});
    this.openSnackBar("Вы добавили  категорию второго уровня",name);

   }
   addCategory3(parent:any, name:string){
    this.db.collection("categories").add({name:name,parent:parent, level:3});
    this.openSnackBar("Вы добавили  категорию третьего уровня",name);
    name="";
   }
   delete(id:any){
     this.db.doc('categories/'+id).delete();
   }
   keyDownFunction(event:any) {
    if (event.keyCode === 13) {
    }
  }
   openDialog(id:any,name:string) {
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      data:{
        message: 'Вы действительно хотите удалить '+ name+ '?',
        buttonText: {
          ok: 'Да',
          cancel: 'Нет'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.delete(id);
        this.openSnackBar("Вы удалили", name);
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
