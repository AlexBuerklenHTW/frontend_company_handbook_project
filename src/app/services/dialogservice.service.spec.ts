import { TestBed } from '@angular/core/testing';

import { DialogserviceService } from './dialogservice.service';

describe('DialogserviceService', () => {
  let service: DialogserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
