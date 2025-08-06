import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.service';
import { Core, CoreResponse } from '../../../core/models/core.interface';
import { Observable } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent, DataTableFormat } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { Wizard, WizardResponse, WizardRole } from '../../../core/models/wizard.interface.js';
import { WizardService } from '../../../core/services/wizard.service.js';

@Component({
  selector: 'app-wizard-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, ModalComponent],
  templateUrl: './wizard-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css']
})

export class WizardManagementComponent implements OnInit {
  wizardForm: FormGroup = new FormGroup({});
  wizards: Wizard[] = [];
  selectedWizard: Wizard | null = null;
  filteredWizards: Wizard[] = [];
  searchTerm: string = '';
  // public DataTableFormat = DataTableFormat;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private wizardService: WizardService
  ) { }


  ngOnInit(): void {
    this.findAllWizards();
  }

  onWizardSelected(wizard: Wizard): void {
    this.selectedWizard = wizard;
  }

  findAllWizards(): void {
    this.wizardService.findAll().subscribe((wizardResponse: WizardResponse<Wizard[]>) => {
      this.wizards = wizardResponse.data!;
      this.filteredWizards = wizardResponse.data!;
    });
  }

  private searchWizard(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      this.filteredWizards = [];
      return;
    }

    const isObjectId = /^[a-f\d]{24}$/i.test(trimmedTerm);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedTerm);
    let search$: Observable<CoreResponse<Wizard>>;
    if (isObjectId) {
      search$ = this.wizardService.findOne(trimmedTerm);
    } else if (isEmail) {
      search$ = this.wizardService.findOneByEmail(trimmedTerm);
    } else {
      search$ = this.wizardService.findOneByUsername(trimmedTerm);
    }

    search$.subscribe({
      next: res => {
        this.filteredWizards = res.data ? [res.data] : [];
      },
      error: err => {
        this.filteredWizards = [];
        this.alertComponent.showAlert(err.error.message, AlertType.Error);
      }
    });
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
          `Role changed to ${ isCurrentlyAdmin ? 'user' : 'admin' }`,
          AlertType.Success
        );
        this.ngOnInit();
      },
      error: (err) => {
        this.alertComponent.showAlert(err.error.message, AlertType.Error);
      }
    });
  }

  removeWizard(): void {
    if (this.selectedWizard) {
      this.wizardService.remove(this.selectedWizard.id).subscribe({
        next: (response: WizardResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWizards();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
        }
      });
      this.wizardForm.reset();
    }
  }
}
