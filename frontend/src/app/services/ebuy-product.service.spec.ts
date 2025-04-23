import { TestBed } from '@angular/core/testing';

import { EbuyProductService } from './ebuy-product.service';

describe('EbuyProductService', () => {
  let service: EbuyProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbuyProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
