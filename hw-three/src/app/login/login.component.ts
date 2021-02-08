import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from "../auth.service"



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  location: any;

  constructor(
    private authService:AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(form.value)
    if (this.authService.login(form.value.username, form.value.password)){
      alert('WELCOME ADMIN');
      this.goBack();
    }else {
      alert('PLEASE TRY AGAIN');
    }
  }

  goBack(): void {
    this.location.back();
  }

}
