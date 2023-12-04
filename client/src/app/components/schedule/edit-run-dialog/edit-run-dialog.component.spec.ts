import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRunDialogComponent } from './edit-run-dialog.component';

describe('EditRunDialogComponent', () => {
  let component: EditRunDialogComponent;
  let fixture: ComponentFixture<EditRunDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRunDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRunDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
