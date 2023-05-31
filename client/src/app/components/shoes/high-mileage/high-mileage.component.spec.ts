import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighMileageComponent } from './high-mileage.component';

describe('HighMileageComponent', () => {
  let component: HighMileageComponent;
  let fixture: ComponentFixture<HighMileageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighMileageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighMileageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
