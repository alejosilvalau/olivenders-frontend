import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WandService } from '../../../core/services/wand.service';
import { WoodService } from '../../../core/services/wood.service';
import { CoreService } from '../../../core/services/core.service';
import { Wand, WandResponse, WandStatus } from '../../../core/models/wand.interface';
import { Wood } from '../../../core/models/wood.interface';
import { Core } from '../../../core/models/core.interface';
import { Observable } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
@Component({
  selector: 'app-wands-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, AddButtonComponent, ModalComponent],
  templateUrl: './wands-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css']
})

export class WandsManagementComponent implements OnInit {
  wandForm: FormGroup = new FormGroup({});
  wands: Wand[] = [];
  selectedWand: Wand | null = null;
  filteredWands: Wand[] = [];
  searchTerm: string = '';

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private wandService: WandService,
    private woodService: WoodService,
    private coreService: CoreService
  ) {
    this.wandForm = this.fb.group({
      name: ['', Validators.required],
      length_inches: [0, Validators.required],
      description: ['', Validators.required],
      status: [WandStatus.Available, Validators.required],
      image: ['', Validators.required],
      profit: [0, Validators.required],
      total_price: [0, Validators.required],
      wood: ['', Validators.required],
      core: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.findAllWands();
  }

  onWandSelected(wand: Wand): void {
    this.selectedWand = wand;
    if (wand) {
      this.wandForm.patchValue({ ...wand });
    }
  }

  findAllWands(): void {
    this.wandService.findAll().subscribe((wandResponse: WandResponse<Wand[]>) => {
      this.wands = wandResponse.data!;
      this.filteredWands = wandResponse.data!;
    });
  }

  private searchWand(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      this.filteredWands = [];
      return;
    }

    const isObjectId = /^[a-f\d]{24}$/i.test(trimmedTerm);
    const search$: Observable<WandResponse<Wand>> = isObjectId
      ? this.wandService.findOne(trimmedTerm)
      : this.wandService.findOneByName(trimmedTerm);

    // Modify this to handle finding the wood and the core by name, calling the findAllByCore or findAllByWood.
    // Previous to that, callind the findOneByName method on both.

    search$.subscribe({
      next: res => {
        this.filteredWands = res.data ? [res.data] : [];
      },
      error: err => {
        this.filteredWands = [];
        this.alertComponent.showAlert(err.error.message, AlertType.Error);
      }
    });
  }

  onSearch(filteredWands: Wand[]): void {
    if (filteredWands.length > 0) {
      this.filteredWands = filteredWands;
      return;
    }
    this.searchWand(this.searchTerm);
  }

  addWand(): void {
    if (this.wandForm.valid) {
      const wandData = this.wandForm.value;
      this.wandService.add(wandData).subscribe({
        next: (res: WandResponse) => {
          this.alertComponent.showAlert(res.message, AlertType.Success);
          this.findAllWands();
          this.wandForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.wandForm.reset();
        }
      });
    } else {
      this.alertComponent.showAlert('Please complete all required fields.', AlertType.Error);
    }
  }

  editWand(): void {
    if (this.selectedWand) {
      const wandData = this.wandForm.value;
      this.wandService.update(this.selectedWand.id, wandData).subscribe({
        next: (response: WandResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWands();
          this.wandForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.wandForm.reset();
        }
      });
    }
  }

  removeWand(): void {
    if (this.selectedWand) {
      this.wandService.remove(this.selectedWand.id).subscribe({
        next: (response: WandResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWands();
          this.wandForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.wandForm.reset();
        }
      });
    }
  }
}
