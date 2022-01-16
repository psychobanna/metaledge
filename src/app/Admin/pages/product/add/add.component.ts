import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';
import { productModel } from '../product.model';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { NgxTagsInputModule } from 'ngx-tags-input';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})

export class AddProductComponent implements OnInit {
  tags:string[] = [];
  removeLastOnBackspace:any;
  tools: object = {};
  validationMapping: any = {
    'name': { required:"Name is required"},
    'price': { required:"Price is required"},
    'image': { required:"Image is required"}
  };
  productId: number = 0;
  imageSrc: any = "";
  image: File|any;
  status: string = "";
  categoryId: number = 0;
  subCategoryId: string = "";
  productForm: FormGroup | any;
  validationField: boolean = false;
  validationFieldMessage: any = {};
  categoryAll: any = [];
  categorycount: number = 0;
  subcategoryAll: any = [];
  subcategorycount: number = 0;

  constructor(private activetedrouter: ActivatedRoute,private request:RequestsService,private spinner: NgxSpinnerService,private toastr: ToastrService,private router: Router) { }

  ngOnInit(): void {
    this.showAllCategory();
    this.showProduct();
    this.initializeForm();
  }

  handleEnterKeyPress(event:any) {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== 'textarea') {
      return false;
    }else{
      return false;
    }
  }

  onTagsChanged(evt:any){
    // console.log(evt);
  }

  ngAfterViewInit() {
    this.tools =  {
        items: [
              'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
              'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
              'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
              'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
              'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
              'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
      };
  }

  showAllCategory(){
    this.request.Get('view-category/0/0').subscribe((res:any)=>{
      this.categoryAll = res.data;
      this.categorycount = Object.keys(this.categoryAll).length;
    })
  }

  showProduct(){
    this.activetedrouter.params.subscribe((res:any)=>{
      this.productId = res.id
      if(this.productId){
        this.request.Get('view-product/'+this.productId).subscribe((res:any)=>{
          this.productForm.patchValue({name:res.data.name,price:res.data.price,discount_price:res.data.discount_price,description:res.data.description,category:res.data.category,status:res.data.status});
          this.imageSrc = res.data.image;
          this.tags = JSON.parse(res.data.tag);
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
      formData.append('tag',JSON.stringify(this.tags));
      formData.append('price',this.productForm.value.price);
      if(this.productForm.value.discount_price){
        formData.append('discount_price',this.productForm.value.discount_price);
      }
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
      setTimeout(() => {
          this.validationField = false;
          this.validationFieldMessage = "";
      }, 3000);
    });

    return Errors;
  }

  onDragOver(evt:any) {
      evt.preventDefault();
      evt.stopPropagation();
  }
  onDragLeave(evt:any) {
      evt.preventDefault();
      evt.stopPropagation();

      // console.log('Drag Leave');
  }

  ondrop(evt:any) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if(files.length > 0){
        this.onUpload(files[0]);
        // console.log(files)
        // console.log(`You dropped ${files.length}`);
        return files;
    }
  }

  onFileChange(event:any) {
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.onUpload(file);
    }
  }

  onUpload(file:any){
    const reader = new FileReader();
    this.image = file
    // console.log(file)
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
    if(this.categoryId == 0){
      return;
    }
    this.request.Get('view-category/'+categoryId+'/'+categoryId).subscribe((res:any)=>{
      this.subcategoryAll = res.data;
      this.subcategorycount = Object.keys(this.subcategoryAll).length;
    });
  }

}
