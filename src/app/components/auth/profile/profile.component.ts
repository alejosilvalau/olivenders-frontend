import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WizardService } from '../../../core/services/wizard.service.js';
import { AuthService } from '../../../core/services/auth.service';
import { Wizard, WizardRequest } from '../../../core/models/wizard.interface.js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { alertMethod } from '../../../functions/alert.function';
import { AlertType } from '../../../shared/components/alert/alert.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { EntitySelectorComponent } from '../../../shared/components/entity-selector/entity-selector.component.js';
import { SchoolService } from '../../../core/services/school.service.js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EntitySelectorComponent, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../shared/styles/forms.style.css']
})
export class ProfileComponent implements OnInit {
  wizard: Wizard | null = null;
  profileForm: FormGroup = new FormGroup({});
  currentPassword: string = '';
  changePasswordForm: FormGroup = new FormGroup({});

  constructor(
    private wizardService: WizardService,
    public schoolService: SchoolService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      school: ['', Validators.required],
    });
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    const page = 1;
    this.schoolService.findAll(page, Number.MAX_SAFE_INTEGER).subscribe(() => {
      this.reloadProfile();
    });
  }

  reloadProfile(): void {
    this.wizard = this.authService.getCurrentWizard();
    this.profileForm.patchValue({
      ...this.wizard,
      school: typeof this.wizard!.school === 'object' ? this.wizard!.school.id : this.wizard!.school,
      password: ''
    });
    this.changePasswordForm.reset();
  }

  private newPasswordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? true
      : false;
  }

  get profileFormControl() {
    return this.profileForm.get('school') as FormControl;
  }

  async updateProfile() {
    this.profileForm.markAllAsTouched();

    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.updateValueAndValidity();
    });

    if (this.profileForm.invalid) return;

    if (this.wizard?.id) {
      const updatedWizardRequest: WizardRequest = { ...this.wizard, ...this.profileForm.value };
      this.wizardService.update(this.wizard.id, updatedWizardRequest).subscribe({
        next: (res) => {
          const token = this.authService.getCurrentToken()
          const updatedWizard: Wizard = updatedWizardRequest as Wizard;

          this.authService.setWizardSession(updatedWizard, token);
          this.reloadProfile();

          alertMethod(res.message, 'Wizard successfully updated', AlertType.Success);
        },
        error: (err) => {
          alertMethod(err.error.message, 'Please try again', AlertType.Error);
        },
      });
    }
  }

  changePassword(): void {
    if (this.wizard?.id) {
      this.wizardService.validatePassword(this.wizard.id, { password: this.changePasswordForm.value.currentPassword })
        .subscribe({
          next: (res) => {
            if (!res.data) {
              alertMethod('Invalid current password', 'Please enter your current password correctly', AlertType.Error);
              return;
            }

            if (this.changePasswordForm.invalid) {
              alertMethod('Form is invalid', 'Please fill in all required fields', AlertType.Error);
              return;
            }

            if (!this.newPasswordMatchValidator(this.changePasswordForm)) {
              alertMethod('Passwords do not match', 'Please re-enter your password', AlertType.Error);
              this.changePasswordForm.get('newPassword')?.reset();
              this.changePasswordForm.get('confirmNewPassword')?.reset();
              return;
            }

            const newPassword: WizardRequest = { password: this.changePasswordForm.value.newPassword.trim() };
            this.wizardService.changePasswordWithoutToken(this.wizard!.id, newPassword)
              .subscribe({
                next: (res) => {
                  alertMethod(res.message, 'Password changed successfully', AlertType.Success);
                  this.changePasswordForm.reset();
                }
              });
          },
          error: (err) => {
            alertMethod(err.error.message, 'Please try again later', AlertType.Error);
          }
        });
    }
  }

  deactivateAccount(): void {
    if (this.wizard?.id) {
      this.wizardService.deactivate(this.wizard.id).subscribe({
        next: (res) => {
          alertMethod(res.message, 'Account deactivated successfully', AlertType.Success);
          this.authService.logout();
        },
        error: (err) => {
          alertMethod(err.error.message, 'Please try again later', AlertType.Error);
        }
      });
    }
  }
}
