import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSliderComponent } from './block-slider.component';

describe('BlockSliderComponent', () => {
  let component: BlockSliderComponent;
  let fixture: ComponentFixture<BlockSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
