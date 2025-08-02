import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service.js';
import { Order } from '../../../core/models/order.interface.js';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrl: './order-dashboard.component.css',
})
export class OrderDashboardComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  reviewText: string = '';

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.findAll().subscribe({
      next: (res) => this.orders = res.data || [],
      error: (err) => console.error('Error loading orders:', err),
    });
  }

  canReview(order: Order): boolean {
    return order.status === 'delivered' && !order.reviewed;
  }

  canComplete(order: Order): boolean {
    return order.status === 'dispatched';
  }

  canCancel(order: Order): boolean {
    return order.status === 'pending' || order.status === 'dispatched';
  }

  canRefund(order: Order): boolean {
    return order.status === 'completed' && !order.refunded;
  }

  openReviewModal(order: Order): void {
    this.selectedOrder = order;
    this.reviewText = '';
    // Open modal logic here
  }

  submitReview(): void {
    if (!this.selectedOrder) return;
    this.orderService.review(this.selectedOrder._id, { review: this.reviewText }).subscribe({
      next: () => {
        this.selectedOrder = null;
        this.loadOrders();
      },
      error: (err) => console.error('Error submitting review:', err),
    });
  }

  markComplete(order: Order): void {
    this.orderService.complete(order._id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error marking complete:', err),
    });
  }

  cancelOrder(order: Order): void {
    this.orderService.cancel(order._id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error cancelling order:', err),
    });
  }

  refundOrder(order: Order): void {
    this.orderService.refund(order._id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error refunding order:', err),
    });
  }
}
