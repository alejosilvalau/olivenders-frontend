import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';

export enum DataTableFormat {
  TitleCase = 'titlecase',
  Currency = 'currency',
  Date = 'date',
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  providers: [TitleCasePipe, CurrencyPipe, DatePipe],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent<T extends Record<string, any>> {
  @Input() columns: { key: string, label: string, isArray?: boolean, subKey?: string, format?: DataTableFormat }[] = [];
  @Input() data: T[] = [];
  @Input() emptyMessage: string = 'No data available.';
  @Input() editModalTarget: string = '';
  @Input() removeModalTarget: string = '';
  @Output() selectedEntity = new EventEmitter<T>();



  constructor(
    private titlecasePipe: TitleCasePipe,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) { }

  onSelectEntity(entity: T) {
    this.selectedEntity.emit(entity);
  }

  formatValue(value: any, format?: string): any {
    if (!value) return '';
    switch (format) {
      case 'titlecase':
        return this.titlecasePipe.transform(value);
      case 'currency':
        return this.currencyPipe.transform(value);
      case 'date':
        return this.datePipe.transform(value, 'medium');
      default:
        return value;
    }
  }
}
