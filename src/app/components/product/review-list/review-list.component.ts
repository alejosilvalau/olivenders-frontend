import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { WandService } from '../../../core/services/wand.service';
import { Order } from '../../../core/models/order.interface';
import { Wand } from '../../../core/models/wand.interface';
import { WandDetailsButtonComponent } from '../../../shared/components/wand-details-button/wand-details-button';
import { CommonModule } from '@angular/common';

interface OrderReview extends Order {
  rating: number;
}
@Component({
  selector: 'app-review-list',
  standalone: true,
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  imports: [CommonModule, WandDetailsButtonComponent]
})
export class ReviewListComponent implements OnInit {
  ordersWithReviews: OrderReview[] = [];

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

  loadReviews(): void {
    this.orderService.findAll().subscribe((res: any) => {
      this.ordersWithReviews = (res.data || []).filter((order: Order) => !!order.review).map((order: Order) => ({
        ...order,
        rating: this.getRandomRating()
      }));;
    });
  }

  getRandomRating(): number {
    return Math.floor(Math.random() * 2) + 4; // 4 or 5
  }
}
