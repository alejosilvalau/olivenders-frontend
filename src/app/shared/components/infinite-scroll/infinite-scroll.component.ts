import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  standalone: true,
  template: ``,
})
export class InfiniteScrollComponent {
  @Input() threshold: number = 300; // px from bottom to trigger
  @Input() disabled: boolean = false;
  @Output() scrolled = new EventEmitter<void>();

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    if (this.disabled) return;
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.scrollHeight - this.threshold;
    if (scrollPosition >= bottomPosition) {
      this.scrolled.emit();
    }
  }
}
