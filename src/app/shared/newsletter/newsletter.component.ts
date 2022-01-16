import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  Newsletterform: FormGroup| any;
  validationMapping: any = {
    'email': { required:"Email is required", pattern: "Email is invalid"}
  };

  validationField: boolean = false;
  validationFieldMessage: any = {};

  constructor(private spinner:NgxSpinnerService,private request:RequestsService,private route:Router,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.Newsletterform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,100}))@((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|([a-zA-Z0-9]+[\\w-]+\\.)+[a-zA-Z]{2,9})$")]),
    })
  }

  onSubmit(){
    this.spinner.show();
    if (this.Newsletterform.valid) {
      this.request.Post('add-customer-subscribe',this.Newsletterform.value).subscribe((res:any)=>{
        this.toastr.success(res.message);
        this.Newsletterform.patchValue({"email":""});
        this.spinner.hide();
      },(err)=>{
        console.log(err)
        this.toastr.error(err.error.errors.email);
        this.spinner.hide();
      });
    }else{
      if (this.GetErrorsFromFormGroup(this.Newsletterform, this.validationMapping)) {
        this.validationField = true;
        this.validationFieldMessage = this.GetErrorsFromFormGroup(this.Newsletterform, this.validationMapping);
        this.spinner.hide();
      }
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

}
