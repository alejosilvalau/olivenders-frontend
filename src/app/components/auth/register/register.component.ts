import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardService } from '../../../core/services/wizard.service';
import { Router } from '@angular/router';
import { Wizard } from '../../../core/models/wizard.interface';
import { alertMethod } from '../../../functions/alert.function';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  private readonly defaultErrorMessage = 'An error occurred while registering. Please try again later.';

  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  constructor(
    private fb: FormBuilder,
    private wizardService: WizardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', [Validators.required]],
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      school: ['', [Validators.required]]
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('clave')?.value === form.get('repetirClave')?.value
      ? true
      : false;
  }

  private showErrorAlert(err: any) {
    const message = err?.error?.message || this.defaultErrorMessage;
    this.alertComponent.showAlert(message, AlertType.Error);
  }

  registerWizard() {
    if (!this.passwordMatchValidator(this.registerForm)) {
      this.alertComponent.showAlert('Passwords do not match. Please re-enter.', AlertType.Error);
      this.registerForm.get('password')?.reset();
      this.registerForm.get('passwordRepeat')?.reset();
      return;
    }

    if (!this.registerForm.valid) {
      this.alertComponent.showAlert('Invalid form. Please complete all fields.', AlertType.Error);
      return;
    }

    const userData = this.registerForm.value;

    this.wizardService.isUsernameAvailable(userData.username).subscribe({
      next: (usernameResponse) => {
        if (!usernameResponse.data) {
          this.alertComponent.showAlert(usernameResponse.message || this.defaultErrorMessage, AlertType.Error);
          return;
        }
        this.wizardService.isEmailAvailable(userData.email).subscribe({
          next: (emailResponse) => {
            if (!emailResponse.data) {
              this.alertComponent.showAlert(emailResponse.message || this.defaultErrorMessage, AlertType.Error);
              return;
            }

            this.wizardService.add(userData).subscribe({
              next: (addResponse) => {
                alertMethod('Registration Successful', 'You can now log in with your credentials.', AlertType.Success);
                this.registerForm.reset();
                this.router.navigate(['/login']);
                // this.alertComponent.showAlert(addResponse.message, AlertType.Success);
              },
              error: (err: any) => {
                this.showErrorAlert(err);
              }
            });
          },
          error: (err: any) => {
            this.showErrorAlert(err);
          }
        });
      },
      error: (err: any) => {
        this.showErrorAlert(err);
      },
    });
  }
}
