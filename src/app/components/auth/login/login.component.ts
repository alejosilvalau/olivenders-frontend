import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { UniversalAlertComponent } from '../../../shared/components/alerts/universal-alert/universal-alert.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, UniversalAlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  wizard: string = '';
  password: string = '';
  isLoggedIn: boolean = false;

  @ViewChild(UniversalAlertComponent) alertComponent!: UniversalAlertComponent;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      wizard: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.alertComponent.showAlert('Please complete the missing fields', 'error');
      return;
    }

    this.wizard = this.loginForm.get('wizard')?.value;
    this.password = this.loginForm.get('password')?.value;


    this.authService.login(this.wizard, this.password).subscribe({
      next: (wizard) => {
        this.isLoggedIn = true
        this.router.navigate(['/']);

      },
      error: (error) => {
        if (error.status === 404) {
          this.alertComponent.showAlert('Wizard not found', 'error');
        } else if (error.status === 401) {
          this.alertComponent.showAlert('Wrong password', 'error');
        } else {
          this.alertComponent.showAlert('Login failed, please try again in a few minutes', 'error');
        }
        this.loginForm.reset();
      }
    });
  }

}
