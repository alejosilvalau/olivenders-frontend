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
  wizard: string;
  wand: string;
}
