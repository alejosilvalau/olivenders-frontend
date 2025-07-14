import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Wizard } from '../../../core/models/wizard.interface';
import { alertMethod } from '../../../shared/components/alerts/alert-function/alerts.functions';
import { UniversalAlertComponent } from '../../../shared/components/alerts/universal-alert/universal-alert.component';
import { WizardService } from '../../../core/services/wizard.service.js';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UniversalAlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  @ViewChild(UniversalAlertComponent) alertComponent!: UniversalAlertComponent;

  constructor(
    private fb: FormBuilder,
    private wizardService: WizardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      repetirClave: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      rol: null,
    });
    if (this.passwordMatchValidator(this.registerForm) !== null) {
      console.log('Las contraseñas no coinciden');
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('clave')?.value === form.get('repetirClave')?.value
      ? true
      : false;
  }

  onSubmit() {
    if (this.passwordMatchValidator(this.registerForm)) {
      if (this.registerForm.valid) {
        // Create separate calls to check email and username
        const checkUsername = this.wizardService.checkUsername(this.registerForm.value.usuario);
        const checkEmail = this.wizardService.checkEmail(this.registerForm.value.mail);

        forkJoin([
          checkUsername.pipe(catchError(err => of(true))), // true = username exists (error case)
          checkEmail.pipe(catchError(err => of(true)))     // true = email exists (error case)
        ]).subscribe({
          next: ([usernameExists, emailExists]) => {
            if (usernameExists) {
              this.alertComponent.showAlert('El nombre de usuario ya está registrado', 'error');
              return;
            }

            if (emailExists) {
              this.alertComponent.showAlert('El email ya está registrado', 'error');
              return;
            }

            // If both checks pass, create the user
            const wizardFinal = {
              ...this.registerForm.value,
              username: this.registerForm.value.usuario,
              password: this.registerForm.value.clave,
              name: this.registerForm.value.nombre,
              last_name: this.registerForm.value.apellido,
              phone: this.registerForm.value.telefono,
              email: this.registerForm.value.mail,
              address: this.registerForm.value.direccion,
              role: 'user', // assuming 'user' is the correct value for regular users
            };

            this.wizardService.addWizard(wizardFinal).subscribe({
              next: () => {
                alertMethod(
                  'Usuario registrado',
                  'El usuario se ha registrado correctamente',
                  'success'
                );
                this.registerForm.reset();
                this.router.navigate(['/auth/login']);
              },
              error: (error: any) => {
                console.error('Error al crear usuario:', error);
                alertMethod(
                  'Ocurrió un error',
                  'Error al registrar el usuario',
                  'error'
                );
              },
            });
          },
          error: (error: any) => {
            console.error('Error al verificar disponibilidad:', error);
            alertMethod(
              'Error',
              'Error al verificar disponibilidad de datos',
              'error'
            );
          }
        });
      } else {
        this.alertComponent.showAlert(
          'Formulario inválido. Complete todos los campos',
          'error'
        );
      }
    } else {
      this.alertComponent.showAlert('Las contraseñas no coinciden', 'error');
      this.registerForm.get('clave')?.reset();
      this.registerForm.get('repetirClave')?.reset();
    }
  }
}
