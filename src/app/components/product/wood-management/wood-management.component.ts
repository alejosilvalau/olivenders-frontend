import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WoodService } from '../../../core/services/wood.service';
import { Wood, WoodResponse } from '../../../core/models/wood.interface';
import { Observable } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent, DataTableFormat } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component.js';
import { chainedEntitySearch } from '../../../functions/chained-entity-search.function.js';
@Component({
  selector: 'app-wood-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, AddButtonComponent, ModalComponent, PaginationComponent],
  templateUrl: './wood-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css']
})

export class WoodManagementComponent implements OnInit {
  woodForm: FormGroup = new FormGroup({});
  woods: Wood[] = [];
  selectedWood: Wood | null = null;
  filteredWoods: Wood[] = [];
  searchTerm: string = '';
  totalWoods = 0;
  currentPage = 1;
  pageSize = 10;

  DataTableFormat = DataTableFormat;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private woodService: WoodService
  ) {
    this.woodForm = this.fb.group({
      name: ['', Validators.required],
      binomial_name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.findAllWoods();
  }

  onWoodSelected(wood: Wood): void {
    this.selectedWood = wood;
    if (wood) {
      this.woodForm.patchValue({ ...wood });
    }
  }

  findAllWoods(): void {
    this.woodService.findAll(this.currentPage, this.pageSize).subscribe((woodResponse: WoodResponse<Wood[]>) => {
      this.woods = woodResponse.data!;
      this.filteredWoods = woodResponse.data!;
      this.totalWoods = woodResponse.total || 0;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.findAllWoods();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.findAllWoods();
  }

  private searchWood(term: string): void {
    const searchChain = [
      (t: string) => this.woodService.findOneByName(t),
      (t: string) => this.woodService.findOne(t)
    ];

    const notFoundMessage = 'No wood found with this search';
    chainedEntitySearch(
      term, searchChain,
      (results: Wood[]) => this.filteredWoods = results,
      this.alertComponent,
      notFoundMessage
    );
  }

  onSearch(filteredWoods: Wood[]): void {
    if (filteredWoods.length > 0) {
      this.filteredWoods = filteredWoods;
      return;
    }
    this.searchWood(this.searchTerm);
  }

  addWood(): void {
    if (this.woodForm.valid) {
      const woodData = this.woodForm.value;
      this.woodService.add(woodData).subscribe({
        next: (res: WoodResponse) => {
          this.alertComponent.showAlert(res.message, AlertType.Success);
          this.findAllWoods();
          this.woodForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.woodForm.reset();
        }
      });

    } else {
      this.alertComponent.showAlert('Please complete all required fields', AlertType.Error);
    }
  }

  editWood(): void {
    if (this.selectedWood) {
      const woodData = this.woodForm.value;
      this.woodService.update(this.selectedWood.id, woodData).subscribe({
        next: (response: WoodResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWoods();
          this.woodForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.woodForm.reset();
        }
      });

    }
  }

  removeWood(): void {
    if (this.selectedWood) {
      this.woodService.remove(this.selectedWood.id).subscribe({
        next: (response: WoodResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWoods();
          this.woodForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.woodForm.reset();
        }
      });
    }
  }
}
