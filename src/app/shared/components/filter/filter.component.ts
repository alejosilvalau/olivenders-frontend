import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { WoodService } from '../../../core/services/wood.service.js';
import { CoreService } from '../../../core/services/core.service.js';
import { Wood, WoodResponse } from '../../../core/models/wood.interface.js';
import { Core, CoreResponse } from '../../../core/models/core.interface.js';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  filterForm: FormGroup;
  woods: WoodResponse<Wood[]> = { message: '' };
  cores: CoreResponse<Core[]> = { message: '' };

  constructor(
    private fb: FormBuilder,
    private woodService: WoodService,
    private coreService: CoreService
  ) {
    this.filterForm = this.fb.group({
      wood: '',
      core: '',
      minPrice: 0,
      maxPrice: 0,
      minlengthInches: 0,
      maxLengthInches: 0,
    });
  }

  ngOnInit(): void {
    this.woodService.findAll().subscribe({
      next: (woods: WoodResponse<Wood[]>) => {
        this.woods = woods;
      },
      error: (err) => {
        console.error('Error fetching woods: ', err);
      },
    });

    this.coreService.findAll().subscribe({
      next: (cores: CoreResponse<Core[]>) => {
        this.cores = cores;
      },
      error: (err) => {
        console.error('Error fetching cores: ', err);
      },
    });
  }

  applyFilter(): void {
    const filterValues = this.filterForm.value;
    this.filterChanged.emit(filterValues);
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.filterChanged.emit({});
  }
}
