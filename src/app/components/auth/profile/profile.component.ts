import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WizardService } from '../../../core/services/wizard.service';
import { AuthService } from '../../../core/services/auth.service';
import { Wizard, WizardRequest } from '../../../core/models/wizard.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { alertMethod } from '../../../functions/alert.function';
import { AlertType } from '../../../shared/components/alert/alert.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { EntitySelectorComponent } from '../../../shared/components/entity-selector/entity-selector.component';
import { SchoolService } from '../../../core/services/school.service';

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
      current_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_new_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.schoolService.findAll().subscribe(() => {
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
    return form.get('new_password')?.value === form.get('confirm_new_password')?.value
      ? true
      : false;
  }

  get profileFormControl() {
    return this.profileForm.get('school') as FormControl;
  }

  resetPasswordOnProfileForm() {
    this.profileForm.get('password')?.reset();
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
      this.wizardService.validatePassword(this.wizard.id, { password: this.changePasswordForm.value.current_password })
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
              this.changePasswordForm.get('new_password')?.reset();
              this.changePasswordForm.get('confirm_new_password')?.reset();
              return;
            }

            if (this.changePasswordForm.value.current_password === this.changePasswordForm.value.new_password) {
              alertMethod('New password must be different from current password', 'Please choose a different password!', AlertType.Error);
              this.changePasswordForm.get('new_password')?.reset();
              this.changePasswordForm.get('confirm_new_password')?.reset();
              return;
            }

            const newPassword: WizardRequest = { password: this.changePasswordForm.value.new_password.trim() };
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
            this.changePasswordForm.reset();
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
