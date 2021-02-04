import { Component, OnInit } from '@angular/core';
import {User} from '../app/models/post.model';
import {Observable } from 'rxjs';
import {UserEffects} from '../app/effects/post.effects';
import {Store} from '@ngrx/store';
import * as userActions from '../app/actions/post.actions';
interface AppSate{
  user:User
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  user$: Observable<User>;
  constructor(private userService:UserEffects, private store:Store<AppSate>){
  }
  ngOnInit(){
    this.user$=this.store.select('user');
    this.store.dispatch(new userActions.GetUser());
  }
  login()         {  this.store.dispatch(new userActions.GoogleLogin())      }
  logout()        {   this.store.dispatch(new userActions.Logout())    }
}
