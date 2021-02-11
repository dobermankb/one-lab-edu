import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BannersRestService
  {




  constructor(private firestore: AngularFirestore,) {

  }

  getBannersList() { 
    return  this.firestore.collection("banners").valueChanges();
  }
 
}
  
