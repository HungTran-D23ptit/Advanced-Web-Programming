import React, { useState } from 'react';
import {
  Customer,
  Product,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CustomerTier,
  CreateOrderDTO,
} from '../types/order-management.types';
import {
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CreateOrderTabProps {
  customers: Customer[];
  products: Product[];
  onCreateOrder: (order: Order) => void;
  onNavigateToOrders: () => void;
}

const generateNewOrderCode = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(100 + Math.random() * 900);
  return `ORD-${year}${month}${day}-${rand}`;
};

export const CreateOrderTab: React.FC<CreateOrderTabProps> = ({
  customers,
  products,
  onCreateOrder,
  onNavigateToOrders,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 1 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
  const [note, setNote] = useState('Giao nhanh trong 24h');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState('');

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Calculate discount percentage based on customer tier
  const getTierDiscountPercent = (tier: CustomerTier) => {
    switch (tier) {
      case CustomerTier.PLATINUM: return 0.10; // 10%
      case CustomerTier.GOLD: return 0.05;     // 5%
      case CustomerTier.SILVER: return 0.02;   // 2%
      default: return 0;
    }
  };

  const handleAddCartItem = () => {
    const availableProduct = products.find((p) => !cartItems.some((ci) => ci.productId === p.id)) || products[0];
    if (availableProduct) {
      setCartItems([...cartItems, { productId: availableProduct.id, quantity: 1 }]);
    }
  };

  const handleRemoveCartItem = (index: number) => {
    if (cartItems.length > 1) {
      setCartItems(cartItems.filter((_, i) => i !== index));
    }
  };

  const handleUpdateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = [...cartItems];
    if (field === 'productId') {
      newItems[index].productId = value as string;
    } else {
      newItems[index].quantity = Math.max(1, Number(value));
    }
    setCartItems(newItems);
  };

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const discountRate = currentCustomer ? getTierDiscountPercent(currentCustomer.tier) : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const shippingFee = subtotal > 30000000 ? 0 : 40000;
  const totalAmount = subtotal + shippingFee - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    const orderMetadata = {
      channel: 'Web Admin Dashboard',
      customerTierAtPurchase: currentCustomer.tier,
      appliedDiscountRate: `${discountRate * 100}%`,
    };

    // 1. Create DTO payload
    const orderDTO: CreateOrderDTO = {
      customerId: currentCustomer.id,
      shippingAddress: currentCustomer.address,
      items: cartItems,
      paymentMethod,
      note,
      metadata: orderMetadata,
    };

    // 2. Build full Order with snapshots
    const newOrderCode = generateNewOrderCode();

    const newOrder: Order<{ channel: string; customerTierAtPurchase: string; appliedDiscountRate: string }> = {
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
      items: cartItems.map((ci, idx) => {
        const prod = products.find((p) => p.id === ci.productId)!;
        const itemSubtotal = prod.price * ci.quantity;
        const itemDiscount = Math.round(itemSubtotal * discountRate);
        return {
          id: `ITEM-${Date.now()}-${idx}`,
          productId: prod.id,
          productSnapshot: {
            id: prod.id,
            sku: prod.sku,
            name: prod.name,
            price: prod.price,
            imageUrl: prod.imageUrl,
          },
          unitPrice: prod.price,
          quantity: ci.quantity,
          discountAmount: itemDiscount,
          totalPrice: itemSubtotal - itemDiscount,
        };
      }),
      status: OrderStatus.PENDING,
      paymentMethod: orderDTO.paymentMethod,
      paymentStatus: PaymentStatus.UNPAID,
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      note: orderDTO.note,
      metadata: orderMetadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateOrder(newOrder);
    setCreatedOrderCode(newOrderCode);
    setIsSuccess(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (isSuccess) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={36} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Tạo đơn hàng thành công!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Mã đơn hàng: <strong style={{ color: '#818cf8', fontFamily: 'var(--font-mono)' }}>{createdOrderCode}</strong>
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => setIsSuccess(false)}>
            Tạo thêm đơn khác
          </button>
          <button className="btn btn-primary" onClick={onNavigateToOrders}>
            Xem danh sách đơn <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid-2">
        {/* Left Column: Customer & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customer Selection */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} color="var(--primary)" /> 1. Chọn khách hàng
            </h3>

            <div className="form-group">
              <label className="form-label">Khách hàng đặt mua</label>
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
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', border: '1px solid var(--border-subtle)' }}>
                <div><strong>Email:</strong> {currentCustomer.email}</div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Địa chỉ giao:</strong> {currentCustomer.address.street}, {currentCustomer.address.ward}, {currentCustomer.address.district}, {currentCustomer.address.city}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Hạng khách:</strong>
                  <span className={`badge badge-tier-${currentCustomer.tier.toLowerCase()}`}>
                    {currentCustomer.tier} (Giảm {getTierDiscountPercent(currentCustomer.tier) * 100}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Items Selection */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="var(--accent-cyan)" /> 2. Danh sách mặt hàng ({cartItems.length})
              </h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddCartItem}>
                <Plus size={14} /> Thêm sản phẩm
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map((item, idx) => {
                const prod = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'var(--bg-surface-elevated)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <select
                      className="form-control"
                      style={{ flex: 1 }}
                      value={item.productId}
                      onChange={(e) => handleUpdateItem(idx, 'productId', e.target.value)}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.stockQuantity <= 0}>
                          {p.name} - {formatCurrency(p.price)} {p.stockQuantity <= 0 ? '(Hết hàng)' : ''}
                        </option>
                      ))}
                    </select>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min="1"
                        max={prod?.stockQuantity || 10}
                        className="form-control"
                        style={{ width: '70px', textAlign: 'center' }}
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                      />
                    </div>

                    <div style={{ minWidth: '110px', textAlign: 'right', fontWeight: 600, fontSize: '0.85rem' }}>
                      {prod ? formatCurrency(prod.price * item.quantity) : 0}
                    </div>

                    <button
                      type="button"
                      className="btn-icon btn-secondary"
                      style={{ color: 'var(--accent-rose)' }}
                      disabled={cartItems.length <= 1}
                      onClick={() => handleRemoveCartItem(idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>3. Thanh toán & Ghi chú</h3>

            <div className="form-group">
              <label className="form-label">Phương thức thanh toán (PaymentMethod)</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản ngân hàng (QR Code)</option>
                <option value={PaymentMethod.COD}>Thanh toán khi nhận hàng (COD)</option>
                <option value={PaymentMethod.E_WALLET}>Ví điện tử (Momo / ZaloPay / VNPay)</option>
                <option value={PaymentMethod.CREDIT_CARD}>Thẻ tín dụng / Ghi nợ quốc tế</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú đơn hàng (Note)</label>
              <textarea
                className="form-control"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Yêu cầu giao hàng..."
              />
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="glass-panel" style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Tổng kết chi phí</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tổng tiền hàng (Subtotal):</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Phí vận chuyển (Shipping):</span>
                <span style={{ color: shippingFee === 0 ? 'var(--accent-emerald)' : 'var(--text-main)', fontWeight: 600 }}>
                  {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Ưu đãi thành viên ({currentCustomer?.tier}):</span>
                <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>
                  -{formatCurrency(discountAmount)} ({discountRate * 100}%)
                </span>
              </div>

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
                <span style={{ color: 'var(--accent-cyan)' }}>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '1rem' }}
            >
              <CheckCircle2 size={18} /> Xác nhận tạo đơn hàng (CreateOrderDTO)
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
