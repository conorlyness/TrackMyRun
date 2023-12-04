import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRunDialogComponent } from './preview-run-dialog.component';

describe('PreviewRunDialogComponent', () => {
  let component: PreviewRunDialogComponent;
  let fixture: ComponentFixture<PreviewRunDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewRunDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewRunDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
