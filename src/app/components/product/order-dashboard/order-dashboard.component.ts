import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../core/services/order.service.js';
import { Order, OrderStatus } from '../../../core/models/order.interface.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { alertMethod } from '../../../functions/alert.function.js';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Wand } from '../../../core/models/wand.interface.js';
import { Core } from '../../../core/models/core.interface.js';
import { InfiniteScrollComponent } from '../../../shared/components/infinite-scroll/infinite-scroll.component.js';

@Component({
  selector: 'app-order-dashboard',
  standalone: true,
  imports: [ModalComponent, CommonModule, FormsModule, AlertComponent, InfiniteScrollComponent],
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.css', './../../../shared/styles/forms.style.css']
})
export class OrderDashboardComponent implements OnInit {
  orders: Order[] = [];
  wizardId: string = '';
  selectedOrder: Order | null = null;
  reviewText: string = '';

  // Pagination state
  page = 1;
  pageSize = 5;
  loading = false;
  allLoaded = false;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    const wizard = this.authService.getCurrentWizard();
    this.wizardId = wizard ? wizard.id : '';
    if (this.wizardId) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    if (this.allLoaded || this.loading) return;
    this.loading = true;
    this.orderService.findAllByWizard(this.wizardId, this.page, this.pageSize).subscribe({
      next: (res) => {
        const newOrders = res.data || [];
        if (newOrders.length < this.pageSize) this.allLoaded = true;
        this.orders = [...this.orders, ...newOrders];
        this.page++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  statusColor(status: string): string {
    switch (status) {
      case OrderStatus.Pending: return '#f7c948';
      case OrderStatus.Paid: return '#36b37e';
      case OrderStatus.Dispatched: return '#00b8d9';
      case OrderStatus.Delivered: return '#0052cc';
      case OrderStatus.Completed: return '#01bc2cff';
      case OrderStatus.Cancelled: return '#e74c3c';
      case OrderStatus.Refunded: return '#8e44ad';
      default: return '#cccccc';
    }
  }

  onScrollLoadMore() {
    this.loadOrders();
  }

  resetOrders(): void {
    this.orders = [];
    this.page = 1;
    this.allLoaded = false;
    this.loadOrders();
  }

  getWandFromOrder(order: Order): Wand | null {
    if (typeof order.wand !== 'string') {
      return order.wand;
    }
    return null;
  }

  getWoodFromOrder(order: Order): Core | null {
    if (typeof order.wand !== 'string') {
      if (typeof order.wand.wood !== 'string') {
        return order.wand.wood;
      }
    }
    return null;
  }

  getCoreFromOrder(order: Order): Core | null {
    if (typeof order.wand !== 'string') {
      if (typeof order.wand.core !== 'string') {
        return order.wand.core;
      }
    }
    return null;
  }

  onSelectedEntity(order: Order): void {
    this.selectedOrder = order;
    this.reviewText = order.review || '';
  }

  canComplete(order: Order): boolean {
    return order.status === OrderStatus.Delivered ? true : false;
  }

  complete(order: Order): void {
    this.orderService.complete(order.id).subscribe({
      next: (res) => {
        this.alertComponent.showAlert(res.message, AlertType.Success);
        this.resetOrders();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => this.alertComponent.showAlert(err.error.message, AlertType.Error),
    });
  }

  canCancel(order: Order): boolean {
    if (order.status === OrderStatus.Completed || order.status === OrderStatus.Refunded || order.status === OrderStatus.Pending || order.status === OrderStatus.Cancelled) {
      return false;
    }
    return true;
  }

  cancel(order: Order): void {
    this.orderService.cancel(order.id).subscribe({
      next: (res) => {
        this.alertComponent.showAlert(res.message, AlertType.Success);
        this.resetOrders();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => this.alertComponent.showAlert(err.error.message, AlertType.Error),
    });
  }

  canRefund(order: Order): boolean {
    if (order.status !== OrderStatus.Cancelled && order.status !== OrderStatus.Completed) {
      return false;
    };
    return true;
  }

  refund(order: Order): void {
    this.orderService.refund(order.id).subscribe({
      next: (res) => {
        this.alertComponent.showAlert(res.message, AlertType.Success);
        this.resetOrders();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => this.alertComponent.showAlert(err.error.message, AlertType.Error),
    });
  }

  canReview(order: Order): boolean {
    if (!order.completed || order.review) {
      return false;
    };
    return true;
  }

  review(): void {
    if (!this.selectedOrder) return;
    const reviewData = { review: this.reviewText.trim() };
    this.orderService.review(this.selectedOrder.id, reviewData).subscribe({
      next: (res) => {
        this.alertComponent.showAlert(res.message, AlertType.Success);
        this.resetOrders();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => this.alertComponent.showAlert(err.error.message, AlertType.Error),
    });
  }
}
