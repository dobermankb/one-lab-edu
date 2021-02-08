import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animated-component',
  templateUrl: './animated-component.component.html',
  styleUrls: ['./animated-component.component.css']
})
export class AnimatedComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }


  getRandomNumber(max: number){
    return Math.floor(Math.random() * Math.floor(max));

  }

  moveComponent(){

    const move = (this.getRandomNumber.toString()) + "px";
      

  }

}
