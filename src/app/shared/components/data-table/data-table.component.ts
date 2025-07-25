import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent<T extends Record<string, any>> {
  @Input() columns: { key: string, label: string }[] = [];
  @Input() data: T[] = [];
  @Input() emptyMessage: string = 'No data available.';
  @Input() editModalTarget: string = '';
  @Input() removeModalTarget: string = '';
  // @Output() edit = new EventEmitter<T>();
  // @Output() remove = new EventEmitter<T>();
}
