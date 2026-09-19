import React, { useState } from 'react';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  UpdateOrderStatusDTO,
} from '../types/order-management.types';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  User,
  MapPin,
  Calendar,
  Layers,
  X,
  Printer,
} from 'lucide-react';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, dto: UpdateOrderStatusDTO) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.PROCESSING);
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PAID);
  const [newNote, setNewNote] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerSnapshot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerSnapshot.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <span className="badge badge-pending"><Clock size={12} /> Chờ xác nhận</span>;
      case OrderStatus.PROCESSING:
        return <span className="badge badge-processing"><Layers size={12} /> Đang đóng gói</span>;
      case OrderStatus.SHIPPED:
        return <span className="badge badge-shipped"><Truck size={12} /> Đang giao hàng</span>;
      case OrderStatus.DELIVERED:
        return <span className="badge badge-delivered"><CheckCircle size={12} /> Đã giao hàng</span>;
      case OrderStatus.CANCELLED:
        return <span className="badge badge-cancelled"><XCircle size={12} /> Đã hủy</span>;
      case OrderStatus.REFUNDED:
        return <span className="badge badge-refunded"><RotateCcw size={12} /> Đã hoàn tiền</span>;
    }
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <span className="badge badge-delivered">Đã thanh toán</span>;
      case PaymentStatus.UNPAID:
        return <span className="badge badge-pending">Chưa thanh toán</span>;
      case PaymentStatus.FAILED:
        return <span className="badge badge-cancelled">Thất bại</span>;
      case PaymentStatus.REFUNDED:
        return <span className="badge badge-refunded">Đã hoàn tiền</span>;
    }
  };

  const handleOpenUpdate = (order: Order) => {
    setTargetOrder(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.paymentStatus);
    setNewNote(order.note || '');
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdate = () => {
    if (!targetOrder) return;
    const dto: UpdateOrderStatusDTO = {
      status: newStatus,
      paymentStatus: newPaymentStatus,
      note: newNote,
    };
    onUpdateOrderStatus(targetOrder.id, dto);
    setIsUpdateModalOpen(false);
    if (selectedOrder && selectedOrder.id === targetOrder.id) {
      setSelectedOrder({
        ...selectedOrder,
        ...dto,
      });
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div>
      {/* Controls Bar */}
      <div className="glass-panel" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Tìm theo mã đơn, tên hoặc SĐT khách..."
                className="form-control"
                style={{ paddingLeft: '38px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-control"
                style={{ width: '180px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value={OrderStatus.PENDING}>Chờ xác nhận</option>
                <option value={OrderStatus.PROCESSING}>Đang xử lý</option>
                <option value={OrderStatus.SHIPPED}>Đang giao hàng</option>
                <option value={OrderStatus.DELIVERED}>Đã giao thành công</option>
                <option value={OrderStatus.CANCELLED}>Đã hủy đơn</option>
              </select>
            </div>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length} đơn hàng
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel">
        <div className="custom-table-wrap">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Mặt hàng</th>
                <th>Tổng thanh toán</th>
                <th>Phương thức</th>
                <th>Trạng thái đơn</th>
                <th>Thanh toán</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                    <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>Không tìm thấy đơn hàng nào phù hợp bộ lọc.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>
                        {order.orderCode}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={11} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerSnapshot.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerSnapshot.phone}</div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} sp
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.items[0]?.productSnapshot.name} {order.items.length > 1 ? `(+${order.items.length - 1})` : ''}
                        </span>
                      </div>
                    </td>

                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={14} /> {order.paymentMethod}
                      </span>
                    </td>

                    <td>{getStatusBadge(order.status)}</td>

                    <td>{getPaymentStatusBadge(order.paymentStatus)}</td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Xem chi tiết đơn hàng (Snapshot & Meta)"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={14} /> Xem
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          title="Cập nhật trạng thái (UpdateOrderStatusDTO)"
                          onClick={() => handleOpenUpdate(order)}
                        >
                          Cập nhật
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Detail & Snapshot */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package className="brand-icon" style={{ width: '36px', height: '36px' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>Chi tiết đơn hàng: {selectedOrder.orderCode}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Khởi tạo lúc: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <button className="btn-icon btn-secondary" onClick={() => setSelectedOrder(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Snapshot Box */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, marginBottom: '10px', fontSize: '0.85rem' }}>
                  <User size={16} /> THÔNG TIN KHÁCH HÀNG (Snapshot tại lúc đặt)
                </div>
                <div className="grid-2" style={{ gap: '10px', fontSize: '0.875rem' }}>
                  <div><strong>Họ tên:</strong> {selectedOrder.customerSnapshot.name}</div>
                  <div><strong>Số điện thoại:</strong> {selectedOrder.customerSnapshot.phone}</div>
                  <div><strong>Email:</strong> {selectedOrder.customerSnapshot.email}</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <MapPin size={16} style={{ flexShrink: 0, color: 'var(--accent-cyan)' }} />
                    <span>
                      {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.ward},{' '}
                      {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-main)' }}>
                Danh sách sản phẩm trong đơn ({selectedOrder.items.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface-elevated)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={item.productSnapshot.imageUrl}
                        alt={item.productSnapshot.name}
                        style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productSnapshot.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          SKU: {item.productSnapshot.sku} | Đơn giá: {formatCurrency(item.unitPrice)}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>x{item.quantity}</div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(item.totalPrice)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tạm tính hàng:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
                  <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Khuyến mãi / Giảm giá:</span>
                  <span style={{ color: 'var(--accent-rose)' }}>-{formatCurrency(selectedOrder.discountAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '1.05rem' }}>
                  <span>Tổng thanh toán:</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Metadata / Generic Extension */}
              {selectedOrder.metadata && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <strong>Generic Tracking Metadata:</strong>
                  <pre className="code-block" style={{ marginTop: '6px', padding: '10px', fontSize: '0.75rem' }}>
                    {JSON.stringify(selectedOrder.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={16} /> In phiếu đơn hàng
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update Status (UpdateOrderStatusDTO) */}
      {isUpdateModalOpen && targetOrder && (
        <div className="modal-overlay" onClick={() => setIsUpdateModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem' }}>Cập nhật đơn hàng: {targetOrder.orderCode}</h3>
              <button className="btn-icon btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '16px' }}>
                * Áp dụng Utility Type: <code>UpdateOrderStatusDTO = Partial&lt;Pick&lt;Order, 'status' | 'paymentStatus' | 'note'&gt;&gt;</code>
              </p>

              <div className="form-group">
                <label className="form-label">Trạng thái đơn hàng (OrderStatus)</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                >
                  <option value={OrderStatus.PENDING}>PENDING (Chờ xác nhận)</option>
                  <option value={OrderStatus.PROCESSING}>PROCESSING (Đang xử lý / đóng gói)</option>
                  <option value={OrderStatus.SHIPPED}>SHIPPED (Đang vận chuyển)</option>
                  <option value={OrderStatus.DELIVERED}>DELIVERED (Giao thành công)</option>
                  <option value={OrderStatus.CANCELLED}>CANCELLED (Hủy đơn hàng)</option>
                  <option value={OrderStatus.REFUNDED}>REFUNDED (Đã hoàn tiền)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trạng thái thanh toán (PaymentStatus)</label>
                <select
                  className="form-control"
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                >
                  <option value={PaymentStatus.UNPAID}>UNPAID (Chưa thanh toán)</option>
                  <option value={PaymentStatus.PAID}>PAID (Đã thanh toán)</option>
                  <option value={PaymentStatus.FAILED}>FAILED (Thất bại)</option>
                  <option value={PaymentStatus.REFUNDED}>REFUNDED (Đã hoàn tiền)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú cập nhật</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Nhập ghi chú điều phối / giao nhận..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>
                Hủy bỏ
              </button>
              <button className="btn btn-primary" onClick={handleSaveUpdate}>
                Lưu cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
