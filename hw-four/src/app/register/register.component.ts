import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    loginForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    zip: new FormControl('',Validators.required),
    phone: new FormControl('', Validators.required)
  })
  
  get name(){return this.loginForm.get('name')}
  get surname(){return this.loginForm.get('surname')}
  get age(){return this.loginForm.get('age')}
  get dateOfBirth(){return this.loginForm.get('dateOfBirth')}
  get email(){return this.loginForm.get('email')}
  get country(){return this.loginForm.get('country')}
  get city(){return this.loginForm.get('city')}
  get address(){return this.loginForm.get('address')}
  get zip(){return this.loginForm.get('zip')}
  get phone(){return this.loginForm.get('phone')}



  constructor() { }

  ngOnInit(): void {
  }

}
