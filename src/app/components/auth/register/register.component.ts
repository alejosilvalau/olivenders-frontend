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
import { alertMethod } from '../../../functions/alert.function';
import { AlertType } from '../../../shared/components/alert/alert.component';
import { EntitySelectorComponent } from '../../../shared/components/entity-selector/entity-selector.component.js';
import { SchoolService } from '../../../core/services/school.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EntitySelectorComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../shared/styles/forms.style.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

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
      alertMethod('Passwords do not match', 'Please re-enter your password', AlertType.Error);
      this.registerForm.get('password')?.reset();
      this.registerForm.get('confirmPassword')?.reset();
      return;
    }

    if (!this.registerForm.valid) {
      alertMethod('Form is invalid', 'Please fill in all required fields', AlertType.Error);
      return;
    }

    const userData = this.registerForm.value;

    this.wizardService.isUsernameAvailable(userData.username).subscribe({
      next: (usernameResponse) => {
        if (!usernameResponse.data) {
          alertMethod(usernameResponse.message, 'Please choose a different username', AlertType.Error);
          return;
        }
        this.wizardService.isEmailAvailable(userData.email).subscribe({
          next: (emailResponse) => {
            if (!emailResponse.data) {
              alertMethod(emailResponse.message, 'Please use a different email address', AlertType.Error);
              return;
            }

            this.wizardService.add(userData).subscribe({
              next: (addResponse) => {
                alertMethod(addResponse.message, 'You can now log in with your credentials', AlertType.Success);
                this.router.navigate(['/login']);
              },
              error: (err: any) => {
                alertMethod(err.error.message, 'Please try again', AlertType.Error);
              }
            });
          },
          error: (err: any) => {
            alertMethod(err.error.message, 'Please try again', AlertType.Error);
          }
        });
      },
      error: (err: any) => {
        alertMethod(err.error.message, 'Please try again', AlertType.Error);
      },
    });
  }
}
