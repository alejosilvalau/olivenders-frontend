import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
import { EntitySelectorComponent } from '../../../shared/components/entity-selector/entity-selector.component.js';
import { SchoolService } from '../../../core/services/school.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent, EntitySelectorComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../shared/styles/forms.style.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  constructor(
    private fb: FormBuilder,
    private wizardService: WizardService,
    public schoolService: SchoolService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      school: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get schoolFormControl() {
    return this.registerForm.get('school') as FormControl;
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? true
      : false;
  }

  registerWizard() {
    if (!this.passwordMatchValidator(this.registerForm)) {
      this.alertComponent.showAlert('Passwords do not match. Please re-enter.', AlertType.Error);
      this.registerForm.get('password')?.reset();
      this.registerForm.get('confirmPassword')?.reset();
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
          this.alertComponent.showAlert(usernameResponse.message, AlertType.Error);
          return;
        }
        this.wizardService.isEmailAvailable(userData.email).subscribe({
          next: (emailResponse) => {
            if (!emailResponse.data) {
              this.alertComponent.showAlert(emailResponse.message, AlertType.Error);
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
                this.alertComponent.showAlert(err.error.message, AlertType.Error);
              }
            });
          },
          error: (err: any) => {
            this.alertComponent.showAlert(err.error.message, AlertType.Error);
          }
        });
      },
      error: (err: any) => {
        this.alertComponent.showAlert(err.error.message, AlertType.Error);
      },
    });
  }
}
