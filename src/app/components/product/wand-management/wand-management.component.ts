import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WandService } from '../../../core/services/wand.service';
import { WoodService } from '../../../core/services/wood.service';
import { CoreService } from '../../../core/services/core.service';
import { Wand, WandResponse } from '../../../core/models/wand.interface';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent, DataTableFormat } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { environment } from '../../../../environments/environment.js';
import { ImageService } from '../../../core/services/image.service.js';
import { ImageResponse } from '../../../core/models/image.interface.js';
import { EntitySelectorComponent } from '../../../shared/components/entity-selector/entity-selector.component.js';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component.js';
import { throwError } from 'rxjs/internal/observable/throwError';
import { switchMap } from 'rxjs';
import { chainedEntitySearch } from '../../../functions/chained-entity-search.function.js';

@Component({
  selector: 'app-wand-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, AddButtonComponent, ModalComponent, EntitySelectorComponent, PaginationComponent],
  templateUrl: './wand-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css', './wand-management.component.css']
})

export class WandManagementComponent implements OnInit {
  wandForm: FormGroup = new FormGroup({});
  wands: Wand[] = [];

  // Search properties
  filteredWands: Wand[] = [];
  searchTerm: string = '';

  // Form properties
  selectedWand: Wand | null = null;
  selectedImageFile: File | null = null;
  previewUrl: string | null = null;

  // Pagination properties
  totalWands = 0;
  currentPage = 1;
  pageSize = 10;

  DataTableFormat = DataTableFormat;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private wandService: WandService,
    private imageService: ImageService,
    public coreService: CoreService,
    public woodService: WoodService
  ) {
    this.wandForm = this.fb.group({
      name: ['', Validators.required],
      length_inches: [0, Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      profit: [0, Validators.required],
      wood: ['', Validators.required],
      core: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.findAllWands();
  }

  get woodFormControlField() {
    return this.wandForm.get('wood') as FormControl;
  }

  get coreFormControlField() {
    return this.wandForm.get('core') as FormControl;
  }

  onWandSelected(wand: Wand): void {
    this.selectedWand = wand;
    this.wandForm.patchValue({
      ...wand,
      wood: typeof wand.wood === 'object' ? wand.wood.id : wand.wood,
      core: typeof wand.core === 'object' ? wand.core.id : wand.core
    });
    this.previewUrl = wand.image;
  }

  findAllWands(): void {
    this.wandService.findAll(this.currentPage, this.pageSize).subscribe((wandResponse: WandResponse<Wand[]>) => {
      this.wands = wandResponse.data!;
      this.filteredWands = wandResponse.data!;
      this.totalWands = wandResponse.total || 0;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.findAllWands();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.findAllWands();
  }

  searchWand(term: string): void {
    const searchChain = [
      (t: string) => this.woodService.findOneByName(t).pipe(
        switchMap(woodRes => woodRes.data
          ? this.wandService.findAllByWood(woodRes.data.id)
          : throwError(() => null)
        )
      ),
      (t: string) => this.coreService.findOneByName(t).pipe(
        switchMap(coreRes => coreRes.data
          ? this.wandService.findAllByCore(coreRes.data.id)
          : throwError(() => null)
        )
      ),
      (t: string) => this.wandService.findOne(t)
    ];

    const notFoundMessage = 'No wand found with this search';
    chainedEntitySearch(
      term,
      searchChain,
      (results: Wand[]) => this.filteredWands = results,
      this.alertComponent,
      notFoundMessage
    );
  }


  onSearch(filteredWands: Wand[]): void {
    if (filteredWands.length > 0) {
      this.filteredWands = filteredWands;
      return;
    }
    this.searchWand(this.searchTerm);
  }

  resetWandForm(): void {
    this.wandForm.reset();
    this.selectedWand = null;
    this.removePreviewImage();
  }

  async addWand() {
    await this.uploadImageToCloudinary(this.selectedImageFile!);
    if (this.wandForm.valid) {
      const wandData = this.wandForm.value;
      this.wandService.add(wandData).subscribe({
        next: (res: WandResponse) => {
          this.alertComponent.showAlert(res.message, AlertType.Success);
          this.findAllWands();
          this.resetWandForm();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.resetWandForm();
        }
      });
    } else {
      this.alertComponent.showAlert('Please complete all required fields', AlertType.Error);
    }
  }

  async editWand() {
    if (this.selectedImageFile) {
      await this.uploadImageToCloudinary(this.selectedImageFile);
    }
    if (this.selectedWand) {
      const wandData = this.wandForm.value;
      this.wandService.update(this.selectedWand.id, wandData).subscribe({
        next: (response: WandResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllWands();
          this.resetWandForm();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.resetWandForm();
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
          this.resetWandForm();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.resetWandForm();
        }
      });
    }
  }

  onImageDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImageFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  removePreviewImage() {
    this.previewUrl = null;
    this.selectedImageFile = null;
    this.wandForm.get('image')?.setValue('');
  }

  uploadImageToCloudinary(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!file) {
        this.alertComponent.showAlert('Please select an image file', AlertType.Error);
        reject('No file provided');
        return;
      }
      this.imageService.sign().subscribe({
        next: (res: ImageResponse) => {
          const { timestamp, signature } = res.data!;
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', environment.cloudinary.apiKey);
          formData.append('timestamp', timestamp);
          formData.append('signature', signature);
          formData.append('upload_preset', environment.cloudinary.uploadPreset);
          formData.append('folder', 'olivenders');

          fetch(
            `https://api.cloudinary.com/v1_1/${ environment.cloudinary.cloudName }/image/upload`,
            {
              method: 'POST',
              body: formData
            }
          )
            .then(response => response.json())
            .then(data => {
              if (data.secure_url) {
                this.wandForm.patchValue({ image: data.secure_url });
                resolve();
              } else {
                this.alertComponent.showAlert('Image upload failed. Please try again', AlertType.Error);
                reject();
              }
            })
            .catch(error => {
              this.alertComponent.showAlert('Image upload failed. Please try again', AlertType.Error);
              reject(error);
            });
        },
        error: (err) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          reject(err);
        },
      });
    });
  }

}
