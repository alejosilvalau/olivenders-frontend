import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.service';
import { Core, CoreResponse } from '../../../core/models/core.interface';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent, DataTableFormat } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component.js';
import { chainedEntitySearch } from '../../../functions/chained-entity-search.function.js';
@Component({
  selector: 'app-core-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, AddButtonComponent, ModalComponent, PaginationComponent],
  templateUrl: './core-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css']
})

export class CoreManagementComponent implements OnInit {
  cores: Core[] = [];

  // Form properties
  coreForm: FormGroup = new FormGroup({});
  selectedCore: Core | null = null;

  // Search properties
  filteredCores: Core[] = [];
  searchTerm: string = '';

  // Pagination properties
  totalCores = 0;
  currentPage = 1;
  pageSize = 10;

  DataTableFormat = DataTableFormat;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private coreService: CoreService
  ) {
    this.coreForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.findAllCores();
  }

  onCoreSelected(core: Core): void {
    this.selectedCore = core;
    if (core) {
      this.coreForm.patchValue({ ...core });
    }
  }

  findAllCores(): void {
    this.coreService.findAll(this.currentPage, this.pageSize).subscribe((coreResponse: CoreResponse<Core[]>) => {
      this.cores = coreResponse.data!;
      this.filteredCores = coreResponse.data!;
      this.totalCores = coreResponse.total || 0;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.findAllCores();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.findAllCores();
  }

  private searchCore(term: string): void {
    const searchChain = [
      (t: string) => this.coreService.findOneByName(t),
      (t: string) => this.coreService.findOne(t)
    ];

    const notFoundMessage = 'No core found with this search';
    chainedEntitySearch(
      term, searchChain,
      (results: Core[]) => this.filteredCores = results,
      this.alertComponent,
      notFoundMessage
    );
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
        next: (res: CoreResponse) => {
          this.alertComponent.showAlert(res.message, AlertType.Success);
          this.findAllCores();
          this.coreForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.coreForm.reset();
        }
      });
    } else {
      this.alertComponent.showAlert('Please complete all required fields', AlertType.Error);
    }
  }

  editCore(): void {
    if (this.selectedCore) {
      const coreData = this.coreForm.value;
      this.coreService.update(this.selectedCore.id, coreData).subscribe({
        next: (response: CoreResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllCores();
          this.coreForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.coreForm.reset();
        }
      });
    }
  }

  removeCore(): void {
    if (this.selectedCore) {
      this.coreService.remove(this.selectedCore.id).subscribe({
        next: (response: CoreResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllCores();
          this.coreForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.coreForm.reset();
        }
      });
    }
  }
}
