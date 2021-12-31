import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';
import { productModel } from '../product.model';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class AddProductComponent implements OnInit {
  public tools: object = {
    items: [
           'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
           'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
           'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
           'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
           'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
           'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };

  validationMapping: any = {
    'name': { required:"Name is required"},
    'price': { required:"Price is required"},
    'image': { required:"Image is required"}
  };

  productId: number = 0;
  imageSrc: any = "";
  image: File|any;
  status: string = "";
  categoryId: string = "";
  subCategoryId: string = "";
  productForm: FormGroup | any;
  validationField: boolean = false;
  validationFieldMessage: any = {};
  categoryAll: any = [];
  subcategoryAll: any = [];
  constructor(private activetedrouter: ActivatedRoute,private request:RequestsService,private spinner: NgxSpinnerService,private toastr: ToastrService,private router: Router) { }

  ngOnInit(): void {
    this.showAllCategory();
    this.showProduct();
    this.initializeForm();
  }

  showAllCategory(){
    this.request.Get('view-category/0/0').subscribe((res:any)=>{
      this.categoryAll = res.data;
    })
  }

  showProduct(){
    this.activetedrouter.params.subscribe((res:any)=>{
      this.productId = res.id
      if(this.productId){
        this.request.Get('view-product/'+this.productId).subscribe((res:any)=>{
          this.productForm.patchValue({name:res.data.name,price:res.data.price,discount_price:res.data.discount_price,description:res.data.description,category:res.data.category,status:res.data.status});
          this.imageSrc = res.data.image;
          if(res.data.category){
            this.categoryId = res.data.category.id;
            if(res.data.status == 1){
              this.status = "checked";
            }else{
              this.status = "";
            }
          }
        })
      }
    });
  }


  onSubmit(){
    this.spinner.show();
    if (this.productForm.valid) {
      this.spinner.hide();
      const formData = new FormData();
      if(this.image != undefined){
        formData.append("image", this.image);
      }
      formData.append('name',this.productForm.value.name);
      formData.append('price',this.productForm.value.price);
      if(this.productForm.value.discount_price){
        formData.append('discount_price',this.productForm.value.discount_price);
      }
      console.log(this.productForm.value.category);
      formData.append('category',this.productForm.value.category!=0?this.productForm.value.category:0);
      if(this.productForm.value.subcategory){
        formData.append('subcategory',this.productForm.value.subcategory);
      }
      formData.append('status', this.productForm.value.status?"1":"0");
      if(this.productForm.value.description){
        formData.append('description',this.productForm.value.description);
      }
      let url = '';
      if(this.productId == 0 || this.productId == undefined){
        url = 'add-product';
      }else{
        url = 'edit-product/'+this.productId;
      }
      this.request.Post(url,formData).subscribe((res:any)=>{
        this.toastr.success(res.message);
        this.router.navigate(['/admin/view-product/'])
        this.showProduct();
      },(err)=>{
        console.log(err)
        this.toastr.error(err.error.errors);
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.productForm, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.productForm, this.validationMapping);
        this.spinner.hide();
      }
    }
  }


  initializeForm() {
    if(this.productId == 0 || this.productId === undefined){
      this.productForm = new FormGroup({
        image: new FormControl('',[Validators.required]),
        name: new FormControl('',[Validators.required]),
        price: new FormControl('',[Validators.required]),
        discount_price: new FormControl(''),
        category: new FormControl(''),
        subcategory: new FormControl(''),
        description: new FormControl(''),
        status: new FormControl('')
      })
    }else{
      this.productForm = new FormGroup({
        image: new FormControl(''),
        name: new FormControl('',[Validators.required]),
        price: new FormControl('',[Validators.required]),
        discount_price: new FormControl(''),
        category: new FormControl(''),
        subcategory: new FormControl(''),
        description: new FormControl(''),
        status: new FormControl('')
      })
    }
  }

  GetErrorsFromFormGroup(formgroup: FormGroup, errorMapping: any) {
    var Errors: any = [];
    Object.keys(formgroup.controls).forEach(key => {
      const controlErrors: any = formgroup.get(key)?.errors;
      if (controlErrors != null) Object.keys(controlErrors).forEach(keyError => {
        Errors[key] = errorMapping[key][keyError];
      });
    });

    return Errors;
  }

  onFileDropped(evt: any) {
      let files = evt.dataTransfer.files;
      this.onFileChange(files);
      alert();
  }

  // Show image
  onFileChange(event:any) {

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.onUpload(file);
    }
  }

  onUpload(file:any){
    const reader = new FileReader();
    this.image = file
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(reader.result != ""){
          this.imageSrc = reader.result;
        }
      };
  }

  removeImage(){
    this.imageSrc = "";
  }

  showSubcategory(event:any){
    let categoryId = event.target.value;

    this.request.Get('view-category/'+categoryId+'/'+categoryId).subscribe((res:any)=>{
      this.subcategoryAll = res.data;
    })

  }

}
