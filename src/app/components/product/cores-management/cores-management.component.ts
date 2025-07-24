import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.service';
import { Core, CoreResponse } from '../../../core/models/core.interface';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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
  searchTerm: string = '';

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private coreService: CoreService
  ) {
    this.coreForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.findAllCores();
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

  findAllCores(): void {
    this.coreService.findAll().subscribe((coreResponse: CoreResponse<Core[]>) => {
      this.cores = coreResponse.data!;
      this.filteredCores = coreResponse.data!;
    });
  }

  private searchCore(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      this.filteredCores = [];
      return;
    }

    const isObjectId = /^[a-f\d]{24}$/i.test(trimmedTerm);
    if (isObjectId) {
      this.coreService.findOne(trimmedTerm).subscribe({
        next: res => {
          this.filteredCores = res.data ? [res.data] : [];
        },
        error: err => {
          this.filteredCores = [];
          this.alertComponent.showAlert(err.message || 'Core not found', AlertType.Error);
        }
      });
    } else {
      this.coreService.findOneByName(trimmedTerm).subscribe({
        next: res => {
          this.filteredCores = res.data ? [res.data] : [];
        },
        error: err => {
          this.filteredCores = [];
          this.alertComponent.showAlert(err.message || 'Core not found', AlertType.Error);
        }
      });
    }
  }

  onSearch(filteredCores: Core[]): void {
    if (filteredCores.length > 0) {
      this.filteredCores = filteredCores;
      return;
    }
    this.searchCore(this.searchTerm);
  }

  addCore(): void {
    if (this.coreForm.valid) {
      const coreData = this.coreForm.value;
      this.coreService.add(coreData).subscribe({
        next: (response: CoreResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllCores();
          this.closeModal('addCore');
          this.coreForm.reset();
        },
        error: (err: any) => {
          this.closeModal('addCore');
          this.alertComponent.showAlert(err.message || 'Error adding core', AlertType.Error);
          this.coreForm.reset();
        }
      });
    } else {
      this.alertComponent.showAlert('Please complete all required fields.', AlertType.Error);
    }
  }

  editCore(): void {
    if (this.selectedCore) {
      const updatedCore: Core = {
        ...this.selectedCore,
        ...this.coreForm.value
      };
      this.coreService.update(updatedCore.id, updatedCore).subscribe({
        next: (response: CoreResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllCores();
          this.closeModal('editCore');
          this.coreForm.reset();
        },
        error: (err: any) => {
          this.closeModal('editCore');
          this.alertComponent.showAlert(err.message || 'Error updating core', AlertType.Error);
          this.coreForm.reset();
        }
      });
    }
  }

  removeCore(core: Core | null, modalId: string): void {
    if (core) {
      this.coreService.remove(core.id).subscribe({
        next: (response: CoreResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllCores();
          this.closeModal(modalId);
          this.coreForm.reset();
        },
        error: (err: any) => {
          this.closeModal(modalId);
          this.alertComponent.showAlert(err.message || 'Error deleting core', AlertType.Error);
          this.coreForm.reset();
        }
      });
    }
  }
}
