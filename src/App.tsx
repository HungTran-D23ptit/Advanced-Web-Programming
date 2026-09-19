import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { toggleDrawer } from './features/cart/cartSlice';
import {
  initialCustomers,
  initialOrders,
} from './data/mockData';
import {
  Customer,
  Order,
  OrderStatus,
  UpdateOrderStatusDTO,
  OrderStatusCountSummary,
} from './types/order-management.types';
import { OrdersTab } from './components/OrdersTab';
import { CreateOrderTab } from './components/CreateOrderTab';
import { ProductsTab } from './components/ProductsTab';
import { CustomersTab } from './components/CustomersTab';
import { CartTab, CartDrawer } from './features/cart';
import {
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
  Box,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Sun,
  Moon,
} from 'lucide-react';

export function App() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const cartTotalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const productsCount = products.length;

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<
    'products' | 'cart' | 'orders' | 'create-order' | 'customers'
  >('products');
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleUpdateOrderStatus = (orderId: string, dto: UpdateOrderStatusDTO) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            ...dto,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  // Handle Create New Order (from CreateOrderTab or CartTab)
  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Also update customer's total spent
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === newOrder.customerId) {
          return {
            ...cust,
            totalSpent: cust.totalSpent + newOrder.totalAmount,
            updatedAt: new Date().toISOString(),
          };
        }
        return cust;
      })
    );
  };

  // Handle Add Customer
  const handleAddCustomer = (newCust: Customer) => {
    setCustomers((prev) => [newCust, ...prev]);
  };

  // Calculate OrderStatusCountSummary
  const statusSummary: OrderStatusCountSummary = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.PROCESSING]: 0,
      [OrderStatus.SHIPPED]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.CANCELLED]: 0,
      [OrderStatus.REFUNDED]: 0,
    }
  );

  const totalRevenue = orders
    .filter((o) => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.REFUNDED)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Package size={26} />
          </div>
          <div>
            <h1 className="brand-title">HỆ THỐNG QUẢN LÝ BÁN HÀNG & ĐƠN HÀNG</h1>
            <div className="brand-subtitle">
              <span>E-Commerce & Order Management</span>
              <span className="student-tag">B23DCCC083 - TRẦN DUY HƯNG</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Nút Giỏ hàng trên Header với Badge thời gian thực */}
          <button
            type="button"
            className="cart-header-btn"
            onClick={() => dispatch(toggleDrawer())}
            title="Mở giỏ hàng nhanh"
          >
            <ShoppingCart size={18} />
            <span className="cart-header-label">Giỏ hàng</span>
            {cartTotalQuantity > 0 && (
              <span className="cart-header-badge">{cartTotalQuantity}</span>
            )}
          </button>

          {/* Nút chuyển đổi Giao diện Sáng / Tối */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Chuyển sang Giao diện tối' : 'Chuyển sang Giao diện sáng'}
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} color="var(--primary)" /> Giao diện tối
              </>
            ) : (
              <>
                <Sun size={16} color="#fbbf24" /> Giao diện sáng
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActiveTab('create-order')}
          >
            <PlusCircle size={18} /> Tạo đơn hàng mới
          </button>
        </div>
      </header>

      {/* Quick KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-val">{formatCurrency(totalRevenue)}</div>
            <div className="stat-lbl">Tổng doanh thu ({orders.length} đơn)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.1)', color: 'var(--accent-amber)' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-val">{statusSummary[OrderStatus.PENDING] + statusSummary[OrderStatus.PROCESSING]}</div>
            <div className="stat-lbl">Đơn đang xử lý</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-cyan)' }}>
            <Truck size={22} />
          </div>
          <div>
            <div className="stat-val">{statusSummary[OrderStatus.SHIPPED]}</div>
            <div className="stat-lbl">Đơn đang vận chuyển</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--accent-emerald)' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="stat-val">{statusSummary[OrderStatus.DELIVERED]}</div>
            <div className="stat-lbl">Đơn hoàn thành</div>
          </div>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          type="button"
          className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Box size={17} /> Sản phẩm ({productsCount})
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
          style={{ position: 'relative' }}
        >
          <ShoppingCart size={17} /> Giỏ hàng
          {cartTotalQuantity > 0 && (
            <span
              style={{
                marginLeft: '6px',
                background: 'var(--accent-rose)',
                color: '#fff',
                padding: '2px 7px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              {cartTotalQuantity}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={17} /> Danh sách đơn hàng ({orders.length})
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === 'create-order' ? 'active' : ''}`}
          onClick={() => setActiveTab('create-order')}
        >
          <ShoppingBag size={17} /> Tạo đơn hàng
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <Users size={17} /> Khách hàng ({customers.length})
        </button>
      </nav>

      {/* Main Tab Content */}
      <main>
        {activeTab === 'products' && (
          <ProductsTab onNavigateToCart={() => setActiveTab('cart')} />
        )}

        {activeTab === 'cart' && (
          <CartTab
            customers={customers}
            onOrderCreated={handleCreateOrder}
            onNavigateToProducts={() => setActiveTab('products')}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'create-order' && (
          <CreateOrderTab
            customers={customers}
            products={products}
            onCreateOrder={handleCreateOrder}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersTab
            customers={customers}
            onAddCustomer={handleAddCustomer}
          />
        )}
      </main>

      {/* Slide-over Quick Cart Drawer */}
      <CartDrawer
        onNavigateToCartTab={() => setActiveTab('cart')}
        onNavigateToCheckout={() => setActiveTab('cart')}
      />
    </div>
  );
}

export default App;
