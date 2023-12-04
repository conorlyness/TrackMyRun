import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRunDialogComponent } from './add-run-dialog.component';

describe('AddRunDialogComponent', () => {
  let component: AddRunDialogComponent;
  let fixture: ComponentFixture<AddRunDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRunDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRunDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
