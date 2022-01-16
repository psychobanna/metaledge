import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class UserLoginComponent implements OnInit {

  loginform: FormGroup | any;
  validationMapping: any = {
    'email': { required:"Email is required", pattern: "Email is invalid"},
    'password': { required:"Password is required"},
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(){
    this.spinner.show();
    if (this.loginform.valid) {
      this.spinner.hide();
      console.log(this.loginform.value)
      this.request.Post('customer-login',this.loginform.value).subscribe((res:any)=>{
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("customer-token",res.data);
        // this.route.navigate(['/admin/dashboard']);
      },(err)=>{console.log(err)});
    }else{
      if (this.GetErrorsFromFormGroup(this.loginform, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.loginform, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
    this.loginform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,100}))@((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|([a-zA-Z0-9]+[\\w-]+\\.)+[a-zA-Z]{2,9})$")]),
      password: new FormControl('',[Validators.required])
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
