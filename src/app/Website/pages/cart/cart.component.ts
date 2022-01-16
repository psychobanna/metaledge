import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts:any | undefined  = [];
  cartData:any | undefined  = [];
  cartDataItemCount:number = 0;
  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.Viewcarts();
    this.spinner.hide();
  }

  async Viewcarts(){
    this.carts = sessionStorage.getItem("cart");
    if(this.carts){
      this.carts = JSON.parse(this.carts);
    }
  }

  productQTY(n:any,p:any,i:any){
    console.log(this.carts.items[i].productData.id == p);
      if(this.carts.items[i].productData.id == p){
        var lastQTY = this.carts.items[i].qty;
        this.carts.items[i].qty = n + lastQTY;
        sessionStorage.setItem("cart",JSON.stringify(this.carts));
        this.toastr.success("Cart updated");
      }else{
        this.toastr.error("Cart not Updated");
      }
  }

}
