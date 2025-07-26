import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolService } from '../../../core/services/school.service';
import { School, SchoolResponse } from '../../../core/models/school.interface';
import { Observable } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
@Component({
  selector: 'app-schools-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, AddButtonComponent, ModalComponent],
  templateUrl: './schools-management.component.html',
  styleUrl: '../../../shared/styles/management.style.css'
})

export class SchoolsManagementComponent implements OnInit {
  schoolForm: FormGroup = new FormGroup({});
  schools: School[] = [];
  selectedSchool: School | null = null;
  filteredSchools: School[] = [];
  searchTerm: string = '';

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService
  ) {
    this.schoolForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.findAllSchools();
  }

  onSchoolSelected(school: School): void {
    this.selectedSchool = school;
    if (school) {
      this.schoolForm.patchValue({ ...school });
    }
  }

  findAllSchools(): void {
    this.schoolService.findAll().subscribe((schoolResponse: SchoolResponse<School[]>) => {
      this.schools = schoolResponse.data!;
      this.filteredSchools = schoolResponse.data!;
    });
  }

  private searchSchool(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      this.filteredSchools = [];
      return;
    }

    const isObjectId = /^[a-f\d]{24}$/i.test(trimmedTerm);
    const search$: Observable<SchoolResponse<School>> = isObjectId
      ? this.schoolService.findOne(trimmedTerm)
      : this.schoolService.findOneByName(trimmedTerm);

    search$.subscribe({
      next: res => {
        this.filteredSchools = res.data ? [res.data] : [];
      },
      error: err => {
        this.filteredSchools = [];
        this.alertComponent.showAlert(err.error.message || 'School not found', AlertType.Error);
      }
    });
  }

  onSearch(filteredSchools: School[]): void {
    if (filteredSchools.length > 0) {
      this.filteredSchools = filteredSchools;
      return;
    }
    this.searchSchool(this.searchTerm);
  }

  addSchool(): void {
    if (this.schoolForm.valid) {
      const schoolData = this.schoolForm.value;
      this.schoolService.add(schoolData).subscribe({
        next: (res: SchoolResponse) => {
          this.alertComponent.showAlert(res.message, AlertType.Success);
          this.findAllSchools();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message || 'Error adding the school', AlertType.Error);
        }
      });
      this.schoolForm.reset();
    } else {
      this.alertComponent.showAlert('Please complete all required fields.', AlertType.Error);
    }
  }

  editSchool(): void {
    if (this.selectedSchool) {
      const schoolData = this.schoolForm.value;
      this.schoolService.update(this.selectedSchool.id, schoolData).subscribe({
        next: (response: SchoolResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllSchools();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.message || 'Error updating the school', AlertType.Error);
        }
      });
      this.schoolForm.reset();
    }
  }

  removeSchool(): void {
    if (this.selectedSchool) {
      this.schoolService.remove(this.selectedSchool.id).subscribe({
        next: (response: SchoolResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllSchools();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.message || 'Error deleting the school', AlertType.Error);
        }
      });
      this.schoolForm.reset();
    }
  }
}
