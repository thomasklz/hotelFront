import { TestBed } from '@angular/core/testing';

import { RecetarioService } from './recetario.service';

describe('RecetarioService', () => {
  let service: RecetarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecetarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
