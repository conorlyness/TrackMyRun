import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerFailedComponent } from './server-failed.component';

describe('ServerFailedComponent', () => {
  let component: ServerFailedComponent;
  let fixture: ComponentFixture<ServerFailedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerFailedComponent]
    });
    fixture = TestBed.createComponent(ServerFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
