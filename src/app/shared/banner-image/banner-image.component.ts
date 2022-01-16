import { Component, Input, OnInit } from '@angular/core';
import { bannerModel } from 'src/app/Admin/pages/banner/banner.model';

@Component({
  selector: 'app-banner-image',
  templateUrl: './banner-image.component.html',
  styleUrls: ['./banner-image.component.scss']
})
export class BannerImageComponent implements OnInit {

  @Input() bannerData : bannerModel | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
