import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRunDialogComponent } from './delete-run-dialog.component';

describe('DeleteRunDialogComponent', () => {
  let component: DeleteRunDialogComponent;
  let fixture: ComponentFixture<DeleteRunDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRunDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRunDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
