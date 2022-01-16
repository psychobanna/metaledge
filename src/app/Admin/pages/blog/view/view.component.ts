import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/service/requests.service';
import { blog } from '../blog.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewBlogComponent implements OnInit {

  blogs : blog[] = [];
  constructor(private request:RequestsService,private route:Router,private toastr:ToastrService, private activatedRoute:ActivatedRoute) { }
  ngOnInit(): void {
    let n =  this.activatedRoute.params.subscribe(paramsId => {
      console.log(paramsId.id);
      this.viewCategories(paramsId.id)
    });
  }

  viewCategories(n:any){
    if(n == undefined){
      n = 0;
    }

    this.request.Get('view-blog/').subscribe((res:any)=>{
      this.blogs = res.data
      // console.log(this.categories)
    });
  }

  changeStatus(blogId:any){
    this.request.Post('edit-blog-status/'+blogId,'').subscribe((res:any)=>{
      console.log(res);
      this.viewCategories(0);
      this.toastr.success(res.message);
    },(err)=>{
      console.log(err);
    });
  }

  deleteBlog(blogId:number){
    this.request.Delete('delete-blog/'+blogId,'').subscribe((res:any)=>{
      console.log(res);
      this.viewCategories(0);
      this.toastr.success(res.message);
    },(err)=>{
      console.log(err);
    });
  }

}
