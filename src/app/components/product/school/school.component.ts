import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolService } from '../../../core/services/school.service';
import { School } from '../../../core/models/school.interface';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearcherComponent } from '../../../shared/searcher/searcher.component';
import { UniversalAlertComponent } from '../../../shared/alerts/universal-alert/universal-alert.component';
import { alertMethod } from '../../../shared/alerts/alert-function/alert.function';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, UniversalAlertComponent],
  templateUrl: './school.component.html',
  styleUrl: './school.component.css'
})

export class SchoolComponent implements OnInit {
  schoolForm: FormGroup = new FormGroup({});
  schools: School[] = [];
  selectedSchool: School | null = null;
  filteredSchools: School[] = [];

  @ViewChild(UniversalAlertComponent) alertComponent!: UniversalAlertComponent

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService
  ) {
    this.schoolForm = this.fb.group({
      schoolName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSchool()
  }

  openModal(modalId: string, school: School): void {
    this.selectedSchool = school;
    if (school) {
      this.schoolForm.patchValue({
        schoolName: school.name,
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
    this.selectedSchool = null;
    this.schoolForm.reset();
  }

  loadSchool(): void {
    this.schoolService.getAllSchools().subscribe((schools: School[]) => {
      this.schools = schools;
      this.filteredSchools = schools;
    });
  }

  onSearch(filteredSchools: School[]): void {
    this.filteredSchools = filteredSchools.length > 0 ? filteredSchools : [];
  }

  checkSchoolExists(schoolName: string, excludeSchoolId?: string): Observable<boolean> {
    return this.schoolService.getOneSchoolByName(schoolName, excludeSchoolId).pipe(
      map((school: School) => !!school),
    );
  }

  addSchool() {
    if (this.schoolForm.valid) {
      const schoolData = this.schoolForm.value;
      this.checkSchoolExists(schoolData.schoolName).pipe(switchMap((exists: boolean) => {
        if (!exists) {
          return this.schoolService.addSchool(schoolData);
        }
        return throwError(() => new Error('The school already exists'));
      })).subscribe({
        next: () => {
          alertMethod('School Registration', 'School created successfully', 'success');
          this.loadSchool();
          this.closeModal('addSchool');
          this.schoolForm.reset();
        },
        error: (err: any) => {
          if (err.message === 'The school already exists') {
            this.closeModal('addSchool');
            this.alertComponent.showAlert(err.message, 'error');
          } else if (err.status === 500) {
            this.alertComponent.showAlert('Internal server error', 'error');
          } else {
            this.closeModal('addSchool');
            this.alertComponent.showAlert('An error occurred while adding the school', 'error');
          }
          this.schoolForm.reset();
        }
      });
    } else {
      this.alertComponent.showAlert('Please complete all required fields.', 'error');
      return
    }
  }

  editSchool(): void {
    if (this.selectedSchool) {
      const updatedSchool: School = {
        ...this.selectedSchool,
        ...this.schoolForm.value
      };
      this.checkSchoolExists(updatedSchool.name, this.selectedSchool.id.toString()).pipe(
        switchMap((exists: boolean) => {
          if (exists) {
            return throwError(() => new Error('The school already exists'));
          }
          return this.schoolService.editSchool(updatedSchool);
        })
      ).subscribe({
        next: () => {
          alertMethod('School Update', 'School updated successfully', 'success');
          this.loadSchool();
          this.closeModal('editSchool');
          this.schoolForm.reset();
        },
        error: (err: any) => {
          this.closeModal('editSchool');
          if (err.message === 'The school already exists') {
            this.alertComponent.showAlert(err.message, 'error');
          } else if (err.status === 500) {
            this.alertComponent.showAlert('Internal server error', 'error');
          } else {
            this.alertComponent.showAlert('An error occurred while updating the school', 'error');
          }
        }
      })
    }
  }

  deleteSchool(school: School | null, modalId: string) {
    if (school) {
      this.schoolService.deleteSchool(school).subscribe(() => {
        alertMethod('School Deletion', 'School deleted successfully', 'success');
        this.loadSchool();
        this.closeModal(modalId);
        this.schoolForm.reset();
      });
    }
  }
}