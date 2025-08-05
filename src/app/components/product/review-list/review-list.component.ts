import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { WandService } from '../../../core/services/wand.service';
import { Order } from '../../../core/models/order.interface';
import { Wand } from '../../../core/models/wand.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-list',
  standalone: true,
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  imports: [CommonModule]
})
export class ReviewListComponent implements OnInit {
  ordersWithReviews: Order[] = [];

  ngOnInit(): void {
    this.loadReviews();
  }

  constructor(private orderService: OrderService, private wandService: WandService) { }

  getReviewImage(order: Order): string {
    if (order.wand && typeof order.wand === 'object') {
      return order.wand.image;
    }
    return './default-wand.jpg';
  }

  loadReviews(): void {
    this.orderService.findAll().subscribe((res: any) => {
      // Filter orders with reviews
      this.ordersWithReviews = (res.data || []).filter((order: Order) => !!order.review);
    });
  }

  getRandomRating(): number {
    return Math.floor(Math.random() * 5) + 1;
  }

  // ...existing code...
  showWandInfo(order: Order): void {
    if (order.wand && typeof order.wand === 'object') {
      // You can use a modal or alert, similar to wand-catalog
      alert(`Wand Info:\nName: ${ order.wand.name }\nDescription: ${ order.wand.description }`);
    }
  }
  // ...existing code...
}
