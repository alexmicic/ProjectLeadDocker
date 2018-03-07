import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.service';
import { AuthGuardAdmin } from './auth-guard.service';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
  });

  it('should ...', inject([AuthGuard], (service: AuthGuard) => {
    expect(service).toBeTruthy();
  }));
});

describe('AuthGuardAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardAdmin]
    });
  });

  it('should ...', inject([AuthGuardAdmin], (service: AuthGuardAdmin) => {
    expect(service).toBeTruthy();
  }));
});
