import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WoodService } from '../../../core/services/wood.service';
import { Wood, WoodResponse } from '../../../core/models/wood.interface';
import { Observable } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
@Component({
  selector: 'app-woods-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, AddButtonComponent, ModalComponent],
  templateUrl: './woods-management.component.html',
  styleUrl: './woods-management.component.css'
})

export class WoodsManagementComponent implements OnInit {
  woodForm: FormGroup = new FormGroup({});
  woods: Wood[] = [];
  selectedWood: Wood | null = null;
  filteredWoods: Wood[] = [];
  searchTerm: string = '';

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
    this.woodService.findAll().subscribe((woodResponse: WoodResponse<Wood[]>) => {
      this.woods = woodResponse.data!;
      this.filteredWoods = woodResponse.data!;
    });
  }

  private searchWood(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      this.filteredWoods = [];
      return;
    }

    const isObjectId = /^[a-f\d]{24}$/i.test(trimmedTerm);
    const search$: Observable<WoodResponse<Wood>> = isObjectId
      ? this.woodService.findOne(trimmedTerm)
      : this.woodService.findOneByName(trimmedTerm);

    search$.subscribe({
      next: res => {
        this.filteredWoods = res.data ? [res.data] : [];
      },
      error: err => {
        this.filteredWoods = [];
        this.alertComponent.showAlert(err.error.message || 'Wood not found', AlertType.Error);
      }
    });
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
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message || 'Error adding wood', AlertType.Error);
        }
      });
      this.woodForm.reset();
    } else {
      this.alertComponent.showAlert('Please complete all required fields.', AlertType.Error);
    }
  }

  editWood(): void {
    if (this.selectedWood) {
      const woodData = this.woodForm.value;
      this.woodService.update(this.selectedWood.id, woodData).subscribe({
        next: (response: WoodResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWoods();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.message || 'Error updating wood', AlertType.Error);
        }
      });
      this.woodForm.reset();
    }
  }

  removeWood(): void {
    if (this.selectedWood) {
      this.woodService.remove(this.selectedWood.id).subscribe({
        next: (response: WoodResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWoods();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.message || 'Error deleting wood', AlertType.Error);
        }
      });
      this.woodForm.reset();
    }
  }
}
