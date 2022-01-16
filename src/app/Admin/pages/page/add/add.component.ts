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
export class AddPageComponent implements OnInit {

  pageForm: FormGroup | any;
  validationMapping: any = {
    'title': { required:"Title is required"},
    'description': { required:"Description is required"}
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};
  imageSrc: any = "";
  image: File | any;
  pageId: number = 0;
  status: string = "";

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router,private toastr:ToastrService,private activetedrouter:ActivatedRoute) { }

  ngOnInit(): void {
    this.showPage();
    this.initializeForm();
  }

  showPage(){
    this.activetedrouter.params.subscribe((res:any)=>{
      this.pageId = res.id
      if(this.pageId){
        this.request.Get('view-page/'+this.pageId).subscribe((res:any)=>{
          this.pageForm.patchValue({title:res.data.title,description:res.data.description,status:res.data.status});
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
    if (this.pageForm.valid) {
      this.spinner.hide();
      const formData = new FormData();
      if(this.image != undefined){
        formData.append("image", this.image);
      }
      formData.append('title',this.pageForm.value.title);
      formData.append('status', this.pageForm.value.status?"1":"0");
      if(this.pageForm.value.description){
        formData.append('description',this.pageForm.value.description);
      }
      let url = '';
      if(this.pageId == 0 || this.pageId == undefined){
        url = 'add-page';
      }else{
        url = 'edit-page/'+this.pageId;
      }
      this.request.Post(url,formData).subscribe((res:any)=>{
        this.toastr.success(res.message);
        this.showPage();
        this.route.navigate(['admin/view-page']);
      },(err)=>{
        console.log(err)
        this.toastr.error(err.error.errors);
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.pageForm, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.pageForm, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
      this.pageForm = new FormGroup({
        image: new FormControl(''),
        meun: new FormControl(''),
        title: new FormControl('',[Validators.required]),
        description: new FormControl('',[Validators.required]),
        status: new FormControl('')
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
  }

  // Show image
  // onFileChange(event:any) {
  //   const reader = new FileReader();

  //   if(event.target.files && event.target.files.length) {
  //     const [file] = event.target.files;
  //     this.image = file
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.imageSrc = reader.result;
  //     };
  //   }
  // }

  removeImage(){
    this.imageSrc = "";
  }

}
