import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { WandService } from '../../../core/services/wand.service';
import { Order } from '../../../core/models/order.interface';
import { Wand } from '../../../core/models/wand.interface';
import { WandDetailsButtonComponent } from '../../../shared/components/wand-details-button/wand-details-button.component';
import { CommonModule } from '@angular/common';
import { InfiniteScrollComponent } from '../../../shared/components/infinite-scroll/infinite-scroll.component.js';
import { fallbackOnImgError } from '../../../functions/fallback-on-img-error.function.js';

interface OrderReview extends Order {
  rating: number;
}
@Component({
  selector: 'app-review-list',
  standalone: true,
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  imports: [CommonModule, WandDetailsButtonComponent, InfiniteScrollComponent]
})
export class ReviewListComponent implements OnInit {
  ordersWithReviews: OrderReview[] = [];
  onImgError = fallbackOnImgError;

  // Pagination state
  page = 1;
  pageSize = 5;
  loading = false;
  allLoaded = false;

  ngOnInit(): void {
    this.loadReviews();
  }

  constructor(private orderService: OrderService, private wandService: WandService) { }

  getWand(order: Order): Wand | null {
    if (order.wand && typeof order.wand === 'object') {
      return order.wand;
    }
    return null;
  }

  getReviewImage(order: Order): string {
    if (order.wand && typeof order.wand === 'object') {
      return order.wand.image;
    }
    return './default-wand.jpg';
  }

  getOrderDate(order: Order): string {
    return new Date(order.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  gerOrderUser(order: Order): string {
    if (typeof order.wizard == 'object') {
      return `${ order.wizard.name } ${ order.wizard.last_name }`;
    }
    return 'Unknown User';
  }

  loadReviews(): void {
    if (this.allLoaded || this.loading) return;
    this.loading = true;
    this.orderService.findAll(this.page, this.pageSize).subscribe({
      next: (res) => {
        const allOrders = res.data || [];
        const newOrders = allOrders
          .filter((order: Order) => !!order.review)
          .map((order: Order) => ({
            ...order,
            rating: this.getRandomRating()
          }));
        if (allOrders.length < this.pageSize) this.allLoaded = true;
        this.ordersWithReviews = [...this.ordersWithReviews, ...newOrders];
        this.page++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getRandomRating(): number {
    return Math.floor(Math.random() * 2) + 4; // 4 or 5
  }

  onScrollLoadMore() {
    this.loadReviews();
  }
}
