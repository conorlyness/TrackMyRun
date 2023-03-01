import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBestsComponent } from './personal-bests.component';

describe('PersonalBestsComponent', () => {
  let component: PersonalBestsComponent;
  let fixture: ComponentFixture<PersonalBestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalBestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalBestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
