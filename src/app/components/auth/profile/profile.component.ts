import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
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

export enum FormState {
  Pending = 'PENDING',
  Valid = 'VALID',
  Invalid = 'INVALID',
  Disabled = 'DISABLED',
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  wizard: Wizard | null = null;
  profileForm: FormGroup = new FormGroup({});
  currentPassword: string = '';
  changePasswordForm: FormGroup = new FormGroup({});

  constructor(
    private wizardService: WizardService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.wizard = this.authService.getCurrentWizard();
    this.profileForm = this.fb.group({
      username: [
        this.wizard?.username,
        {
          validators: [Validators.required],
          asyncValidators: [this.validateUsername.bind(this)],
          updateOn: 'blur'
        },
      ],
      password: [
        this.currentPassword,
        {
          validators: [Validators.required, Validators.minLength(6)],
          asyncValidators: [this.validateCurrentPassword.bind(this)],
          updateOn: 'blur'
        },
      ],
      name: [this.wizard?.name, Validators.required],
      last_name: [this.wizard?.last_name, Validators.required],
      email: [
        this.wizard?.email,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.validateEmail.bind(this)],
          updateOn: 'blur',
        },
      ],
      address: [this.wizard?.phone, Validators.required],
      phone: [this.wizard?.phone, Validators.required],
      school: [this.wizard?.school, Validators.required],
    });
    this.changePasswordForm = this.fb.group({
      currentPassword: [
        this.currentPassword,
        {
          validators: [Validators.required, Validators.minLength(6)],
          asyncValidators: [this.validateCurrentPassword.bind(this)],
          updateOn: 'blur'
        },
      ],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required, Validators.minLength(6)],
    },
      { validators: this.passwordsMatch }
    );
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmNewPassword = this.changePasswordForm.get('confirmNewPassword')?.value;
    if (newPassword !== confirmNewPassword) {
      control.get('confirmPassword')?.setErrors({ notMatching: true });
      return { notMatching: true };
    } else {
      control.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }


  validateCurrentPassword(control: AbstractControl): Observable<ValidationErrors | null> {
    const wizardData = { password: control.value };
    return this.wizardService.validatePassword(this.wizard!.id, wizardData).pipe(
      map((res) => res.data ? null : { invalidCurrentPassword: true }),
      catchError(() => of({ invalidCurrentPassword: true }))
    );
  }

  validateUsername(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.wizardService.isUsernameAvailable(control.value).pipe(
      map((res) => res.data ? null : { usernameTaken: true }),
      catchError(err => of({ usernameTaken: true }))
    );
  }

  validateEmail(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.wizardService.isEmailAvailable(control.value).pipe(
      map((res) => res.data ? null : { emailTaken: true }),
      catchError(err => of({ emailTaken: true }))
    );
  }

  get formPending(): boolean {
    return this.profileForm.pending;
  }

  async updateProfile() {
    this.profileForm.markAllAsTouched();

    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.updateValueAndValidity();
    });

    if (this.profileForm.pending) {
      const isValid = await new Promise<boolean>((resolve) => {
        const sub = this.profileForm.statusChanges.subscribe((status) => {
          if (status !== FormState.Pending) {
            sub.unsubscribe();
            resolve(status === FormState.Valid);
          }
        });
      });

      if (!isValid) return;
    }

    if (this.profileForm.invalid) return;

    if (this.wizard?.id) {
      const updatedWizardRequest: WizardRequest = { ...this.wizard, ...this.profileForm.value };
      this.wizardService.update(this.wizard.id, updatedWizardRequest).subscribe({
        next: (res) => {
          const token = this.authService.getCurrentToken()
          const updatedWizard: Wizard = updatedWizardRequest as Wizard;

          this.authService.setWizardSession(updatedWizard, token);
          this.profileForm.reset();
          this.ngOnInit();

          alertMethod(res.message, 'Wizard successfully updated', AlertType.Success);
        },
        error: (err) => {
          alertMethod(err.error.message, 'Please try again', AlertType.Error);
        },
      });
    }
  }

  changePassword(): void {
    if (this.usuario?.id) {
      this.userService
        .changePassword(this.usuario.id, this.changePasswordForm.value)
        .subscribe({
          next: () => {
            this.closeModal('updatePassword');
            this.changePasswordForm.reset();
            this.ngOnInit();
            alertMethod('Actualizar perfil', 'Contraseña actualizada correctamente', 'success');
          },
          error: () => {
            alertMethod('Actualizar perfil', 'Error al actualizar la contraseña', 'error');
          },
        });
    } else
      console.error('El id del usuario es indefinido');
  }
}
}
