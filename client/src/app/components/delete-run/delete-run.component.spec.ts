import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRunComponent } from './delete-run.component';

describe('DeleteRunComponent', () => {
  let component: DeleteRunComponent;
  let fixture: ComponentFixture<DeleteRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRunComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
