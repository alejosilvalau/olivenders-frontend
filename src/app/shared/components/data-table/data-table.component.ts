import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';

export enum DataTableFormat {
  TitleCase = 'titlecase',
  Currency = 'currency',
  Date = 'date',
  Boolean = 'boolean'
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
    if (value === null || value === undefined) return '';
    switch (format) {
      case DataTableFormat.TitleCase:
        return this.titlecasePipe.transform(value);
      case DataTableFormat.Currency:
        return this.currencyPipe.transform(value);
      case DataTableFormat.Date:
        return this.datePipe.transform(value, 'medium');
      case DataTableFormat.Boolean:
        return value ? 'True' : 'False';
      default:
        return value;
    }
  }

  isImageUrl(value: string): boolean {
    return typeof value === 'string' && /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(value);
  }
}
