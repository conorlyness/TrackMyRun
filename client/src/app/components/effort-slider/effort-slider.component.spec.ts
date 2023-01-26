import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortSliderComponent } from './effort-slider.component';

describe('EffortSliderComponent', () => {
  let component: EffortSliderComponent;
  let fixture: ComponentFixture<EffortSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffortSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffortSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
