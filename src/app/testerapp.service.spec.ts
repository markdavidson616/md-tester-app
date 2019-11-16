import { TestBed } from '@angular/core/testing';

import { TesterappService } from './testerapp.service';

describe('TesterappService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TesterappService = TestBed.get(TesterappService);
    expect(service).toBeTruthy();
  });
});
