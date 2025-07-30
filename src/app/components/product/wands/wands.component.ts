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


@Component({
  selector: 'app-wands',
  standalone: true,
  imports: [CommonModule, RouterLink, FilterComponent],
  templateUrl: './wands.component.html',
  styleUrl: './wands.component.css',
})
export class WandsComponent {
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
      error: (err) => {
        // console.error('Error al obtener vehiculos:', err);
      },
    });
  }

  isWandAvailable(wand: Wand): boolean {
    return wand.status === WandStatus.Available;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onFilterChanged(filters: any): void {
    this.filteredWands = this.wands.filter((wand) => {
      // if (
      //   filters.category &&
      //   vehicle.categoria.nombreCategoria !== filters.category
      // ) {
      //   return false;
      // }

      // if (filters.brand && vehicle.marca.nombreMarca !== filters.brand) {
      //   return false;
      // }

      // if (filters.priceDesde && vehicle.precioVenta < filters.priceDesde) {
      //   return false;
      // }

      // if (filters.priceHasta && vehicle.precioVenta > filters.priceHasta) {
      //   return false;
      // }

      // if (
      //   filters.kilometersDesde &&
      //   vehicle.kilometros < filters.kilometersDesde
      // ) {
      //   return false;
      // }

      // if (
      //   filters.kilometersHasta &&
      //   vehicle.kilometros > filters.kilometersHasta
      // ) {
      //   return false;
      // }

      // if (filters.isRentable && vehicle.precioAlquilerDiario <= 0) {
      //   return false;
      // }

      // if (filters.isBuyable && vehicle.precioVenta <= 0) {
      //   return false;
      // }
      return true;
    });
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
