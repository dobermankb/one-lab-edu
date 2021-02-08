import { Injectable } from '@angular/core';
import { User } from '../user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | undefined;

  constructor() { }

  login(username: string, password: string){
    if(username !== "admin" || password !== "12345") return false;

    this.user = {
      id: 1, 
      username: username,
      password: password
    }

    return true;
  }

    isAuthorized(){
      return !!this.user;
    }
  }

