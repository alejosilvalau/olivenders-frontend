import { Component } from '@angular/core';
import { Wand, WandStatus } from '../../../core/models/wand.interface';
import { WandService } from '../../../core/services/wand.service';
import { RouterLink } from '@angular/router';
import { Wizard } from '../../../core/models/wizard.interface';
import { AuthService } from '../../../core/services/auth.service';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { HostListener } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../../shared/components/bottom-sheet/bottom-sheet.component';
import { BottomSheetConfig } from '../../../core/models/bottom-sheet.interface';
import { CommonModule } from '@angular/common';
import { Wood } from '../../../core/models/wood.interface.js';

@Component({
  selector: 'app-wand-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FilterComponent],
  templateUrl: './wand-catalog.component.html',
  styleUrl: './wand-catalog.component.css',
})
export class WandCatalogComponent {
  wands: Wand[] = [];
  filteredWands: Wand[] = [];
  currentWizard: Wizard | null = null;
  showFilter = false;
  isMobile = false;
  selectedWands: string | null = null;

  constructor(
    private wandService: WandService,
    private authService: AuthService,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.currentWizard = this.authService.getCurrentWizard();
    this.loadWands();
    this.checkScreenSize();
  }

  loadWands() {
    this.wandService.findAll().subscribe({
      next: (res) => {
        this.wands = res.data!.filter((wand) => wand?.status == WandStatus.Available);
        this.filteredWands = this.wands;
      },
    });
  }

  isWandAvailable(wand: Wand): boolean {
    return wand.status !== WandStatus.Available;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onFilterChanged(filters: any): void {
    this.filteredWands = this.wands.filter((wand) => {

      if (filters.wood && typeof wand.wood === 'object') {
        if (wand.wood.name !== filters.wood) return false;
      }

      if (filters.core && typeof wand.core === 'object') {
        if (wand.core.name !== filters.core) return false;
      }

      if (filters.minPrice && wand.total_price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice && wand.total_price > filters.maxPrice) {
        return false;
      }

      if (filters.minlengthInches && wand.length_inches < filters.minlengthInches) {
        return false;
      }

      if (filters.maxlengthInches && wand.length_inches > filters.maxlengthInches) {
        return false;
      }
      return true;
    });

    this.fallbackBackendSearchIfEmpty(filters);
  }

  private fallbackBackendSearchIfEmpty(filters: any): void {
    if (this.filteredWands.length === 0) {
      if (filters.wood) {
        this.wandService.findAllByWood(filters.wood).subscribe({
          next: (res) => {
            this.filteredWands = res.data || [];
          },
          error: () => {
            this.filteredWands = [];
          }
        });
        return;
      }
      if (filters.core) {
        this.wandService.findAllByCore(filters.core).subscribe({
          next: (res) => {
            this.filteredWands = res.data || [];
          },
          error: () => {
            this.filteredWands = [];
          }
        });
        return;
      }
    }
  }

  private checkScreenSize(): void {
    const mobileBreakpoint = 992;
    this.isMobile = window.innerWidth < mobileBreakpoint;
    this.showFilter = !this.isMobile;
  }

  openWandDetails(wand: Wand): void {
    const config: BottomSheetConfig<Wand> = {
      title: 'Wand Details',
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'length_inches', label: 'Length' },
        { key: 'description', label: 'Description' },
        { key: 'total_price', label: 'Price' },
        { key: 'wood.name', label: 'Wood' },
        { key: 'core.name', label: 'Core' },
      ],
      data: wand,
    };

    this.bottomSheet.open(BottomSheetComponent, { data: config });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }
}
