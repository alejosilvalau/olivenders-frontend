import { Component, Output, EventEmitter, Input, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  standalone: true,
  template: ``,
})
export class InfiniteScrollComponent implements OnInit {
  @Input() threshold: number = 300; // px from bottom to trigger
  @Input() disabled: boolean = false;
  @Output() scrolled = new EventEmitter<void>();

  ngOnInit(): void {
    if (window.innerWidth < 769) {
      this.threshold = 900;
    } else if (window.innerWidth < 1025) {
      this.threshold = 600;
    } else {
      this.threshold = 300;
    }
  }

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
