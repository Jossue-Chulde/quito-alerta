import { TestBed } from '@angular/core/testing';
import { Seguimiento } from './seguimiento.service';

describe('Seguimiento', () => {
  let service: Seguimiento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Seguimiento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
