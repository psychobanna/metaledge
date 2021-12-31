import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiBlogsComponent } from './multi-blogs.component';

describe('MultiBlogsComponent', () => {
  let component: MultiBlogsComponent;
  let fixture: ComponentFixture<MultiBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiBlogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
