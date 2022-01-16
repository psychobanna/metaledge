import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class UserRegisterComponent implements OnInit {


  registerform: FormGroup | any;
  validationMapping: any = {
    'name': { required:"Password is required"},
    'email': { required:"Email is required", pattern: "Email is invalid"},
    'password': { required:"Password is required"},
    'repassword': { required:"Password is required"},
    'contact': { required:"Password is required", pattern: "Contact is invalid"},
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router,private toastx:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(){
    this.spinner.show();
    if (this.registerform.valid) {
      this.spinner.hide();
      console.log(this.registerform.value)
      this.request.Post('customer-register',this.registerform.value).subscribe((res:any)=>{
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("customer-token",res.data);
        // this.route.navigate(['/admin/dashboard']);
      },(err)=>{
        console.log(err.error.errors)
        this.toastx.error((err.error.errors?.email)?(err.error.errors?.email):err.error.errors);
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.registerform, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.registerform, this.validationMapping);
        this.spinner.hide();
      }
    }
  }

  initializeForm() {
    this.registerform = new FormGroup({
      name: new FormControl('',[Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern("^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,100}))@((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|([a-zA-Z0-9]+[\\w-]+\\.)+[a-zA-Z]{2,9})$")]),
      password: new FormControl('',[Validators.required]),
      repassword: new FormControl('',[Validators.required]),
      contact: new FormControl('',[Validators.required,Validators.pattern("^[0-9]{10}$|^[0-9]{12}$")])
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
