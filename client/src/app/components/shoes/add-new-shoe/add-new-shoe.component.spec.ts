import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewShoeComponent } from './add-new-shoe.component';

describe('AddNewShoeComponent', () => {
  let component: AddNewShoeComponent;
  let fixture: ComponentFixture<AddNewShoeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewShoeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewShoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
