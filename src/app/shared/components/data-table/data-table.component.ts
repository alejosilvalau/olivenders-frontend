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
  @Input() columns: { key: string, label: string, isArray?: boolean }[] = [];
  @Input() data: T[] = [];
  @Input() emptyMessage: string = 'No data available.';
  @Input() editModalTarget: string = '';
  @Input() removeModalTarget: string = '';
  @Output() selectedEntity = new EventEmitter<T>();

  onSelectEntity(entity: T) {
    this.selectedEntity.emit(entity);
  }
}
