import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { productModel } from 'src/app/Admin/pages/product/product.model';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private activeRoute:ActivatedRoute,private request:RequestsService) { }
  categoryId: number = 0;
  productData: productModel[] = [];
  ngOnInit(): void {
    this.categoryId = this.activeRoute.snapshot.params.id;

    this.request.Get("view-active-productbycategory/"+this.categoryId).subscribe((res:any)=>{
      this.productData = res.data;
    },(err:any)=>{ console.log(err)})

  }



}
