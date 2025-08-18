import { Component, AfterViewChecked } from '@angular/core';
import { Wand, WandStatus } from '../../../core/models/wand.interface';
import { WandService } from '../../../core/services/wand.service';
import { RouterLink } from '@angular/router';
import { Wizard } from '../../../core/models/wizard.interface';
import { AuthService } from '../../../core/services/auth.service';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WandDetailsButtonComponent } from '../../../shared/components/wand-details-button/wand-details-button.component';
import { InfiniteScrollComponent } from '../../../shared/components/infinite-scroll/infinite-scroll.component';
import { fallbackOnImgError } from '../../../functions/fallback-on-img-error.function';

@Component({
  selector: 'app-wand-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FilterComponent, WandDetailsButtonComponent, InfiniteScrollComponent],
  templateUrl: './wand-catalog.component.html',
  styleUrl: './wand-catalog.component.css',
})
export class WandCatalogComponent implements AfterViewChecked {
  wands: Wand[] = [];
  currentWizard: Wizard | null = null;
  isMobile = false;

  // Filter state
  filteredWands: Wand[] = [];
  showFilter = false;
  activeFilters: any = {};
  private shouldScrollToTop = false;

  // Pagination state
  page = 1;
  pageSize = 12;
  loading = false;
  allLoaded = false;

  onImgError = fallbackOnImgError;


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
        let newWands = (res.data || []).filter(wand => wand?.status == WandStatus.Available);

        this.wands = [...this.wands, ...newWands];
        const filteredNewWands = this.applyFilters(newWands, this.activeFilters);

        this.filteredWands = [...this.filteredWands, ...filteredNewWands];

        if (newWands.length < this.pageSize) this.allLoaded = true;

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

    this.activeFilters = filters;

    if (!hasFilters) {
      this.page = 1;
      this.allLoaded = false;
      this.filteredWands = [];
      this.wands = [];
      this.loadWands();
      this.shouldScrollToTop = true;
      this.showFilter = false;
      return;
    }

    this.filteredWands = this.applyFilters(this.wands, filters);
    this.fallbackBackendSearchIfEmpty(filters);
    this.shouldScrollToTop = true;
    this.showFilter = false;
  }

  private applyFilters(wands: Wand[], filters: any): Wand[] {
    return wands.filter((wand) => {
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
      if (filters.minLengthInches && wand.length_inches < filters.minLengthInches) {
        return false;
      }
      if (filters.maxLengthInches && wand.length_inches > filters.maxLengthInches) {
        return false;
      }
      return true;
    });
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
            return;
          },
          error: () => {
            this.filteredWands = [];
            this.loading = false;
            return;
          }
        });

      }
      if (filters.core) {
        this.wandService.findAllByCore(filters.core, this.page, this.pageSize).subscribe({
          next: (res) => {
            const newWands = res.data || [];
            this.filteredWands = newWands;
            if (newWands.length < this.pageSize) this.allLoaded = true;
            this.page++;
            this.loading = false;
            return;
          },
          error: () => {
            this.filteredWands = [];
            this.loading = false;
            return;
          }
        });
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

  ngAfterViewChecked() {
    if (this.shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.shouldScrollToTop = false;
    }
  }
}
