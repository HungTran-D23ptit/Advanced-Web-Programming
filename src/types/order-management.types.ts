// ==================== ENUMS ====================

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  E_WALLET = 'E_WALLET',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CustomerTier {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}


// ==================== GENERIC BASE TYPES ====================

// Generic TId cho phép linh hoạt kiểu khóa chính (string | number)
export interface BaseEntity<TId = string> {
  id: TId;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResult<TItem> {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


// ==================== 4 CORE ENTITIES ====================

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  country?: string;
  postalCode?: string;
}

export interface Customer extends BaseEntity<string> {
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
}

// Generic TProductInfo: Snapshot thông tin sản phẩm tại thời điểm mua (bảo toàn giá cũ khi Product thay đổi)
export interface OrderItem<TProductInfo = Pick<Product, 'id' | 'sku' | 'name' | 'price' | 'imageUrl'>> {
  id: string;
  productId: string;
  productSnapshot: TProductInfo;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  totalPrice: number;
}

// Generic TMeta: Mở rộng metadata/tracking an toàn mà không cần dùng `any`
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
  metadata?: TMeta;
}


// ==================== UTILITY TYPES & DTOs ====================

// Omit: Loại bỏ các trường hệ thống tự sinh khi tạo mới
export type CreateCustomerDTO = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent'>;
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// Partial: Cho phép cập nhật từng phần thông tin
export type UpdateProductDTO = Partial<CreateProductDTO>;
export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;

// Pick: Trích xuất trường in nhãn vận chuyển
export type CustomerContactInfo = Pick<Customer, 'name' | 'phone' | 'address'>;

// Pick & Partial: Chỉ cho phép cập nhật trạng thái & ghi chú đơn hàng
export type UpdateOrderStatusDTO = Partial<Pick<Order, 'status' | 'paymentStatus' | 'note'>>;

// Readonly: Đảm bảo tính bất biến khi xuất hóa đơn / báo cáo
export type ReadonlyOrder = Readonly<Order>;

// Record: Bảng tổng hợp thống kê số lượng đơn theo từng trạng thái
export type OrderStatusCountSummary = Record<OrderStatus, number>;

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  customerId: string;
  shippingAddress: Address;
  items: CreateOrderItemInput[];
  paymentMethod: PaymentMethod;
  note?: string;
  metadata?: Record<string, unknown>;
}
