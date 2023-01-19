import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthYearSelectsComponent } from './month-year-selects.component';

describe('MonthYearSelectsComponent', () => {
  let component: MonthYearSelectsComponent;
  let fixture: ComponentFixture<MonthYearSelectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthYearSelectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthYearSelectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
