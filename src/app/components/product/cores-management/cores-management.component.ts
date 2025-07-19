import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.service';
import { Core, CoreResponse } from '../../../core/models/core.interface';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
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

  checkBrandExists(coreName: string): Observable<boolean> {
    return this.coreService.findOneByName(coreName).pipe(
      map((coreResponse: CoreResponse) => !!coreResponse.data),
    );
  }

  addBrand() {
    if (this.brandForm.valid) {
      const brandData = this.brandForm.value;
      this.checkBrandExists(brandData.nombreMarca).pipe(switchMap((exists: boolean) => {
        if (!exists) {
          return this.brandService.addBrand(brandData);
        }
        return throwError(() => new Error('La marca ya existe'));
      })).subscribe({
        next: () => {
          alertMethod('Alta de marcas', 'Marca creada exitosamente', 'success');
          this.loadBrand();
          this.closeModal('addBrand');
          this.brandForm.reset();
        },
        error: (err: any) => {
          if (err.message === 'La marca ya existe') {
            this.closeModal('addBrand');
            this.alertComponent.showAlert(err.message, 'error');
          } else if (err.status === 500) {
            this.alertComponent.showAlert('Error interno del servidor', 'error');
          } else {
            this.closeModal('addBrand');
            this.alertComponent.showAlert('Ocurrió un error al agregar la marca', 'error');
          }
          this.brandForm.reset();
        }
      });
    } else {
      this.alertComponent.showAlert('Por favor, complete todos los campos requeridos.', 'error');
      return
    }
  }

  editBrand(): void {
    if (this.selectedBrand) {
      const updatedBrand: Brand = {
        ...this.selectedBrand,
        ...this.brandForm.value
      };
      this.checkBrandExists(updatedBrand.nombreMarca, this.selectedBrand.id).pipe(
        switchMap((exists: boolean) => {
          if (exists) {
            return throwError(() => new Error('La marca ya existe'));
          }
          return this.brandService.editBrand(updatedBrand);
        })
      ).subscribe({
        next: () => {
          alertMethod('Actualización de marcas', 'Marca actualizada exitosamente', 'success');
          this.loadBrand();
          this.closeModal('editBrand');
          this.brandForm.reset();
        },
        error: (err: any) => {
          this.closeModal('editBrand');
          if (err.message === 'La marca ya existe') {
            this.alertComponent.showAlert(err.message, 'error');
          } else if (err.status === 500) {
            this.alertComponent.showAlert('Error interno del servidor', 'error');
          } else {
            this.alertComponent.showAlert('Ocurrió un error al actualizar la marca', 'error');
          }
        }
      })
    }
  }

  deleteBrand(brand: Brand | null, modalId: string) {
    if (brand) {
      this.brandService.deleteBrand(brand).subscribe(() => {
        alertMethod('Baja de marcas', 'Marca eliminada exitosamente', 'success');
        this.loadBrand();
        this.closeModal(modalId);
        this.brandForm.reset();
      });
    }
  }
}
