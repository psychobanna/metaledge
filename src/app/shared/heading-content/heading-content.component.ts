import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-heading-content',
  templateUrl: './heading-content.component.html',
  styleUrls: ['./heading-content.component.scss']
})
export class HeadingContentComponent implements OnInit {

  constructor() { }
  @Input() contentData: any;

  ngOnInit(): void {
  }

}
