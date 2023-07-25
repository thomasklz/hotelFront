import { TestBed } from '@angular/core/testing';

import { PesosService } from './pesos.service';

describe('PesosService', () => {
  let service: PesosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PesosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
