import { TestBed } from '@angular/core/testing';

import { EbuyCartService } from './ebuy-cart.service';

describe('EbuyCartService', () => {
  let service: EbuyCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbuyCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
