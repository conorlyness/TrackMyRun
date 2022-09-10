import { TestBed } from '@angular/core/testing';

import { RunningDataService } from './running-data.service';

describe('RunningDataService', () => {
  let service: RunningDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RunningDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
