import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements AfterViewChecked {

  @Input() totalRecords: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  private shouldScrollToTop = false;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  selectPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
    this.shouldScrollToTop = true;
  }

  onPageSizeChange(event: any) {
    this.pageSizeChange.emit(Number(this.pageSize));
    this.shouldScrollToTop = true;
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.shouldScrollToTop = false;
    }
  }

}
