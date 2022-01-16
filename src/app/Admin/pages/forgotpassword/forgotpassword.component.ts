import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {


  forgotpasswordform: FormGroup | any;
  validationMapping: any = {
    'email': { required:"Email is required", pattern: "Email is invalid"},
    'password': { required:"Password is required"},
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(){
    this.spinner.show();
    if (this.forgotpasswordform.valid) {
      console.log(this.forgotpasswordform.value)
      this.request.Post('forgot-password',this.forgotpasswordform.value).subscribe((res:any)=>{
        console.log(res);
        this.toastr.success("Your new password sent on your email");
        this.spinner.hide();
        // this.route.navigate(['/admin/login']);
      },(err)=>{
        console.log(err)
        this.toastr.error("Your new password not sent on your email");
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.forgotpasswordform, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.forgotpasswordform, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
    this.forgotpasswordform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,100}))@((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|([a-zA-Z0-9]+[\\w-]+\\.)+[a-zA-Z]{2,9})$")])
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
