import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { alertMethod } from '../../../functions/alert.function';
import { AlertType } from '../../../shared/components/alert/alert.component';
import { WizardService } from '../../../core/services/wizard.service.js';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../../shared/styles/forms.style.css', './forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  verificationForm: FormGroup = new FormGroup({});
  newPasswordForm: FormGroup = new FormGroup({});
  disablePasswordForm: boolean = true;
  private wizardId: string = '';

  constructor(
    private fb: FormBuilder,
    private wizardService: WizardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.verificationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.newPasswordForm = this.fb.group({
      newPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]]
    });
  }

  verifyAccountByEmail(): void {
    if (this.verificationForm.valid) {
      const email = this.verificationForm.value.email.trim();
      this.wizardService.findOneByEmail(email).subscribe({
        next: (res) => {
          if (res.data) {
            this.wizardId = res.data.id;
            this.disablePasswordForm = false;
            this.newPasswordForm.get('newPassword')?.enable();
            this.newPasswordForm.get('confirmNewPassword')?.enable();
          } else {
            alertMethod(res.message, 'Account not found', AlertType.Error);
            this.verificationForm.reset();
          }
        },
        error: (err) => {
          alertMethod(err.error.message, 'Please try again', AlertType.Error);
          this.verificationForm.reset();
        }
      });
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? true
      : false;
  }

  changePassword(): void {
    if (!this.passwordMatchValidator(this.newPasswordForm)) {
      alertMethod('Passwords do not match', 'Please re-enter your password', AlertType.Error);
      this.newPasswordForm.reset();
      return;
    }

    if (!this.newPasswordForm.valid) {
      alertMethod('Form is invalid', 'Please fill in all required fields', AlertType.Error);
      return;
    }

    const newPasswordObject = { password: this.newPasswordForm.value.newPassword.trim() };
    this.wizardService.changePasswordWithoutToken(this.wizardId, newPasswordObject).subscribe({
      next: (res) => {
        alertMethod(res.message, 'Password changed successfully', AlertType.Success);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alertMethod(err.error.message, 'Please try again', AlertType.Error);
        this.newPasswordForm.reset();
      }
    });
  }
}
