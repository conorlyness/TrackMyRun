import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunScheduleComponent } from './run-schedule.component';

describe('RunScheduleComponent', () => {
  let component: RunScheduleComponent;
  let fixture: ComponentFixture<RunScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
