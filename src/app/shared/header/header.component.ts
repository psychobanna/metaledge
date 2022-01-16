import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  totalCartItems: any = 0;
  totalCartCount: any = 0;
  constructor() { }

  ngOnInit(): void {
    setInterval(()=>{
      this.showCart();
    },2000);
  }

  showCart(){
    this.totalCartItems = sessionStorage.getItem("cart");
    this.totalCartItems = JSON.parse(this.totalCartItems);

    if(this.totalCartItems){
      var items = this.totalCartItems;
      items = items.filter(function (el:any) {
        return el != null;
      });
      this.totalCartCount = items.length;
    }else{
      this.totalCartCount = 0;
    }

  }

  removeCartElement(i:any){
    this.totalCartItems.splice(i,1);
    sessionStorage.setItem("cart",JSON.stringify(this.totalCartItems));
    this.showCart();
  }
}
