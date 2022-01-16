import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { productModel } from 'src/app/Admin/pages/product/product.model';
import { RequestsService } from 'src/app/service/requests.service';
import { getCurrencySymbol } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { tabs } from './tabs.model';
import {Md5} from 'ts-md5/dist/md5'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productId: number = 0;
  productData: productModel | undefined;
  customerId: number = 0;
  websiteInfo:any;
  numberReview:number = 5;
  curr:any;
  productForm: FormGroup|any;
  ReviewForm: FormGroup|any;
  tabDescription : tabs|any;
  totalReview: number = 0;
  activeTab: number = 1;
  productReviews: any;
  validationMapping: any = {
    'qty': { required:"qty is required",maxlength:"Maximum 5 product"},
    'productId': { required:"Product is required"},
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};

  validationMappingReview: any = {
    'rating': { required:"qty is required"},
    'name': { required:"Product is required"},
    'email': { required:"Product is required"},
    'comment': { required:"Product is required"},
  };

  validationFieldReview: boolean = false;
  validationFieldMessageReview: any = {};

  cartDataItemCount:any;
  cart:any;

  constructor(private activeRoute:ActivatedRoute,private request:RequestsService, private spinner:NgxSpinnerService,private toastr:ToastrService) { }

  ngOnInit(): void {

    this.request.Get('website').subscribe((res:any)=>{
      this.websiteInfo = res[0][0];
      this.curr = getCurrencySymbol(this.websiteInfo.currency, "wide");
    });
    // this.customerId = localStorage.getItem("user-name");
    // console.log()
    // this.customerId =

    this.productId = this.activeRoute.snapshot.params.id;

    this.request.Get("view-active-product/"+this.productId).subscribe((res:any)=>{
      this.productData = res.data;
      this.tabDescription = {'title':"Description",'content':this.productData?.description};
    },(err:any)=>{
      console.log(err)
    })

    // this.request.Get("view")
    this.initializeForm()
    this.initializeReveiwForm()

    this.ViewReviews(this.productId);
  }

  discountOff(m:any,n:any){
    var discount = m-n;
    return (discount/m)*100;
  }

  // Product Quantity
  productQTY(n:any){
    if (this.productForm.valid) {
      if(this.productForm.value.qty == ""){
        this.productForm.value.qty = 0;
      }

      let qty = parseInt(this.productForm.value.qty) + n;
      if(this.productForm.value.qty >= 0){
        this.productForm.patchValue({"qty":qty!=-1?qty:0})
      }
    }else{
      if (this.GetErrorsFromFormGroup(this.productForm, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.productForm, this.validationMapping);
      }
    }
  }

  initializeForm() {
    this.productForm = new FormGroup({
      qty: new FormControl('0', [Validators.required,Validators.maxLength(5)]),
      productId: new FormControl(this.productId,[Validators.required])
    })
  }

  initializeReveiwForm() {
    this.ReviewForm = new FormGroup({
      product_id: new FormControl(this.productId,[Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required]),
      rating: new FormControl(0, [Validators.required]),
    })
  }

  GetErrorsFromFormGroup(formgroup: FormGroup, errorMapping: any) {
    var Errors: any = [];
    Object.keys(formgroup.controls).forEach(key => {
      const controlErrors: any = formgroup.get(key)?.errors;
      if (controlErrors != null) Object.keys(controlErrors).forEach(keyError => {
        Errors[key] = errorMapping[key][keyError];
      });
      setTimeout(() => {
          this.validationField = false;
          this.validationFieldMessage = "";
          this.validationFieldReview = false;
          this.validationFieldMessageReview = "";
      }, 3000);
    });

    return Errors;
  }

  SelecttedTab(n:number){
    this.activeTab = n;
  }

  ViewReviews(n:any){
    this.request.Get('view-review/'+n).subscribe((res:any)=>{

      this.productReviews = res.data;
      this.totalReview = Object.keys(this.productReviews).length;
    },(err:any)=>{
      console.log(err);
    })

  }

  ProductFormSubmit(){
    this.spinner.show();
    if (this.productForm.valid) {
      if(this.productForm.value.qty == 0){
        this.toastr.error("Product quantity is zero.");
        this.spinner.hide();
        return;
      }
      if(this.customerId){
          var formData = {
            "product":this.productId,
            "customer":this.customerId
          }
          this.request.Post("add-cart",this.productForm.value).subscribe((res:any)=>{
            this.toastr.success(res.message);
            this.ViewReviews(this.productId);
            this.spinner.hide();
          },(err)=>{
            console.log(err)
            this.toastr.error(err.error.errors);
            this.spinner.hide();
          });
      }else{
        this.UpdateCartDetails(this.productForm.value);
        this.productForm.patchValue({"qty":0});
        this.spinner.hide();
      }
    }else{
      if (this.GetErrorsFromFormGroup(this.productForm, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.productForm, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  UpdateCartDetails(cart:any){
      var cartItems:any = sessionStorage.getItem("cart");
      cartItems = JSON.parse(cartItems);
      if(cartItems){
        cartItems = (cartItems.length == 0)?"":cartItems;
      }
      if(cartItems){
        cartItems.forEach((element:any,i:any) => {
          if(element.product.id == this.productId){
            var n = parseInt(element.qty) + this.productForm.value.qty;
            cartItems[i].qty = n;
          }else{
              this.cart = {"qty":cart.qty,"product":cart.productId};
              this.request.Get("view-active-product/"+this.productId).subscribe((res:any)=>{
                this.cart.product = res.data;
                var n = i + 1;
                cartItems[n] = this.cart;
              },(err:any)=>{
                console.log(err);
              });
          }
        });
        sessionStorage.setItem("cart",JSON.stringify(cartItems));
        this.toastr.success("Product added to cart.");
      }else{
        this.cart = [{"qty":cart.qty,"product":cart.productId}];
        this.cart.forEach((element:any,i:any) => {
          this.request.Get("view-active-product/"+this.productId).subscribe((res:any)=>{
            this.cart[i].product = res.data;
            sessionStorage.setItem("cart",JSON.stringify(this.cart));
          },(err:any)=>{
            console.log(err);
          });
        });
      }
  }

  onSubmitReview(){
    this.spinner.show();
    console.log(this.ReviewForm);
    if (this.ReviewForm.valid) {
      this.request.Post("add-review",this.ReviewForm.value).subscribe((res:any)=>{
        this.toastr.success(res.message);
        this.ViewReviews(this.productId);
        this.spinner.hide();
      },(err)=>{
        console.log(err)
        this.toastr.error(err.error.errors);
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.ReviewForm, this.validationMappingReview)) {
        this.validationFieldReview = true;
        this.validationFieldMessageReview = this.GetErrorsFromFormGroup(this.ReviewForm, this.validationMappingReview);
        this.spinner.hide();
      }
    }
  }

  loadMore(n:number){
    this.numberReview = this.numberReview + n;
  }
}
