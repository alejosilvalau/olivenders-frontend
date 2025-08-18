import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, throwError } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent, DataTableFormat } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { Wizard, WizardResponse, WizardRole } from '../../../core/models/wizard.interface';
import { WizardService } from '../../../core/services/wizard.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SchoolService } from '../../../core/services/school.service';
import { chainedEntitySearch } from '../../../functions/chained-entity-search.function';

@Component({
  selector: 'app-wizard-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, ModalComponent, PaginationComponent],
  templateUrl: './wizard-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css']
})

export class WizardManagementComponent implements OnInit {
  wizards: Wizard[] = [];

  // Form properties
  wizardForm: FormGroup = new FormGroup({});
  selectedWizard: Wizard | null = null;

  // Search properties
  filteredWizards: Wizard[] = [];
  searchTerm: string = '';

  // Pagination properties
  totalWizards = 0;
  currentPage = 1;
  pageSize = 10;

  DataTableFormat = DataTableFormat;
  WizardRole = WizardRole;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private wizardService: WizardService,
    private schoolService: SchoolService
  ) { }


  ngOnInit(): void {
    this.findAllWizards();
  }

  onWizardSelected(wizard: Wizard): void {
    this.selectedWizard = wizard;
  }

  findAllWizards(): void {
    this.wizardService.findAll(this.currentPage, this.pageSize).subscribe((wizardResponse: WizardResponse<Wizard[]>) => {
      this.wizards = wizardResponse.data!;
      this.filteredWizards = wizardResponse.data!;
      this.totalWizards = wizardResponse.total || 0;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.findAllWizards();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.findAllWizards();
  }

  private searchWizard(term: string): void {
    const searchChain = [
      (t: string) => this.wizardService.findOneByUsername(t),
      (t: string) => this.wizardService.findOneByEmail(t),
      (t: string) => this.schoolService.findOneByName(t).pipe(
        switchMap(schoolRes => schoolRes.data
          ? this.wizardService.findAllBySchool(schoolRes.data.id)
          : throwError(() => null)
        )
      ),
      (t: string) => this.wizardService.findOne(t)
    ];

    const notFoundMessage = 'No wizard found with this search';
    chainedEntitySearch(
      term,
      searchChain,
      (results: Wizard[]) => this.filteredWizards = results,
      this.alertComponent,
      notFoundMessage
    );
  }

  onSearch(filteredWizards: Wizard[]): void {
    if (filteredWizards.length > 0) {
      this.filteredWizards = filteredWizards;
      return;
    }
    this.searchWizard(this.searchTerm);
  }

  changeWizardRole(): void {
    const isCurrentlyAdmin = this.selectedWizard!.role === WizardRole.Admin;
    const request$ = isCurrentlyAdmin
      ? this.wizardService.makeUser(this.selectedWizard!.id)
      : this.wizardService.makeAdmin(this.selectedWizard!.id);

    request$.subscribe({
      next: (res) => {
        this.alertComponent.showAlert(
          `Role changed to(${ isCurrentlyAdmin ? WizardRole.User : WizardRole.Admin }`, AlertType.Success);
        this.ngOnInit();
        this.wizardForm.reset();
      },
      error: (err) => {
        this.alertComponent.showAlert(err.error.message, AlertType.Error);
        this.wizardForm.reset();
      }
    });
  }

  removeWizard(): void {
    if (this.selectedWizard) {
      this.wizardService.remove(this.selectedWizard.id).subscribe({
        next: (response: WizardResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWizards();
          this.wizardForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.wizardForm.reset();
        }
      });
    }
  }
}
