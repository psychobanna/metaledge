import { Component, OnInit } from '@angular/core';
import { bannerModel } from 'src/app/Admin/pages/banner/banner.model';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private request:RequestsService) { }
  sliderData:any = [];
  productData:any = [];
  categoryData:any = [];
  contentData:any;
  ngOnInit(): void {
    this.contentData={"heading":"themetaledge", "content":"the best furniture"}
    this.viewBanner();
    this.viewCategory();
    this.viewProduct();
  }

  viewBanner(){
    this.request.Get('view-active-banner').subscribe((res:any)=>{
      this.sliderData = res.data;
    });
  }

  viewProduct(){
    this.request.Get('view-active-product').subscribe((res:any)=>{
      this.productData = res.data;
    });
  }
  viewCategory(){
    this.request.Get('view-active-category/0').subscribe((res:any)=>{
      this.categoryData = res.data;
    });
  }
}
