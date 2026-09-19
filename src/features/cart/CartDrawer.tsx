import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setDrawerOpen,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from './cartSlice';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface CartDrawerProps {
  onNavigateToCartTab: () => void;
  onNavigateToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCartTab,
  onNavigateToCheckout,
}) => {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, subtotal, discountAmount, shippingFee, totalAmount, isDrawerOpen } =
    useAppSelector((state) => state.cart);

  if (!isDrawerOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleClose = () => {
    dispatch(setDrawerOpen(false));
  };

  const handleGoToCart = () => {
    dispatch(setDrawerOpen(false));
    onNavigateToCartTab();
  };

  const handleGoToCheckout = () => {
    dispatch(setDrawerOpen(false));
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    } else {
      onNavigateToCartTab();
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={handleClose}>
      <div className="cart-drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Giỏ hàng của bạn</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {totalQuantity} sản phẩm trong giỏ
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-icon btn-secondary"
            onClick={handleClose}
            title="Đóng giỏ hàng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon-wrap">
                <ShoppingBag size={48} />
              </div>
              <h4>Giỏ hàng của bạn đang trống</h4>
              <p>Hãy khám phá các sản phẩm công nghệ tuyệt vời và thêm vào giỏ ngay!</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClose}
                style={{ marginTop: '16px' }}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((item) => (
                <div key={item.productId} className="cart-drawer-item">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="cart-drawer-item-img"
                  />
                  <div className="cart-drawer-item-info">
                    <div className="cart-drawer-item-title">{item.product.name}</div>
                    <div className="cart-drawer-item-sku">{item.product.sku}</div>
                    <div className="cart-drawer-item-price">
                      {formatCurrency(item.unitPrice)}
                    </div>

                    <div className="cart-drawer-item-controls">
                      {/* Quantity Controls */}
                      <div className="qty-control-group">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => dispatch(decrementQuantity(item.productId))}
                          title="Giảm số lượng"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          disabled={item.quantity >= item.product.stockQuantity}
                          onClick={() => dispatch(incrementQuantity(item.productId))}
                          title="Tăng số lượng"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-icon-del"
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {item.quantity >= item.product.stockQuantity && (
                      <div className="max-stock-hint">
                        <AlertCircle size={11} /> Tối đa tồn kho ({item.product.stockQuantity})
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-line">
              <span>Tạm tính:</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-line" style={{ color: 'var(--accent-rose)' }}>
                <span>Giảm giá (Coupon):</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>Phí vận chuyển:</span>
              <span style={{ color: shippingFee === 0 ? 'var(--accent-emerald)' : 'var(--text-main)', fontWeight: 600 }}>
                {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
              </span>
            </div>

            <div className="cart-summary-total">
              <span>Tổng cộng:</span>
              <span style={{ color: '#38bdf8' }}>{formatCurrency(totalAmount)}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                onClick={handleGoToCheckout}
              >
                Tiến hành Đặt hàng <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={handleGoToCart}
                >
                  Xem chi tiết giỏ
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }}
                  onClick={() => dispatch(clearCart())}
                  title="Xóa tất cả sản phẩm trong giỏ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <ShieldCheck size={14} color="var(--accent-emerald)" /> Thanh toán an toàn & bảo mật
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
