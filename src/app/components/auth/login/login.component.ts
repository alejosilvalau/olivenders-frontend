import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { alertMethod } from '../../../functions/alert.function';
import { AlertType } from '../../../shared/components/alert/alert.component.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../shared/styles/forms.style.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loginWizard(): void {
    if (this.loginForm.invalid) {
      alertMethod('Form is invalid', 'Please fill in all required fields', AlertType.Error);
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (loginResponse) => {
        this.isLoggedIn = true
        this.router.navigate(['/']);
        this.loginForm.reset();
      },
      error: (err: any) => {
        alertMethod(err.error.message, 'Please check your credentials and try again', AlertType.Error);
        this.loginForm.reset();
      }
    });
  }
}
