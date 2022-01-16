import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  @Input() tabs: any;
  activeTab: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  selectedTab(n:any){
    console.log(n)
  }
}
