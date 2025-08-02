import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { WandService } from '../../../core/services/wand.service';
import { Wand } from '../../../core/models/wand.interface';
import { AuthService } from '../../../core/services/auth.service';
import { Wizard } from '../../../core/models/wizard.interface';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderRequest, PaymentProvider } from '../../../core/models/order.interface';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { alertMethod } from '../../../functions/alert.function';
import { AlertType } from '../../../shared/components/alert/alert.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, ModalComponent],
  templateUrl: 'place-order.component.html',
  styleUrl: './place-order.component.css',
})

export class PlaceOrderComponent implements OnInit {
  placeOrderForm: FormGroup = new FormGroup({});
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  order: Order | null = null;
  wizard: Wizard | null = null;
  wand: Wand | null = null;
  wandId: string = '';
  currentSlideIndex = 0;
  lightboxActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private wandService: WandService,
    private authService: AuthService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.placeOrderForm = this.fb.group({
      payment_reference: ['', Validators.required],
      payment_provider: [PaymentProvider.Default, Validators.required],
      shipping_address: ['', Validators.required],
      wizard: ['', Validators.required],
      wand: ['', Validators.required],
    });
  }

  get wandCoreName() {
    if (this.wand != null && this.wand.core && typeof this.wand.core !== 'string') {
      return this.wand.core.name;
    }
    return '';
  }

  get wandWoodName() {
    if (this.wand != null && this.wand.wood && typeof this.wand.wood !== 'string') {
      return this.wand.wood.name;
    }
    return '';
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.wand = navigation?.extras?.state?.['wand'] || null;

    if (!this.wand) {
      const wandId = this.route.snapshot.paramMap.get('wandId');
      if (wandId) {
        this.wandService.findOne(wandId).subscribe(response => {
          this.wand = response.data as Wand;
          this.placeOrderForm.patchValue({
            wand: this.wand.id,
            wizard: this.authService.getCurrentWizard()!.id
          });
        });
      }
    }
    this.wizard = this.authService.getCurrentWizard();

    this.placeOrderForm.get('payment_provider')?.valueChanges.subscribe((provider) => {
      const reference = this.generatePaymentReference(provider);
      this.placeOrderForm.patchValue({
        payment_reference: reference
      });
    });
  }

  generatePaymentReference(provider: string): string {
    console.log(this.placeOrderForm.value);
    switch (provider) {
      case 'stripe':
        return 'STR-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      case 'paypal':
        return 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      case 'wire_transfer':
        return 'WIRE-' + Math.floor(100000 + Math.random() * 900000);
      case 'credit_card':
        return 'CC-' + Math.floor(100000 + Math.random() * 900000);
      case 'debit_card':
        return 'DC-' + Math.floor(100000 + Math.random() * 900000);
      default:
        return '';
    }
  }

  placeOrder(): void {
    if (this.wand !== null && this.wizard !== null) {
      const orderData: OrderRequest = { ...this.placeOrderForm.value }
      this.orderService.add(orderData).subscribe({
        next: (orderRes) => {
          alertMethod(orderRes.message, 'Order placed successfully!', AlertType.Success);
          this.router.navigate(['/']);
        },
        error: (err) => {
          alertMethod(err.error.message, 'Error placing the order, please try again', AlertType.Error);
        }
      });
    }
  }
}
