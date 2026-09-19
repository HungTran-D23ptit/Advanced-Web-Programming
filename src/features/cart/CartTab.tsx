import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  AVAILABLE_COUPONS,
} from './cartSlice';
import {
  Customer,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../../types/order-management.types';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  CheckCircle,
  XCircle,
  ArrowRight,
  CreditCard,
  User,
  Sparkles,
  Layers,
  AlertTriangle,
} from 'lucide-react';

interface CartTabProps {
  customers: Customer[];
  onOrderCreated: (newOrder: Order) => void;
  onNavigateToProducts: () => void;
  onNavigateToOrders: () => void;
}

export const CartTab: React.FC<CartTabProps> = ({
  customers,
  onOrderCreated,
  onNavigateToProducts,
  onNavigateToOrders,
}) => {
  const dispatch = useAppDispatch();
  const {
    items,
    totalQuantity,
    subtotal,
    appliedCoupon,
    discountAmount,
    shippingFee,
    totalAmount,
    lastActionMessage,
  } = useAppSelector((state) => state.cart);

  const [couponInput, setCouponInput] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
  const [note, setNote] = useState('Giao hàng tiêu chuẩn');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState('');

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      dispatch(applyCoupon(couponInput));
      setCouponInput('');
    }
  };

  const handleApplyPredefinedCoupon = (code: string) => {
    dispatch(applyCoupon(code));
  };

  const handleDirectQuantityChange = (productId: string, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      dispatch(updateQuantity({ productId, quantity: num }));
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !currentCustomer) return;

    const newOrderCode = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order<{ channel: string; couponUsed: string | null }> = {
      id: `ORD-${Date.now()}`,
      orderCode: newOrderCode,
      customerId: currentCustomer.id,
      customerSnapshot: {
        id: currentCustomer.id,
        name: currentCustomer.name,
        email: currentCustomer.email,
        phone: currentCustomer.phone,
      },
      shippingAddress: currentCustomer.address,
      items: items.map((item, idx) => ({
        id: `ITEM-${Date.now()}-${idx}`,
        productId: item.productId,
        productSnapshot: {
          id: item.product.id,
          sku: item.product.sku,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
        },
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discountAmount: appliedCoupon
          ? Math.round((item.totalPrice * appliedCoupon.discountPercent) / 100)
          : 0,
        totalPrice: appliedCoupon
          ? item.totalPrice - Math.round((item.totalPrice * appliedCoupon.discountPercent) / 100)
          : item.totalPrice,
      })),
      status: OrderStatus.PENDING,
      paymentMethod,
      paymentStatus: PaymentStatus.UNPAID,
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      note,
      metadata: {
        channel: 'Online Store Checkout',
        couponUsed: appliedCoupon ? appliedCoupon.code : null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onOrderCreated(newOrder);
    dispatch(clearCart());
    setCreatedOrderCode(newOrderCode);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '640px', margin: '40px auto' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={40} />
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Đặt hàng thành công!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
          Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '24px' }}>
          Mã đơn hàng: <strong style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>{createdOrderCode}</strong>
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setIsSuccess(false);
              onNavigateToProducts();
            }}
          >
            <ShoppingBag size={16} /> Tiếp tục mua sắm
          </button>
          <button className="btn btn-primary" onClick={onNavigateToOrders}>
            Xem danh sách Đơn hàng <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification khi thao tác */}
      {lastActionMessage && (
        <div className="cart-action-toast">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span>{lastActionMessage}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-icon" style={{ width: '42px', height: '42px' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Giỏ hàng của bạn</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Kiểm tra danh sách mặt hàng đã chọn và tiến hành đặt hàng
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '6px 14px', fontSize: '0.85rem' }}>
              {totalQuantity} món hàng
            </span>
            {items.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }}
                onClick={() => dispatch(clearCart())}
              >
                <Trash2 size={14} /> Xóa toàn bộ giỏ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Cart Content */}
      {items.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
          <ShoppingBag size={56} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            Giỏ hàng của bạn đang trống
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px' }}>
            Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá danh mục sản phẩm và chọn những món đồ bạn yêu thích.
          </p>
          <button type="button" className="btn btn-primary" onClick={onNavigateToProducts}>
            <ShoppingBag size={16} /> Khám phá sản phẩm ngay
          </button>
        </div>
      ) : (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left: Cart Items List & Coupons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--primary)" /> Danh sách mặt hàng ({items.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="glass-panel"
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '16px',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px', lineHeight: 1.3 }}>
                            {item.product.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                            SKU: {item.product.sku} | Kho: {item.product.stockQuantity}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn-icon btn-secondary"
                          style={{ color: 'var(--accent-rose)', width: '32px', height: '32px' }}
                          onClick={() => dispatch(removeFromCart(item.productId))}
                          title="Xóa món này"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Số lượng:</span>
                          <div className="qty-control-group">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => dispatch(decrementQuantity(item.productId))}
                              title="Giảm số lượng"
                            >
                              <Minus size={12} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.product.stockQuantity}
                              className="qty-input"
                              value={item.quantity}
                              onChange={(e) => handleDirectQuantityChange(item.productId, e.target.value)}
                            />
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
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>
                            {formatCurrency(item.totalPrice)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            Đơn giá: {formatCurrency(item.unitPrice)}
                          </div>
                        </div>
                      </div>

                      {item.quantity >= item.product.stockQuantity && (
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> Đã đạt số lượng tồn kho tối đa ({item.product.stockQuantity})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupons Section */}
            <div className="glass-panel">
              <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="#fbbf24" /> Mã khuyến mãi & Giảm giá
              </h3>

              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Nhập mã (VD: PTIT10, VIP20)..."
                  className="form-control"
                  style={{ textTransform: 'uppercase' }}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                  Áp dụng
                </button>
              </form>

              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>
                      ✓ Đang áp dụng: {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {appliedCoupon.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    style={{ color: 'var(--accent-rose)' }}
                    onClick={() => dispatch(removeCoupon())}
                  >
                    <XCircle size={14} /> Gỡ mã
                  </button>
                </div>
              ) : null}

              {/* Predefined Coupon Chips */}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Mã ưu đãi có sẵn (bấm để dùng ngay):
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.values(AVAILABLE_COUPONS).map((cpn) => (
                    <button
                      key={cpn.code}
                      type="button"
                      className={`btn btn-sm ${appliedCoupon?.code === cpn.code ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleApplyPredefinedCoupon(cpn.code)}
                    >
                      <Tag size={12} /> {cpn.code} ({cpn.discountPercent}%)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Customer, Payment & Order Confirmation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Customer Selector */}
              <div className="glass-panel">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--primary)" /> Thông tin người nhận
                </h3>

                <div className="form-group">
                  <label className="form-label">Chọn khách hàng</label>
                  <select
                    className="form-control"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.phone} ({c.tier})
                      </option>
                    ))}
                  </select>
                </div>

                {currentCustomer && (
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', border: '1px solid var(--border-subtle)' }}>
                    <div><strong>Địa chỉ:</strong> {currentCustomer.address.street}, {currentCustomer.address.ward}, {currentCustomer.address.district}, {currentCustomer.address.city}</div>
                    <div style={{ marginTop: '4px' }}><strong>Email:</strong> {currentCustomer.email}</div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="glass-panel">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="var(--accent-cyan)" /> Hình thức thanh toán
                </h3>

                <div className="form-group">
                  <label className="form-label">Phương thức thanh toán</label>
                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản VietQR / Ngân hàng</option>
                    <option value={PaymentMethod.COD}>Thanh toán khi nhận hàng (COD)</option>
                    <option value={PaymentMethod.E_WALLET}>Ví điện tử (Momo, ZaloPay)</option>
                    <option value={PaymentMethod.CREDIT_CARD}>Thẻ tín dụng / Ghi nợ quốc tế</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú giao hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú thêm cho shipper..."
                  />
                </div>
              </div>

              {/* Order Summary & Checkout Button */}
              <div className="glass-panel" style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95))' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Chi tiết thanh toán</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Tạm tính tiền hàng ({totalQuantity} món):</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Phí vận chuyển:</span>
                    <span style={{ color: shippingFee === 0 ? 'var(--accent-emerald)' : 'var(--text-main)', fontWeight: 600 }}>
                      {shippingFee === 0 ? 'Miễn phí vận chuyển' : formatCurrency(shippingFee)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-rose)' }}>
                      <span>Giảm giá ({appliedCoupon?.code}):</span>
                      <span style={{ fontWeight: 600 }}>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '14px',
                      marginTop: '6px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                    }}
                  >
                    <span>Tổng thanh toán:</span>
                    <span style={{ color: '#38bdf8' }}>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
                >
                  <CheckCircle size={18} /> Xác nhận đặt hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
