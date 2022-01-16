import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddBannerComponent implements OnInit {

  bannerForm: FormGroup | any;
  validationMapping: any = {
    'type': { required:"Type is required"},
    'title': { required:"Title is required"},
    'image': { required:"Image is required"}
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};
  imageSrc: any = "";
  image: File | any;
  bannerId: number = 0;
  categoryAll: any = [];
  status: string = "";
  type: string = "";
  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router,private toastr:ToastrService,private activetedrouter:ActivatedRoute) { }

  ngOnInit(): void {
    this.showCategory();
    this.showAllCategory();
    this.initializeForm();
  }
  showAllCategory(){
    this.request.Get('view-banner').subscribe((res:any)=>{
      this.categoryAll = res.data;
    });
  }
  showCategory(){
    this.activetedrouter.params.subscribe((res:any)=>{
      this.bannerId = res.id
      if(this.bannerId){
        this.request.Get('view-banner/'+this.bannerId).subscribe((res:any)=>{
          console.log(res)
          this.bannerForm.patchValue({title:res.data.title,content:res.data.content,type:res.data.type,status:res.data.status});
          this.imageSrc = res.data.image;
          this.type = res.data.type;
          if(res.data.status == 1){
            this.status = "checked";
          }else{
            this.status = "";
          }
        })
      }else{
        this.type = 'noone';
        console.log(this.type)
      }
    });
  }

  onSubmit(){
    this.spinner.show();
    this.bannerForm.value.image = this.image?this.image:'';
    console.log(this.bannerForm)
    if (this.bannerForm.valid) {
      this.spinner.hide();
      const formData = new FormData();
      if(this.image != undefined){
        formData.append("image", this.image);
      }
      formData.append('title',this.bannerForm.value.title);
      formData.append('type',this.bannerForm.value.type);
      formData.append('status', this.bannerForm.value.status?"1":"0");
      if(this.bannerForm.value.content){
        formData.append('content',this.bannerForm.value.content);
      }
      if(this.bannerForm.value.link){
        formData.append('link',this.bannerForm.value.link);
      }
      let url = '';
      if(this.bannerId == 0 || this.bannerId == undefined){
        url = 'add-banner';
      }else{
        url = 'edit-banner/'+this.bannerId;
      }
      this.request.Post(url,formData).subscribe((res:any)=>{
        this.toastr.success(res.message);
        this.showCategory();
        this.route.navigate(['/admin/view-banner'])
      },(err)=>{
        console.log(err)
        this.toastr.error(err.error.errors);
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.bannerForm, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.bannerForm, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
    if(this.bannerId == 0 || this.bannerId === undefined){
      this.bannerForm = new FormGroup({
        image: new FormControl('',[Validators.required]),
        type: new FormControl('',[Validators.required]),
        title: new FormControl('',[Validators.required]),
        content: new FormControl(''),
        link: new FormControl(''),
        status: new FormControl(''),
        parent_id: new FormControl('')
      })
    }else{
      this.bannerForm = new FormGroup({
        image: new FormControl(''),
        type: new FormControl('',[Validators.required]),
        title: new FormControl('',[Validators.required]),
        content: new FormControl(''),
        link: new FormControl(''),
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

      console.log('Drag Leave');
  }

  ondrop(evt:any) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if(files.length > 0){
        this.onUpload(files[0]);
        console.log(files)
        console.log(`You dropped ${files.length}`);
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
    this.bannerForm.value.image = file;
    console.log(file)
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(reader.result != ""){
          this.imageSrc = reader.result;
        }
      };

      this.bannerForm = new FormGroup({
        image: new FormControl(''),
      })
  }

  removeImage(){
    this.imageSrc = "";
  }

}
