import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileform: FormGroup | any;
  validationMapping: any = {
    'name': { required:"Name is required"},
    'email': { required:"Email is required"}
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();

    this.request.Get('profile').subscribe((res:any)=>{
      this.profileform.patchValue(res.data);
    });
  }

  onSubmit(){
    this.spinner.show();
    if (this.profileform.valid) {
      this.spinner.hide();
      console.log(this.profileform.value)
      this.request.Post('profile',this.profileform.value).subscribe((res:any)=>{
        localStorage.setItem("token",res.data.token);
        this.route.navigate(['/admin/profile']);
        this.toastr.success(res.message)
      },(err)=>{
        this.toastr.error(err.error.errors.email[0]);
        console.log(err)
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.profileform, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.profileform, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
    this.profileform = new FormGroup({
      name: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required])
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

}
