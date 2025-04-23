import { TestBed } from '@angular/core/testing';

import { EbuyShopFormService } from './ebuy-shop-form.service';

describe('EbuyShopFormService', () => {
  let service: EbuyShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbuyShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
