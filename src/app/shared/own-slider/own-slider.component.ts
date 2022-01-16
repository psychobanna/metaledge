import { Component, Input, OnInit } from '@angular/core';
import { bannerModel } from 'src/app/Admin/pages/banner/banner.model';

@Component({
  selector: 'app-own-slider',
  templateUrl: './own-slider.component.html',
  styleUrls: ['./own-slider.component.scss']
})
export class OwnSliderComponent implements OnInit {
  @Input() data:any;
  constructor() { }

  ngOnInit(): void {
    // console.log(this.data);
  }

}
