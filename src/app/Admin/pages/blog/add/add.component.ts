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
export class AddBlogComponent implements OnInit {

  blogForm: FormGroup | any;
  validationMapping: any = {
    'title': { required:"Title is required"},
    'image': { required:"Image is required"}
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};
  imageSrc: any = "";
  image: File | any;
  blogId: number = 0;
  status: string = "";

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router,private toastr:ToastrService,private activetedrouter:ActivatedRoute) {
    this.showBlog();
  }

  ngOnInit(): void {
    this.showBlog();
    this.initializeForm();
  }

  showBlog(){
    this.activetedrouter.params.subscribe((res:any)=>{
      this.blogId = res.id
      if(this.blogId){
        this.request.Get('view-blog/'+this.blogId).subscribe((res:any)=>{
          this.blogForm.patchValue({title:res.data.title,content:res.data.content,status:res.data.status});
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
    if (this.blogForm.valid) {
      this.spinner.hide();
      const formData = new FormData();
      if(this.image != undefined){
        formData.append("image", this.image);
      }
      formData.append('title',this.blogForm.value.title);
      formData.append('status', this.blogForm.value.status?"1":"0");
      if(this.blogForm.value.content){
        formData.append('content',this.blogForm.value.content);
      }
      let url = '';
      if(this.blogId == 0 || this.blogId == undefined){
        url = 'add-blog';
      }else{
        url = 'edit-blog/'+this.blogId;
      }
      this.request.Post(url,formData).subscribe((res:any)=>{
        this.toastr.success(res.message);
        this.showBlog();
        this.route.navigate(['admin/view-blog'])
      },(err)=>{
        console.log(err)
        this.toastr.error(err.error.errors);
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.blogForm, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.blogForm, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
    if(this.blogId == 0 || this.blogId === undefined){
      this.blogForm = new FormGroup({
        image: new FormControl('',[Validators.required]),
        title: new FormControl('',[Validators.required]),
        content: new FormControl(''),
        status: new FormControl('')
      })
    }else{
      this.blogForm = new FormGroup({
        image: new FormControl(''),
        title: new FormControl('',[Validators.required]),
        content: new FormControl(''),
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
    console.log(file)
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(reader.result != ""){
          this.imageSrc = reader.result;
        }
      };
      this.blogForm.value.image = this.image?this.image:'';
  }

  removeImage(){
    this.imageSrc = "";
  }

}
