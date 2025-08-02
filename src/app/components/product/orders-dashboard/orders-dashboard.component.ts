import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service.js';
import { Order, OrderStatus } from '../../../core/models/order.interface.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { alertMethod } from '../../../functions/alert.function.js';
import { AlertType } from '../../../shared/components/alert/alert.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [ModalComponent, CommonModule, FormsModule],
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.css',
})
export class OrdersDashboardComponent implements OnInit {
  orders: Order[] = [];
  wizardId: string = '';
  selectedOrder: Order | null = null;
  reviewText: string = '';

  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    const wizard = this.authService.getCurrentWizard();
    this.wizardId = wizard ? wizard.id : '';
    console.log('Wizard ID:', this.wizardId);
    if (this.wizardId) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.orderService.findAllByWizard(this.wizardId).subscribe({
      next: (res) => this.orders = res.data || [],
    });
  }

  getWandName(order: Order): string {
    if (order.wand && typeof order.wand !== 'string') {
      return order.wand.name;
    }
    return '';
  }

  getWandTotalPrice(order: Order): number {
    if (order.wand && typeof order.wand !== 'string') {
      return order.wand.total_price;
    }
    return 0;
  }

  getWandImage(order: Order): string {
    if (order.wand && typeof order.wand !== 'string') {
      return order.wand.image;
    }
    return './public/default-wand.jpg';
  }

  onSelectedEntity(order: Order): void {
    this.selectedOrder = order;
    this.reviewText = order.review || '';
  }

  canCompleteOrder(order: Order): boolean {
    return order.status === OrderStatus.Delivered ? true : false;
  }

  completeOrder(order: Order): void {
    this.orderService.complete(order.id).subscribe({
      next: (res) => {
        alertMethod(res.message, 'Order marked as complete.', AlertType.Success);
        this.loadOrders();
      },
      error: (err) => alertMethod(err.error.message, 'Failed to mark order as complete.', AlertType.Error),
    });
  }

  canCancelOrder(order: Order): boolean {
    if (order.status === OrderStatus.Completed || order.status === OrderStatus.Refunded || order.status === OrderStatus.Pending || order.status === OrderStatus.Cancelled) {
      return false;
    }
    return true;
  }

  cancelOrder(order: Order): void {
    this.orderService.cancel(order.id).subscribe({
      next: (res) => {
        alertMethod(res.message, 'Order cancelled successfully.', AlertType.Success);
        this.loadOrders();
      },
      error: (err) => alertMethod(err.error.message, 'Failed to cancel the order.', AlertType.Error),
    });
  }

  canRefundOrder(order: Order): boolean {
    if (order.status !== OrderStatus.Cancelled && order.status !== OrderStatus.Completed) {
      return false;
    };
    return true;
  }

  refundOrder(order: Order): void {
    this.orderService.refund(order.id).subscribe({
      next: (res) => {
        alertMethod(res.message, 'Order refunded successfully.', AlertType.Success);
        this.loadOrders();
      },
      error: (err) => alertMethod(err.error.message, 'Failed to refund the order.', AlertType.Error),
    });
  }

  canReviewOrder(order: Order): boolean {
    if (!order.completed || order.review) {
      return false;
    };
    return true;
  }

  reviewOrder(): void {
    if (!this.selectedOrder) return;
    const reviewData = { review: this.reviewText.trim() };
    console.log('Selected Order:', this.selectedOrder);
    this.orderService.review(this.selectedOrder.id, reviewData).subscribe({
      next: (res) => {
        alertMethod(res.message, 'Order reviewed successfully.', AlertType.Success);
        this.loadOrders();
      },
      error: (err) => alertMethod(err.error.message, 'Failed to review the order.', AlertType.Error),
    });
  }
}
