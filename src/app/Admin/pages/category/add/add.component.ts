import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestsService } from 'src/app/service/requests.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddCategoryComponent implements OnInit {

  categoryForm: FormGroup | any;
  validationMapping: any = {
    'name': { required:"Name is required"},
    'image': { required:"Image is required"}
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};
  imageSrc: any = "";
  image: File | any;
  categoryId: number = 0;
  categoryAll: any = [];
  status: string = "";

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router,private toastr:ToastrService,private activetedrouter:ActivatedRoute) { }

  ngOnInit(): void {
    this.showCategory();
    this.showAllCategory();
    this.initializeForm();
  }
  showAllCategory(){
    this.request.Get('view-category').subscribe((res:any)=>{
      this.categoryAll = res.data;
    });
  }
  showCategory(){
    this.activetedrouter.params.subscribe((res:any)=>{
      this.categoryId = res.id
      if(this.categoryId){
        this.request.Get('view-category/'+this.categoryId).subscribe((res:any)=>{
          this.categoryForm.patchValue({name:res.data.name,description:res.data.description,status:res.data.status});
          this.imageSrc = res.data.image;
          if(res.data.status == 1){
            this.status = "checked";
          }else{
            this.status = "";
          }
        })
      }
    });
  }

  onSubmit(){
    this.spinner.show();
    if (this.categoryForm.valid) {
      this.spinner.hide();
      const formData = new FormData();
      if(this.image != undefined){
        formData.append("image", this.image);
      }
      formData.append('name',this.categoryForm.value.name);
      formData.append('parent_id',this.categoryForm.value.parent_id?this.categoryForm.value.parent_id:0);
      formData.append('status', this.categoryForm.value.status?"1":"0");
      if(this.categoryForm.value.description){
        formData.append('description',this.categoryForm.value.description);
      }
      let url = '';
      if(this.categoryId == 0 || this.categoryId == undefined){
        url = 'add-category';
      }else{
        url = 'edit-category/'+this.categoryId;
      }
      this.request.Post(url,formData).subscribe((res:any)=>{
        this.toastr.success(res.message);
        this.showCategory();
      },(err)=>{
        console.log(err)
        this.toastr.error(err.error.errors);
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.categoryForm, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.categoryForm, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
    if(this.categoryId == 0 || this.categoryId === undefined){
      this.categoryForm = new FormGroup({
        image: new FormControl('',[Validators.required]),
        name: new FormControl('',[Validators.required]),
        description: new FormControl(''),
        status: new FormControl(''),
        parent_id: new FormControl('')
      })
    }else{
      this.categoryForm = new FormGroup({
        image: new FormControl(''),
        name: new FormControl('',[Validators.required]),
        description: new FormControl(''),
        status: new FormControl(''),
        parent_id: new FormControl('')
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

  // Show image
  onFileChange(event:any) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.image = file
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
    }
  }

  removeImage(){
    this.imageSrc = "";
  }

}
