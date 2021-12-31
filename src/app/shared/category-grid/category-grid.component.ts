import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.scss']
})
export class CategoryGridComponent implements OnInit {

  @Input() category :any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.category)
  }

}
