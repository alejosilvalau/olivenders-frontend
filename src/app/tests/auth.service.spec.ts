import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

// Create a mock function
const mockJwtDecode = jasmine.createSpy('jwtDecode').and.returnValue({
  exp: Math.floor(Date.now() / 1000) + 60
});

// Mock the module before importing
beforeAll(() => {
  (window as any).jwtDecode = mockJwtDecode;
});

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockWizard = {
    id: '686fab31e5c1922fd703246c',
    username: 'dracomalfoy',
    name: 'draco',
    last_name: 'Malfoy',
    email: 'draco.malfoy2@hogwarts.edu',
    address: '5 Manor Drive, Malfoy Manor',
    phone: '445345678',
    role: 'admin',
    deactivated: false,
    school: '6870f73ba7d116ea3b5a1b06'
  };

  beforeEach(() => {
    localStorage.clear();
    // Don't set wizard in localStorage initially for the constructor test

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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

  it('Should login and save the token', (done) => {
    const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmZhYjMxZTVjMTkyMmZkNzAzMjQ2YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NTU0Mzg3MiwiZXhwIjoxNzU1NTQ3NDcyfQ.akvilW8RJB6mKKhqV5ptJ4bsNGO5oNckIKEHF6799NM';

    const mockResponse = {
      data: mockWizard,
      token: validJwt
    };
    const wizardData = { username: 'dracomalfoy', password: 'Expelio123#@@' };

    service.login(wizardData).subscribe((_) => {
      expect(localStorage.getItem('token')).toBe(validJwt);
      done();
    });

    const req = httpMock.expectOne(`${ service['apiUrl'] }/wizards/login`);
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
