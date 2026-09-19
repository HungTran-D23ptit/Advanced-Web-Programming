import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/order-management.types';
import {
  CartState,
  CartItem,
  AddToCartPayload,
  UpdateQuantityPayload,
  Coupon,
} from './cartTypes';

export const AVAILABLE_COUPONS: Record<string, Coupon> = {
  PTIT10: {
    code: 'PTIT10',
    discountPercent: 10,
    description: 'Giảm 10% cho sinh viên & giảng viên PTIT',
  },
  VIP20: {
    code: 'VIP20',
    discountPercent: 20,
    description: 'Giảm 20% cho khách hàng VIP thân thiết',
  },
  TECH5: {
    code: 'TECH5',
    discountPercent: 5,
    description: 'Giảm 5% ưu đãi công nghệ hè 2026',
  },
};

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
  appliedCoupon: null,
  discountAmount: 0,
  shippingFee: 0,
  totalAmount: 0,
  isDrawerOpen: false,
  lastActionMessage: null,
};

/**
 * Helper function tính toán lại các chỉ số tài chính của giỏ hàng
 */
const recalculateCartTotals = (state: CartState) => {
  // 1. Tổng số lượng sản phẩm trong giỏ
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // 2. Tạm tính tiền hàng (Subtotal)
  state.subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0);

  // 3. Tính tiền giảm giá từ Coupon
  if (state.appliedCoupon && state.subtotal > 0) {
    state.discountAmount = Math.round((state.subtotal * state.appliedCoupon.discountPercent) / 100);
  } else {
    state.discountAmount = 0;
  }

  // 4. Tính phí vận chuyển (Miễn phí nếu tổng tiền > 30tr hoặc giỏ trống)
  if (state.subtotal === 0) {
    state.shippingFee = 0;
  } else if (state.subtotal >= 30000000) {
    state.shippingFee = 0; // Miễn phí vận chuyển
  } else {
    state.shippingFee = 40000;
  }

  // 5. Tổng thanh toán cuối cùng
  state.totalAmount = Math.max(0, state.subtotal + state.shippingFee - state.discountAmount);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Thêm sản phẩm vào giỏ hàng (Hỗ trợ cả truyền Product trực tiếp hoặc AddToCartPayload)
     */
    addToCart: (state, action: PayloadAction<AddToCartPayload | Product>) => {
      let product: Product;
      let quantity = 1;

      if ('product' in action.payload) {
        product = action.payload.product;
        quantity = action.payload.quantity ?? 1;
      } else {
        product = action.payload;
      }

      if (product.stockQuantity <= 0) {
        state.lastActionMessage = `Sản phẩm "${product.name}" hiện đã hết hàng!`;
        return;
      }

      const existingIndex = state.items.findIndex((item) => item.productId === product.id);

      if (existingIndex >= 0) {
        const currentItem = state.items[existingIndex];
        const newQty = Math.min(currentItem.quantity + quantity, product.stockQuantity);
        
        currentItem.quantity = newQty;
        currentItem.totalPrice = newQty * currentItem.unitPrice;
        state.lastActionMessage = `Đã cập nhật số lượng "${product.name}" trong giỏ (${newQty} cái)`;
      } else {
        const addedQty = Math.min(quantity, product.stockQuantity);
        const newItem: CartItem = {
          id: `CART-${product.id}`,
          productId: product.id,
          product,
          quantity: addedQty,
          unitPrice: product.price,
          discountAmount: 0,
          totalPrice: addedQty * product.price,
        };
        state.items.push(newItem);
        state.lastActionMessage = `Đã thêm "${product.name}" vào giỏ hàng thành công!`;
      }

      recalculateCartTotals(state);
    },

    /**
     * Xóa một sản phẩm khỏi giỏ hàng
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const targetItem = state.items.find((item) => item.productId === productId);
      if (targetItem) {
        state.items = state.items.filter((item) => item.productId !== productId);
        state.lastActionMessage = `Đã xóa "${targetItem.product.name}" khỏi giỏ hàng!`;
        recalculateCartTotals(state);
      }
    },

    /**
     * Cập nhật số lượng của một sản phẩm
     */
    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);

      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
        state.lastActionMessage = `Đã xóa "${item.product.name}" khỏi giỏ hàng!`;
      } else {
        const clampedQty = Math.min(quantity, item.product.stockQuantity);
        item.quantity = clampedQty;
        item.totalPrice = clampedQty * item.unitPrice;
        state.lastActionMessage = `Đã cập nhật số lượng của "${item.product.name}" thành ${clampedQty}!`;
      }

      recalculateCartTotals(state);
    },

    /**
     * Tăng số lượng sản phẩm lên 1 đơn vị
     */
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item && item.quantity < item.product.stockQuantity) {
        item.quantity += 1;
        item.totalPrice = item.quantity * item.unitPrice;
        recalculateCartTotals(state);
      }
    },

    /**
     * Giảm số lượng sản phẩm đi 1 đơn vị
     */
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.totalPrice = item.quantity * item.unitPrice;
        } else {
          state.items = state.items.filter((i) => i.productId !== productId);
        }
        recalculateCartTotals(state);
      }
    },

    /**
     * Xóa toàn bộ giỏ hàng
     */
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.lastActionMessage = 'Đã xóa toàn bộ giỏ hàng!';
      recalculateCartTotals(state);
    },

    /**
     * Áp dụng mã giảm giá Coupon
     */
    applyCoupon: (state, action: PayloadAction<string>) => {
      const upperCode = action.payload.trim().toUpperCase();
      const coupon = AVAILABLE_COUPONS[upperCode];

      if (coupon) {
        state.appliedCoupon = coupon;
        state.lastActionMessage = `Áp dụng thành công mã giảm giá ${coupon.code} (-${coupon.discountPercent}%)`;
      } else {
        state.lastActionMessage = `Mã giảm giá "${action.payload}" không hợp lệ hoặc đã hết hạn!`;
      }

      recalculateCartTotals(state);
    },

    /**
     * Hủy mã giảm giá đã áp dụng
     */
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.lastActionMessage = 'Đã hủy mã giảm giá!';
      recalculateCartTotals(state);
    },

    /**
     * Điều khiển đóng/mở Drawer giỏ hàng nhanh
     */
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },

    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    clearActionMessage: (state) => {
      state.lastActionMessage = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setDrawerOpen,
  toggleDrawer,
  clearActionMessage,
} = cartSlice.actions;

export default cartSlice.reducer;
