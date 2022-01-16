import { Component, OnInit } from '@angular/core';
import { bannerModel } from 'src/app/Admin/pages/banner/banner.model';
import { blog } from 'src/app/Admin/pages/blog/blog.model';
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
  blogData:blog[] = [];
  contentData:any;
  bannerData:any;
  ngOnInit(): void {
    this.contentData={"heading":"themetaledge", "content":"the best furniture"}
    this.viewBanner();
    this.viewCategory();
    this.viewProduct();
    this.viewBlog();
  }

  viewBanner(){
    this.request.Get('view-active-banner').subscribe((res:any)=>{

      var bannerDatass = res.data;

      bannerDatass.forEach((element:any) => {
        if(element.type == "slider"){
          this.sliderData.push(element);
        }
      });

      bannerDatass.forEach((element:any) => {
        if(element.type == "banner"){
          this.bannerData = element;
        }
      });
    });
  }

  viewProduct(){
    this.request.Get('view-active-product').subscribe((res:any)=>{
      var i=0;
      var l = Object.keys(res.data).length;
      while(i<8){
        if(i<=l-1){
          this.productData[i] = res.data[i];
        }
        i++;
      }
    });
  }
  viewCategory(){
    this.request.Get('view-active-category/').subscribe((res:any)=>{
      this.categoryData = res.data;
    });
  }
  viewBlog(){
    this.request.Get('view-active-blog').subscribe((res:any)=>{
      this.blogData = res.data;
    });
  }
}
