import { ApiResponse } from "./api-response.interface";
import { Wand } from "./wand.interface";
import { Wizard } from "./wizard.interface";

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Dispatched = 'dispatched',
  Delivered = 'delivered',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Refunded = 'refunded',
}

export enum PaymentProvider {
  Stripe = 'stripe',
  PayPal = 'paypal',
  WireTransfer = 'wire_transfer',
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  Default = 'default',
}

export interface Order {
  id: string;
  payment_reference: string;
  payment_provider: PaymentProvider;
  shipping_address: string;
  tracking_id: string;
  created_at: Date;
  status: OrderStatus;
  completed: boolean;
  review?: string;
  wizard: Wizard | string;
  wand: Wand | string;
}

export interface OrderRequest extends Partial<Order> { }

export interface OrderResponse<T = Order> extends ApiResponse<T> { }
