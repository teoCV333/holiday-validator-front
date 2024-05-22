import { TestBed } from '@angular/core/testing';

import { HolidayValidatorService } from './holiday-validator.service';

describe('HolidayValidatorService', () => {
  let service: HolidayValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolidayValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
