import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.service';
import { Core, CoreResponse } from '../../../core/models/core.interface';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { alertMethod } from '../../../functions/alert.function.js';
@Component({
  selector: 'app-cores-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent],
  templateUrl: './cores-management.component.html',
  styleUrl: './cores-management.component.css'
})

export class CoresManagementComponent implements OnInit {
  coreForm: FormGroup = new FormGroup({});
  cores: Core[] = [];
  selectedCore: Core | null = null;
  filteredCores: Core[] = [];

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private coreService: CoreService
  ) {
    this.coreForm = this.fb.group({
      coreName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCores();
  }

  openModal(modalId: string, core: Core): void {
    this.selectedCore = core;
    if (core) {
      this.coreForm.patchValue({
        coreName: core.name,
      });
    }
    const modalDiv = document.getElementById(modalId);
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  closeModal(modalId: string) {
    const modalDiv = document.getElementById(modalId);
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop != null) {
      backdrop.parentNode?.removeChild(backdrop);
    }
    this.selectedCore = null;
    this.coreForm.reset();
  }

  loadCores(): void {
    this.coreService.findAll().subscribe((coreResponse: CoreResponse<Core[]>) => {
      this.cores = coreResponse.data!;
      this.filteredCores = coreResponse.data!;
    });
  }

  onSearch(filteredCores: Core[]): void {
    this.filteredCores = filteredCores.length > 0 ? filteredCores : [];
  }

  checkCoreExists(coreName: string): Observable<boolean> {
    return this.coreService.findOneByName(coreName).pipe(
      map((coreResponse: CoreResponse) => !!coreResponse.data),
    );
  }

  addCore() {
    if (this.coreForm.valid) {
      const coreData = this.coreForm.value;
      this.checkCoreExists(coreData.name).pipe(switchMap((exists: boolean) => {
        if (!exists) {
          return this.coreService.add(coreData);
        }
        return throwError(() => new Error('La marca ya existe'));
      })).subscribe({
        next: () => {
          alertMethod('Alta de marcas', 'Marca creada exitosamente', 'success');
          this.loadCores();
          this.closeModal('addCore');
          this.coreForm.reset();
        },
        error: (err: any) => {
          if (err.message === 'La marca ya existe') {
            this.closeModal('addCore');
            this.alertComponent.showAlert(err.message, AlertType.Error);
          } else if (err.status === 500) {
            this.alertComponent.showAlert('Error interno del servidor', AlertType.Error);
          } else {
            this.closeModal('addCore');
            this.alertComponent.showAlert('Ocurrió un error al agregar la marca', AlertType.Error);
          }
          this.coreForm.reset();
        }
      });
    } else {
      this.alertComponent.showAlert('Por favor, complete todos los campos requeridos.', AlertType.Error);
      return
    }
  }

  editCore(): void {
    if (this.selectedCore) {
      const updatedCore: Core = {
        ...this.selectedCore,
        ...this.coreForm.value
      };
      this.checkCoreExists(updatedCore.name).pipe(
        switchMap((exists: boolean) => {
          if (exists) {
            return throwError(() => new Error('La marca ya existe'));
          }
          return this.coreService.update(updatedCore.id, updatedCore);
        })
      ).subscribe({
        next: () => {
          alertMethod('Actualización de marcas', 'Marca actualizada exitosamente', 'success');
          this.loadCores();
          this.closeModal('editCore');
          this.coreForm.reset();
        },
        error: (err: any) => {
          this.closeModal('editCore');
          if (err.message === 'La marca ya existe') {
            this.alertComponent.showAlert(err.message, AlertType.Error);
          } else if (err.status === 500) {
            this.alertComponent.showAlert('Error interno del servidor', AlertType.Error);
          } else {
            this.alertComponent.showAlert('Ocurrió un error al actualizar la marca', AlertType.Error);
          }
        }
      })
    }
  }

  deleteCore(core: Core | null, modalId: string) {
    if (core) {
      this.coreService.remove(core.id).subscribe(() => {
        alertMethod('Baja de marcas', 'Marca eliminada exitosamente', 'success');
        this.loadCores();
        this.closeModal(modalId);
        this.coreForm.reset();
      });
    }
  }
}
