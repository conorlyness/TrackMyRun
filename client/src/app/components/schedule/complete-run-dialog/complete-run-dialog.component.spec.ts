import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRunDialogComponent } from './complete-run-dialog.component';

describe('CompleteRunDialogComponent', () => {
  let component: CompleteRunDialogComponent;
  let fixture: ComponentFixture<CompleteRunDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteRunDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteRunDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
