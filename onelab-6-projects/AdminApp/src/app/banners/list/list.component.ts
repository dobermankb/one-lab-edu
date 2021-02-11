import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BannersRestService } from 'src/app/services/banners/banners.rest.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  banners: any =[];
  bannersList: any = [];
  displayedColumns = ['id', 'name', 'button_text', 'title', 'link', 'description','image_url'];

  constructor(private restService:BannersRestService) {
  
   }

  ngOnInit(): void {
    this.restService.getBannersList().subscribe(res =>(
      this.bannersList = new MatTableDataSource(res),
      console.log(this.bannersList)
    ));
  }

  
  
}

