import React, { useState } from 'react';
import {
  Code,
  Layers,
  Sparkles,
  Zap,
  BookOpen,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';

export const TypeExplorerTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'entities' | 'enums' | 'generics' | 'utilities' | 'redux' | 'explanation'>('explanation');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div>
      {/* Sub Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeSection === 'explanation' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('explanation')}
        >
          <BookOpen size={16} /> 1. Thuyết minh thiết kế (Nộp bài)
        </button>
        <button
          className={`btn ${activeSection === 'redux' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('redux')}
          style={{ background: activeSection === 'redux' ? undefined : 'rgba(99, 102, 241, 0.15)', color: activeSection === 'redux' ? '#fff' : '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}
        >
          <Sparkles size={16} /> ⭐ 2. Kiến trúc Redux Toolkit (Đề bài Buổi 4)
        </button>
        <button
          className={`btn ${activeSection === 'entities' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('entities')}
        >
          <Layers size={16} /> 3. 4 Thực thể cốt lõi
        </button>
        <button
          className={`btn ${activeSection === 'enums' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('enums')}
        >
          <Zap size={16} /> 4. Enums trạng thái
        </button>
        <button
          className={`btn ${activeSection === 'generics' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('generics')}
        >
          <Sparkles size={16} /> 5. Generic Types
        </button>
        <button
          className={`btn ${activeSection === 'utilities' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSection('utilities')}
        >
          <Code size={16} /> 6. Utility Types (Omit, Pick...)
        </button>
      </div>

      {/* SECTION 1: EXPLANATION */}
      {activeSection === 'explanation' && (
        <div className="glass-panel" style={{ lineHeight: 1.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BookOpen className="brand-icon" style={{ width: '38px', height: '38px' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Bản thuyết minh & Giải thích thiết kế TypeScript</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Học viên: Trần Duy Hưng - MSSV: B23DCCC083
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> Mục tiêu thiết kế
              </h4>
              <p>
                Xây dựng hệ thống type chặt chẽ cho module <strong>"Quản lý đơn hàng"</strong> theo đúng chuẩn thương mại điện tử thực tế. Đáp ứng tính toàn vẹn dữ liệu, type-safe giữa Frontend - Backend, và bảo toàn lịch sử giao dịch khi dữ liệu sản phẩm/khách hàng biến động.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>1. Vì sao dùng Snapshot trong OrderItem & Order?</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Trong thực tế, khi Admin thay đổi giá sản phẩm từ 50tr xuống 45tr hoặc khách hàng đổi số điện thoại, các đơn hàng <em>đã tạo trong quá khứ không được phép thay đổi</em>. Do đó, <code>OrderItem</code> snapshot lại <code>unitPrice</code> và thông tin sản phẩm, còn <code>Order</code> snapshot lại <code>customerSnapshot</code>.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }}>2. Ứng dụng Generic Type linh hoạt</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  - <code>BaseEntity&lt;TId = string&gt;</code>: Chuẩn hóa trường hệ thống (id, createdAt, updatedAt) mà không lặp code.<br/>
                  - <code>Order&lt;TMeta&gt;</code>: Cho phép mở rộng tracking (UTM tags, device, IP) không dùng <code>any</code>.<br/>
                  - <code>ApiResponse&lt;TData&gt;</code>: Bao bọc phản hồi API đồng nhất.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--accent-amber)', marginBottom: '8px' }}>3. Tối ưu bằng Utility Types</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  - <code>Omit</code>: Tạo DTO thêm mới (loại bỏ trường hệ thống auto-gen).<br/>
                  - <code>Partial</code>: Tạo DTO cập nhật (cho phép patch từng trường).<br/>
                  - <code>Pick</code>: Trích xuất thông tin in nhãn giao hàng (<code>CustomerContactInfo</code>).<br/>
                  - <code>Readonly</code>: Đảm bảo tính bất biến của hóa đơn lưu trữ.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION REDUX TOOLKIT */}
      {activeSection === 'redux' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))', border: '1px solid rgba(99,102,241,0.3)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8' }}>
              <Sparkles size={20} /> Kiến trúc Redux Toolkit Feature-Based (Đáp ứng 100% Đề bài)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Module gồm <code>cartSlice</code>, <code>productsSlice</code> (sử dụng <code>createAsyncThunk</code> xử lý 3 trạng thái + RTK Query Service), cấu hình store với <code>configureStore</code>, và bộ custom hooks typed <code>useAppDispatch</code> / <code>useAppSelector</code> tuyệt đối không dùng <code>any</code>.
            </p>
          </div>

          <div className="glass-panel">
            <h4 style={{ color: 'var(--accent-cyan)', fontSize: '1.05rem', marginBottom: '12px' }}>
              1. Cấu hình Store & Typed Hooks (src/app/store.ts & src/app/hooks.ts)
            </h4>
            <pre className="code-block">
{`// src/app/store.ts
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    [productsRtkApi.reducerPath]: productsRtkApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsRtkApi.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/app/hooks.ts (Strictly Typed Hooks - No any)
export const useAppDispatch: () => AppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector.withTypes<RootState>();`}
            </pre>
          </div>

          <div className="glass-panel">
            <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.05rem', marginBottom: '12px' }}>
              2. Async Thunk xử lý 3 trạng thái (src/features/products/productsSlice.ts)
            </h4>
            <pre className="code-block">
{`export const fetchProducts = createAsyncThunk<Product[], FetchProductsFilter | undefined, { rejectValue: string }>(
  'products/fetchProducts',
  async (filter, { rejectWithValue }) => {
    try {
      return await fetchProductsApi(filter);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// extraReducers xử lý đủ 3 trạng thái: pending, fulfilled, rejected
builder
  .addCase(fetchProducts.pending, (state) => {
    state.status = 'loading';
    state.error = null;
  })
  .addCase(fetchProducts.fulfilled, (state, action) => {
    state.status = 'succeeded';
    state.items = action.payload;
    state.lastUpdated = new Date().toISOString();
  })
  .addCase(fetchProducts.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload || 'Lỗi không xác định';
  });`}
            </pre>
          </div>

          <div className="glass-panel">
            <h4 style={{ color: 'var(--accent-rose)', fontSize: '1.05rem', marginBottom: '12px' }}>
              3. Cart Slice Reducers (src/features/cart/cartSlice.ts)
            </h4>
            <pre className="code-block">
{`// Thêm vào giỏ (nếu đã có thì tăng số lượng không vượt quá tồn kho)
addToCart: (state, action: PayloadAction<AddToCartPayload | Product>) => { ... }

// Xóa sản phẩm khỏi giỏ
removeFromCart: (state, action: PayloadAction<string>) => { ... }

// Cập nhật số lượng (+, -, direct input)
updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => { ... }

// Xóa toàn bộ giỏ hàng
clearCart: (state) => { ... }

// Áp dụng mã giảm giá Coupon
applyCoupon: (state, action: PayloadAction<string>) => { ... }`}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 2: 4 CORE ENTITIES */}
      {activeSection === 'entities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: 'var(--primary-light)', fontSize: '1.1rem' }}>1. Customer & Product Interfaces</h4>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => copyToClipboard('entities-1', `export interface Customer extends BaseEntity<string> {\n  name: string;\n  email: string;\n  phone: string;\n  avatarUrl?: string;\n  address: Address;\n  tier: CustomerTier;\n  isActive: boolean;\n  totalSpent: number;\n}`)}
              >
                {copiedKey === 'entities-1' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />} Copy
              </button>
            </div>
            <pre className="code-block">
{`export interface Customer extends BaseEntity<string> {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address: Address;
  tier: CustomerTier;
  isActive: boolean;
  totalSpent: number;
}

export interface Product extends BaseEntity<string> {
  sku: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  status: ProductStatus;
  rating: number;
}`}
            </pre>
          </div>

          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>2. OrderItem & Order Interfaces</h4>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => copyToClipboard('entities-2', `export interface OrderItem<TProductInfo = Pick<Product, 'id' | 'sku' | 'name' | 'price' | 'imageUrl'>> {\n  id: string;\n  productId: string;\n  productSnapshot: TProductInfo;\n  unitPrice: number;\n  quantity: number;\n  discountAmount: number;\n  totalPrice: number;\n}`)}
              >
                {copiedKey === 'entities-2' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />} Copy
              </button>
            </div>
            <pre className="code-block">
{`export interface OrderItem<TProductInfo = Pick<Product, 'id' | 'sku' | 'name' | 'price' | 'imageUrl'>> {
  id: string;
  productId: string;
  productSnapshot: TProductInfo; // Snapshot giá & tên tại thời điểm đặt hàng
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  totalPrice: number;
}

export interface Order<TMeta = Record<string, unknown>> extends BaseEntity<string> {
  orderCode: string;
  customerId: string;
  customerSnapshot: Pick<Customer, 'id' | 'name' | 'email' | 'phone'>;
  shippingAddress: Address;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  note?: string;
  metadata?: TMeta; // Generic metadata mở rộng
}`}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 3: ENUMS */}
      {activeSection === 'enums' && (
        <div className="glass-panel">
          <h4 style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: '14px' }}>Các Enums định nghĩa trạng thái cố định</h4>
          <pre className="code-block">
{`export enum OrderStatus {
  PENDING = 'PENDING',         // Chờ xác nhận
  PROCESSING = 'PROCESSING',   // Đang xử lý / đóng gói
  SHIPPED = 'SHIPPED',         // Đang giao hàng
  DELIVERED = 'DELIVERED',     // Giao thành công
  CANCELLED = 'CANCELLED',     // Đã hủy
  REFUNDED = 'REFUNDED',       // Đã hoàn tiền
}

export enum PaymentMethod {
  COD = 'COD',                     // Thanh toán khi nhận hàng
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản ngân hàng
  CREDIT_CARD = 'CREDIT_CARD',     // Thẻ tín dụng/ghi nợ
  E_WALLET = 'E_WALLET',           // Ví điện tử (Momo/ZaloPay/VNPay)
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CustomerTier {
  STANDARD = 'STANDARD', // Chuẩn
  SILVER = 'SILVER',     // Bạc (giảm 2%)
  GOLD = 'GOLD',         // Vàng (giảm 5%)
  PLATINUM = 'PLATINUM', // Bạch kim (giảm 10%)
}

export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}`}
          </pre>
        </div>
      )}

      {/* SECTION 4: GENERICS */}
      {activeSection === 'generics' && (
        <div className="glass-panel">
          <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem', marginBottom: '14px' }}>Generic Types</h4>
          <pre className="code-block">
{`// 1. Generic Base Entity cho các khóa chính (TId = string | number)
export interface BaseEntity<TId = string> {
  id: TId;
  createdAt: string;
  updatedAt: string;
}

// 2. Generic API Response chuẩn hóa
export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  statusCode: number;
  timestamp: string;
}

// 3. Generic Pagination Result
export interface PaginatedResult<TItem> {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 4. Generic Order Metadata
export interface Order<TMeta = Record<string, unknown>> extends BaseEntity<string> {
  // ...
  metadata?: TMeta;
}`}
          </pre>
        </div>
      )}

      {/* SECTION 5: UTILITY TYPES */}
      {activeSection === 'utilities' && (
        <div className="glass-panel">
          <h4 style={{ color: 'var(--accent-rose)', fontSize: '1.1rem', marginBottom: '14px' }}>Áp dụng Utility Types (Omit, Partial, Pick, Readonly, Record)</h4>
          <pre className="code-block">
{`// 1. OMIT: Lược bỏ các trường tự sinh khi tạo mới Khách hàng & Sản phẩm
export type CreateCustomerDTO = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent'>;
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// 2. PARTIAL: Cho phép cập nhật từng phần thông tin
export type UpdateProductDTO = Partial<CreateProductDTO>;
export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;

// 3. PICK: Trích xuất trường in nhãn vận chuyển & Cập nhật trạng thái đơn
export type CustomerContactInfo = Pick<Customer, 'name' | 'phone' | 'address'>;
export type UpdateOrderStatusDTO = Partial<Pick<Order, 'status' | 'paymentStatus' | 'note'>>;

// 4. READONLY: Đảm bảo đơn hàng bất biến khi xuất hóa đơn / báo cáo
export type ReadonlyOrder = Readonly<Order>;

// 5. RECORD: Tạo bảng tổng hợp thống kê số lượng đơn theo từng OrderStatus
export type OrderStatusCountSummary = Record<OrderStatus, number>;`}
          </pre>
        </div>
      )}
    </div>
  );
};
