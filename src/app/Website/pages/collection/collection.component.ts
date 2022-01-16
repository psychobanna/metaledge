import { Component, OnInit } from '@angular/core';
import { categoryModel } from 'src/app/Admin/pages/category/category.model';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  constructor(private request:RequestsService) { }
  categories: categoryModel[]|undefined = [];
  bannerData:any;
  ngOnInit(): void {
    this.ViewCollections();
    this.viewBanner();
  }

  ViewCollections(){
    this.request.Get("view-active-category").subscribe((res:any)=>{
      this.categories = res.data;

    },(err:any)=>{
      console.log(err.error);
    })
  }

  viewBanner(){
    this.request.Get('view-active-banner').subscribe((res:any)=>{
      var bannerDatass = res.data;
      bannerDatass.forEach((element:any) => {
        if(element.type == "banner"){
          this.bannerData = element;
        }
      });
    });
  }

}
