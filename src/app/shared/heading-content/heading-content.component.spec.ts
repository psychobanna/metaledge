import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingContentComponent } from './heading-content.component';

describe('HeadingContentComponent', () => {
  let component: HeadingContentComponent;
  let fixture: ComponentFixture<HeadingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadingContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
