import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRunComponent } from './log-run.component';

describe('HomeComponent', () => {
  let component: LogRunComponent;
  let fixture: ComponentFixture<LogRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogRunComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
