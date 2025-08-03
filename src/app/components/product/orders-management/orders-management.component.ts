import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderResponse } from '../../../core/models/order.interface';
import { Observable } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent, DataTableFormat } from '../../../shared/components/data-table/data-table.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';
import { WandService } from '../../../core/services/wand.service.js';
import { WizardService } from '../../../core/services/wizard.service.js';
@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, ModalComponent],
  templateUrl: './orders-management.component.html',
  styleUrls: ['../../../shared/styles/management.style.css', '../../../shared/styles/forms.style.css']
})

export class OrdersManagementComponent implements OnInit {
  orderForm: FormGroup = new FormGroup({});
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  DataTableFormat = DataTableFormat;

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
  }

  findAllOrders(): void {
    this.orderService.findAll().subscribe((orderResponse: OrderResponse<Order[]>) => {
      this.orders = orderResponse.data!;
      this.filteredOrders = orderResponse.data!;
    });
  }

  private searchOrder(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      this.filteredOrders = [];
      return;
    }

    const isObjectId = /^[a-f\d]{24}$/i.test(trimmedTerm);
    let search$;

    if (isObjectId) {
      search$ = this.orderService.findOne(trimmedTerm);
    } else {
      this.wandService.findOneByName(trimmedTerm).subscribe({
        next: (wandResponse) => {
          if (wandResponse.data) {
            search$ = this.orderService.findAllByWand(wandResponse.data.id);
          } else {
            this.wizardService.findOneByUsername(trimmedTerm).subscribe({
              next: (wizardResponse) => {
                if (wizardResponse.data) {
                  search$ = this.orderService.findAllByWizard(wizardResponse.data!.id);
                }
                else {
                  this.alertComponent.showAlert('No order found with this search.', AlertType.Info);
                  this.filteredOrders = [];
                  return;
                }
              }, error: (err) => {
                this.alertComponent.showAlert(err.error.message, AlertType.Error);
                this.filteredOrders = [];
                return;
              }
            });
          }
        }, error: (err) => {
          this.alertComponent.showAlert(err.error.message, AlertType.Error);
          this.filteredOrders = [];
          return;
        }
      });
    }


    search$!.subscribe({
      next: res => {
        this.filteredOrders = res.data ? [res.data] : [];
      },
      error: err => {
        this.filteredOrders = [];
        this.alertComponent.showAlert(err.error.message, AlertType.Error);
      }
    });
  }

  onSearch(filteredOrders: Order[]): void {
    if (filteredOrders.length > 0) {
      this.filteredOrders = filteredOrders;
      return;
    }
    this.searchOrder(this.searchTerm);
  }

  editOrder(): void {
    if (this.selectedOrder
      && typeof this.selectedOrder?.wand === 'object'
      && typeof this.selectedOrder.wizard === 'object'
    ) {
      const wandId = this.selectedOrder?.wand?.id;
      const wizardId = this.selectedOrder?.wizard?.id;
      const orderData = { ...this.orderForm.value, wand: wandId, wizard: wizardId };
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
