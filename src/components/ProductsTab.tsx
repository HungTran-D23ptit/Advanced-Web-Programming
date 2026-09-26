import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProducts,
  addNewProduct,
  setSearchTerm,
  setSelectedCategory,
} from '../features/products/productsSlice';
import { addToCart, setDrawerOpen } from '../features/cart/cartSlice';
import {
  Product,
  ProductStatus,
  CreateProductDTO,
} from '../types/order-management.types';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from './common/Pagination';
import { Accordion } from './common/Accordion';
import {
  Box,
  Plus,
  Search,
  Star,
  X,
  CheckCircle,
  ShieldCheck,
  Truck,
  HelpCircle,
  Crown,
  Layers,
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
  Check,
  Heart,
} from 'lucide-react';
import { useFavorites } from '../context';

interface ProductsTabProps {
  onNavigateToCart?: () => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ onNavigateToCart }) => {
  const dispatch = useAppDispatch();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { items: products, status, error, searchTerm, selectedCategory } =
    useAppSelector((state) => state.products);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(1000000);
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [category, setCategory] = useState('Phụ kiện');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    currentData: paginatedProducts,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    pageNumbers,
    nextPage,
    prevPage,
    goToPage,
    setItemsPerPage,
    itemsPerPage,
  } = usePagination<Product>(filteredProducts, 6);

  const categories = ['ALL', 'Laptop', 'Điện thoại', 'Âm thanh', 'Phụ kiện', 'Màn hình'];

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(addToCart(product));
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);
  };

  const handleBuyNow = (product: Product) => {
    dispatch(addToCart(product));
    dispatch(setDrawerOpen(true));
    if (onNavigateToCart) {
      onNavigateToCart();
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const dto: CreateProductDTO = {
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      name,
      description,
      price,
      stockQuantity,
      category,
      imageUrl,
      status: stockQuantity > 0 ? ProductStatus.IN_STOCK : ProductStatus.OUT_OF_STOCK,
      rating: 5.0,
    };

    const newProduct: Product = {
      ...dto,
      id: `PROD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addNewProduct(newProduct));
    setIsModalOpen(false);
    setName('');
    setDescription('');
    setSku('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getItemCartQty = (productId: string) => {
    const found = cartItems.find((item) => item.productId === productId);
    return found ? found.quantity : 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, SKU, danh mục sản phẩm..."
              className="form-control"
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Thêm sản phẩm mới
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            Danh mục:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => dispatch(setSelectedCategory(cat))}
            >
              {cat === 'ALL' ? 'Tất cả danh mục' : cat}
            </button>
          ))}
        </div>
      </div>

      {status === 'failed' && (
        <div className="glass-panel error-state-box">
          <div className="error-icon-wrap">
            <AlertTriangle size={36} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-rose)', marginBottom: '8px' }}>
            Không thể tải danh sách sản phẩm!
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 16px', fontSize: '0.88rem' }}>
            {error || 'Lỗi kết nối đến máy chủ khi tải danh mục sản phẩm.'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => dispatch(fetchProducts({ simulateError: false, delayMs: 600 }))}
          >
            <RefreshCw size={15} /> Thử lại
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="glass-panel skeleton-card">
              <div className="skeleton-img shimmer"></div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton-line shimmer" style={{ width: '40%', height: '12px' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '85%', height: '20px' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '100%', height: '14px' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '60%', height: '14px' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="skeleton-line shimmer" style={{ width: '35%', height: '22px' }}></div>
                  <div className="skeleton-line shimmer" style={{ width: '45%', height: '34px', borderRadius: '8px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'succeeded' && paginatedProducts.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-dim)' }}>
          <Box size={44} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
            Không tìm thấy sản phẩm nào
          </h4>
          <p style={{ fontSize: '0.85rem' }}>Thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc danh mục.</p>
        </div>
      )}

      {status === 'succeeded' && paginatedProducts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {paginatedProducts.map((prod) => {
            const inCartCount = getItemCartQty(prod.id);
            const isJustAdded = addedAnimationId === prod.id;

            return (
              <div
                key={prod.id}
                className="glass-panel product-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className={`product-heart-btn ${isFavorite(prod.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prod);
                    }}
                    title={isFavorite(prod.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart
                      size={16}
                      fill={isFavorite(prod.id) ? '#f43f5e' : 'none'}
                      color={isFavorite(prod.id) ? '#f43f5e' : 'rgba(255,255,255,0.9)'}
                    />
                  </button>

                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(6px)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: prod.status === ProductStatus.IN_STOCK ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    }}
                  >
                    {prod.status === ProductStatus.IN_STOCK ? '● Còn hàng' : '○ Hết hàng'}
                  </span>

                  {inCartCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'var(--primary)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ShoppingBag size={11} /> Trong giỏ: {inCartCount}
                    </span>
                  )}
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {prod.sku}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#fbbf24' }}>
                      <Star size={13} fill="#fbbf24" /> {prod.rating}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>
                    {prod.name}
                  </h4>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '14px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {prod.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                        {formatCurrency(prod.price)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Kho: <strong>{prod.stockQuantity}</strong> cái
                      </div>
                    </div>
                    <span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                      {prod.category}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button"
                      className={`btn ${isJustAdded ? 'btn-success-animated' : 'btn-primary'} btn-sm`}
                      style={{ justifyContent: 'center' }}
                      disabled={prod.stockQuantity <= 0}
                      onClick={(e) => handleAddToCart(prod, e)}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={14} /> Đã thêm vào giỏ!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Thêm vào giỏ
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px' }}
                      disabled={prod.stockQuantity <= 0}
                      title="Mua ngay"
                      onClick={() => handleBuyNow(prod)}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {status === 'succeeded' && filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          pageNumbers={pageNumbers}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onGoToPage={goToPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPage={itemsPerPage}
          pageSizeOptions={[4, 6, 8, 12]}
          itemLabel="sản phẩm"
        />
      )}

      <div className="glass-panel" style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div className="brand-icon" style={{ width: '38px', height: '38px' }}>
            <Layers size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Chính sách bán hàng & Hỗ trợ khách hàng</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cam kết dịch vụ chính hãng và quyền lợi mua sắm tốt nhất.
            </p>
          </div>
        </div>

        <Accordion defaultActiveId="panel-warranty">
          <Accordion.Item id="panel-warranty">
            <Accordion.Header icon={<ShieldCheck size={18} color="var(--accent-emerald)" />}>
              1. Chính sách bảo hành chính hãng và thời hạn đổi mới
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ lineHeight: 1.7, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <p style={{ marginBottom: '8px' }}>
                  Toàn bộ thiết bị điện tử, laptop và phụ kiện bán ra tại hệ thống đều được bảo hành chính hãng theo tiêu chuẩn của nhà sản xuất:
                </p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Đổi mới 1 - 1 trong 30 ngày đầu</strong> nếu phát sinh lỗi phần cứng từ nhà sản xuất.</li>
                  <li>Bảo hành phần cứng 12 - 24 tháng tại các trung tâm ủy quyền toàn quốc.</li>
                  <li>Hỗ trợ cài đặt phần mềm và vệ sinh thiết bị định kỳ miễn phí trọn đời máy.</li>
                </ul>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item id="panel-shipping">
            <Accordion.Header icon={<Truck size={18} color="var(--accent-cyan)" />}>
              2. Quy định đồng kiểm hàng khi nhận (COD) & Vận chuyển
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ lineHeight: 1.7, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <p style={{ marginBottom: '8px' }}>
                  Nhằm bảo vệ quyền lợi tối đa cho khách hàng, hệ thống áp dụng chính sách đồng kiểm:
                </p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Khách hàng được quyền mở hộp kiểm tra ngoại quan trước khi thanh toán.</li>
                  <li>Giao hàng hỏa tốc trong 2 giờ tại nội thành Hà Nội & TP. Hồ Chí Minh.</li>
                  <li>Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng có giá trị từ 30.000.000 VNĐ.</li>
                </ul>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item id="panel-vip">
            <Accordion.Header icon={<Crown size={18} color="#fbbf24" />}>
              3. Quyền lợi tích điểm & Chiết khấu khách hàng thân thiết
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ lineHeight: 1.7, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <p style={{ marginBottom: '8px' }}>
                  Dựa trên tổng chi tiêu tích lũy, hệ thống tự động nâng cấp hạng thành viên:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <span className="badge badge-tier-silver" style={{ marginBottom: '6px' }}>SILVER</span>
                    <p style={{ fontSize: '0.8rem' }}>Chi tiêu từ 10tr: Giảm 2% trên mọi đơn hàng tiếp theo.</p>
                  </div>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <span className="badge badge-tier-gold" style={{ marginBottom: '6px' }}>GOLD</span>
                    <p style={{ fontSize: '0.8rem' }}>Chi tiêu từ 30tr: Giảm 5% + Quà sinh nhật độc quyền.</p>
                  </div>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <span className="badge badge-tier-platinum" style={{ marginBottom: '6px' }}>PLATINUM</span>
                    <p style={{ fontSize: '0.8rem' }}>Chi tiêu từ 80tr: Giảm 10% + Hỗ trợ kỹ thuật 24/7 chuyên biệt.</p>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item id="panel-payment">
            <Accordion.Header icon={<HelpCircle size={18} color="var(--accent-rose)" />}>
              4. Các phương thức thanh toán an toàn
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ lineHeight: 1.7, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <p>
                  Hỗ trợ đa dạng phương thức thanh toán: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng tự động với mã VietQR, Thẻ tín dụng quốc tế (Visa/Mastercard) và Ví điện tử (Momo, ZaloPay, VNPay).
                </p>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateProduct}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box className="brand-icon" style={{ width: '36px', height: '36px' }} />
                  <h3 style={{ fontSize: '1.15rem' }}>Thêm sản phẩm mới</h3>
                </div>
                <button type="button" className="btn-icon btn-secondary" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tên sản phẩm</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="VD: Bàn phím cơ không dây..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mã SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="VD: ACC-KEY-K3PRO"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Giá bán (VNĐ)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={10000}
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số lượng nhập kho</label>
                    <input
                      type="number"
                      required
                      min={0}
                      className="form-control"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Danh mục</label>
                    <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Laptop">Laptop</option>
                      <option value="Điện thoại">Điện thoại</option>
                      <option value="Âm thanh">Âm thanh</option>
                      <option value="Phụ kiện">Phụ kiện</option>
                      <option value="Màn hình">Màn hình</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Hình ảnh</label>
                    <input
                      type="url"
                      className="form-control"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả sản phẩm</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Mô tả tính năng, thông số kỹ thuật..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
