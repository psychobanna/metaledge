import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-block-slider',
  templateUrl: './block-slider.component.html',
  styleUrls: ['./block-slider.component.scss']
})
export class BlockSliderComponent implements OnInit {

  currentIndex:number = 1;
  totalBanner:number = 4;
  nextSlider:number = 0;
  items: any = [-25,25,75,125,175,225];
  constructor() { }

  ngOnInit(): void {
    for(var item in this.items){
      var n = parseInt(item) * this.nextSlider;
      console.log(n);
    }
  }

  changeImageOnClick(e:any,n:number){
    this.currentIndex = this.currentIndex + n;

    if(n == -1 && this.currentIndex == 0){
      this.nextSlider = 0;
      return;
    }

    if(this.currentIndex < 1){
      this.currentIndex = this.totalBanner;
      this.nextSlider = 0;
    }

    if(this.currentIndex == this.totalBanner+1){
      this.currentIndex = 1;
      this.nextSlider = 0;
    }

    if(this.currentIndex == this.totalBanner){
      this.nextSlider = 0;
    }


    if(n == 1){
      this.nextSlider -= 50;
    }else{
      this.nextSlider += 50;
    }


  }
}
