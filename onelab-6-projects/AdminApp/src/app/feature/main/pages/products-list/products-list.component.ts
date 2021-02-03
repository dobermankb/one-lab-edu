import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {
    console.log(activatedRoute.snapshot.paramMap.get('uid'));
  }

  ngOnInit(): void {
  }

}
