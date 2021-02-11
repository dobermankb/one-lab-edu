import { TestBed } from '@angular/core/testing';

import { BannersRestService } from './banners.rest.service';

describe('Banners.RestService', () => {
  let service: BannersRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BannersRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
