import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('wizard', JSON.stringify({
      id: '1',
      username: 'testWizard',
      role: 'admin'
    }));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting,
        AuthService,
        { provide: Router, useClass: RouterStub }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('Should login and save the token', () => {
    const mockResponse = { token: 'fake-jwt-token' };
    const wizardData = { username: 'testWizard', password: 'testPass' };

    service.login(wizardData).subscribe((wizardResponse) => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${ service['apiUrl'] }/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('Should remove the token on logout', () => {
    localStorage.setItem('token', 'fake-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('wizard')).toBeNull();
  });
});
