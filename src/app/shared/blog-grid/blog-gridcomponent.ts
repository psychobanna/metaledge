import { Component, Input, OnInit } from '@angular/core';
import { blog } from 'src/app/Admin/pages/blog/blog.model';

@Component({
  selector: 'app-blog-grid',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.scss']
})
export class BlogGridComponent implements OnInit {

  @Input() blogData: blog | any;
  constructor() { }

  ngOnInit(): void {
  }

}
