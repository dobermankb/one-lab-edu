import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

import {AngularFireDatabase, AngularFireDatabaseModule} from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn=false;
  constructor(public firebaseAuth: AngularFireAuth, public db:AngularFireDatabase ) { 
  }
  async signin(email:string, password: string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
    .then(res=> {
      this.isLoggedIn=true;
      localStorage.setItem('user',JSON.stringify(email));

    })
  }
}
