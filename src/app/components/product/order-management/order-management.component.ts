import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderResponse, OrderStatus } from '../../../core/models/order.interface';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent, DataTableFormat } from '../../../shared/components/data-table/data-table.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { WandService } from '../../../core/services/wand.service.js';
import { WizardService } from '../../../core/services/wizard.service.js';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component.js';
import { switchMap, throwError } from 'rxjs';
import { chainedEntitySearch } from '../../../functions/chained-entity-search.function.js';
@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, ModalComponent, PaginationComponent],
  templateUrl: './order-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css']
})

export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];

  // Form properties
  orderForm: FormGroup = new FormGroup({});
  selectedOrder: Order | null = null;

  // Search properties
  filteredOrders: Order[] = [];
  searchTerm: string = '';

  // Pagination properties
  totalOrders = 0;
  currentPage = 1;
  pageSize = 10;

  DataTableFormat = DataTableFormat;

  editOrderModalConfig = {
    id: 'editOrder',
    title: 'Edit Order',
    submitButtonText: 'Save Changes',
    cancelButtonText: 'Cancel'
  };

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private wandService: WandService,
    private wizardService: WizardService
  ) {
    this.orderForm = this.fb.group({
      payment_reference: ['', Validators.required],
      payment_provider: ['', Validators.required],
      shipping_address: ['', Validators.required],
      wizard: ['', Validators.required],
      wand: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.findAllOrders();
  }

  onOrderSelected(order: Order): void {
    this.selectedOrder = order;
    if (order) {
      this.orderForm.patchValue({ ...order });
    }
    this.updateEditOrderModalConfig();
  }

  findAllOrders(): void {
    this.orderService.findAll(this.currentPage, this.pageSize).subscribe((orderResponse: OrderResponse<Order[]>) => {
      this.orders = orderResponse.data!;
      this.filteredOrders = orderResponse.data!;
      this.totalOrders = orderResponse.total || 0;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.findAllOrders();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.findAllOrders();
  }

  private searchOrder(term: string): void {
    const searchChain = [
      (t: string) => this.wandService.findOneByName(t).pipe(
        switchMap(wandRes => wandRes.data
          ? this.orderService.findAllByWand(wandRes.data.id)
          : throwError(() => null)
        )
      ),
      (t: string) => this.wizardService.findOneByUsername(t).pipe(
        switchMap(wizardRes => wizardRes.data
          ? this.orderService.findAllByWizard(wizardRes.data.id)
          : throwError(() => null)
        )
      ),
      (t: string) => this.wandService.findOne(t)
    ];

    const notFoundMessage = 'No order found with this search';
    chainedEntitySearch(
      term,
      searchChain,
      (results: Order[]) => this.filteredOrders = results,
      this.alertComponent,
      notFoundMessage
    );
  }

  onSearch(filteredOrders: Order[]): void {
    if (filteredOrders.length > 0) {
      this.filteredOrders = filteredOrders;
      return;
    }
    this.searchOrder(this.searchTerm);
  }

  updateEditOrderModalConfig() {
    this.editOrderModalConfig.submitButtonText = this.isOrderDispatched(this.selectedOrder!)
      ? 'Return'
      : 'Save Changes';
  }

  editOrder(): void {
    if (this.isOrderDispatched(this.selectedOrder!)) {
      return;
    }
    if (this.selectedOrder
      && typeof this.selectedOrder?.wand === 'object'
      && typeof this.selectedOrder.wizard === 'object'
    ) {
      const wandId = this.selectedOrder?.wand?.id;
      const wizardId = this.selectedOrder?.wizard?.id;
      const orderData = { ...this.orderForm.value, wand: wandId, wizard: wizardId };
      console.log(orderData);
      this.orderService.update(this.selectedOrder.id, orderData).subscribe({
        next: (response: OrderResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllOrders();
          this.orderForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.orderForm.reset();
        }
      });
    }
  }

  dispatchOrder(): void {
    if (this.selectedOrder) {
      this.orderService.dispatch(this.selectedOrder.id).subscribe({
        next: (response: OrderResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllOrders();
          this.orderForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.orderForm.reset();
        }
      });
    }
  }

  isOrderDispatched(order: Order): boolean {
    if (order.status == OrderStatus.Pending || order.status == OrderStatus.Paid) {
      return false;
    }
    return true;
  }

  removeOrder(): void {
    if (this.selectedOrder) {
      this.orderService.remove(this.selectedOrder.id).subscribe({
        next: (response: OrderResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllOrders();
          this.orderForm.reset();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.orderForm.reset();
        }
      });
    }
  }
}
