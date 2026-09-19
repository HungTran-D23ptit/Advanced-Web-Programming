import { Product } from '../../types/order-management.types';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
}

export interface Coupon {
  code: string;
  discountPercent: number; // e.g. 10 for 10%
  description: string;
  minOrderAmount?: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  isDrawerOpen: boolean;
  lastActionMessage: string | null;
}

export interface AddToCartPayload {
  product: Product;
  quantity?: number;
}

export interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}
