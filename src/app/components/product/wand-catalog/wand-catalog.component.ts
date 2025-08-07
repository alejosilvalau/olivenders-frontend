import { Component } from '@angular/core';
import { Wand, WandStatus } from '../../../core/models/wand.interface';
import { WandService } from '../../../core/services/wand.service';
import { RouterLink } from '@angular/router';
import { Wizard } from '../../../core/models/wizard.interface';
import { AuthService } from '../../../core/services/auth.service';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WandDetailsButtonComponent } from '../../../shared/components/wand-details-button/wand-details-button.js';
import { InfiniteScrollComponent } from '../../../shared/components/infinite-scroll/infinite-scroll.component.js';

@Component({
  selector: 'app-wand-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FilterComponent, WandDetailsButtonComponent, InfiniteScrollComponent],
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

  // Pagination state
  page = 1;
  pageSize = 12;
  loading = false;
  allLoaded = false;

  constructor(
    private wandService: WandService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentWizard = this.authService.getCurrentWizard();
    this.loadWands();
    this.checkScreenSize();
  }

  loadWands() {
    if (this.allLoaded || this.loading) return;
    this.loading = true;
    this.wandService.findAll(this.page, this.pageSize).subscribe({
      next: (res) => {
        const newWands = (res.data || []).filter(wand => wand?.status == WandStatus.Available);
        if (newWands.length < this.pageSize) this.allLoaded = true;
        this.filteredWands = [...this.filteredWands, ...newWands];
        this.page++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onScrollLoadMore() {
    this.loadWands();
  }

  isWandAvailable(wand: Wand): boolean {
    return wand.status !== WandStatus.Available;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onFilterChanged(filters: any): void {
    const hasFilters = Object.values(filters).some(filter => filter !== null && filter !== '' && filter !== undefined);

    if (!hasFilters) {
      this.page = 1;
      this.allLoaded = false;
      this.filteredWands = [];
      this.loadWands();
      return;
    }

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
      this.page = 1;
      this.allLoaded = false;
      this.loading = true;

      if (filters.wood) {
        this.wandService.findAllByWood(filters.wood, this.page, this.pageSize).subscribe({
          next: (res) => {
            const newWands = res.data || [];
            this.filteredWands = newWands;
            if (newWands.length < this.pageSize) this.allLoaded = true;
            this.page++;
            this.loading = false;
          },
          error: () => {
            this.filteredWands = [];
            this.loading = false;
          }
        });
        return;
      }
      if (filters.core) {
        this.wandService.findAllByCore(filters.core, this.page, this.pageSize).subscribe({
          next: (res) => {
            const newWands = res.data || [];
            this.filteredWands = newWands;
            if (newWands.length < this.pageSize) this.allLoaded = true;
            this.page++;
            this.loading = false;
          },
          error: () => {
            this.filteredWands = [];
            this.loading = false;
          }
        });
        return;
      }
      this.loading = false;
    }
  }

  private checkScreenSize(): void {
    const mobileBreakpoint = 992;
    this.isMobile = window.innerWidth < mobileBreakpoint;
    this.showFilter = !this.isMobile;
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }
}
