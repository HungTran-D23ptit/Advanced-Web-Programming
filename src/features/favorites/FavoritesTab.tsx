import React, { useState } from 'react';
import { useFavorites } from '../../context';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../cart/cartSlice';
import { Product, ProductStatus } from '../../types/order-management.types';
import {
  Heart,
  Trash2,
  ShoppingBag,
  Star,
  Check,
  BookOpen,
} from 'lucide-react';

interface FavoritesTabProps {
  onNavigateToProducts: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({ onNavigateToProducts }) => {
  const dispatch = useAppDispatch();
  const { favorites, totalFavorites, removeFavorite, clearFavorites } = useFavorites();
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="brand-icon"
              style={{
                width: '42px',
                height: '42px',
                background: 'rgba(244, 63, 94, 0.12)',
                color: 'var(--accent-rose)',
              }}
            >
              <Heart size={22} fill="var(--accent-rose)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Danh sách Sản phẩm yêu thích (Wishlist)</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Quản lý bằng <code>FavoritesContext</code> + <code>useReducer</code> + <code>useMemo</code> (React Context nâng cao)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                color: 'var(--accent-rose)',
                padding: '6px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {totalFavorites} sản phẩm yêu thích
            </span>
            {favorites.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                onClick={clearFavorites}
              >
                <Trash2 size={14} /> Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.1)',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Heart size={38} />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            Chưa có sản phẩm yêu thích nào
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 20px' }}>
            Hãy bấm vào biểu tượng Trái tim trên các sản phẩm trong danh mục để lưu lại những món đồ bạn quan tâm.
          </p>
          <button type="button" className="btn btn-primary" onClick={onNavigateToProducts}>
            <ShoppingBag size={16} /> Khám phá sản phẩm ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {favorites.map((prod: Product) => {
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
                    className="btn-heart-active"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                    }}
                    onClick={() => removeFavorite(prod.id)}
                    title="Bỏ yêu thích"
                  >
                    <Heart size={16} fill="#f43f5e" color="#f43f5e" />
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
                      onClick={() => handleAddToCart(prod)}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={14} /> Đã vào giỏ hàng!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Thêm vào giỏ hàng
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--accent-rose)' }}
                      onClick={() => removeFavorite(prod.id)}
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(244, 63, 94, 0.06))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '20px 24px',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
            <BookOpen size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--primary)' }}>
              Nhận xét so sánh: Context nâng cao (FavoritesContext + useMemo) vs. Redux Toolkit
            </h3>
          </div>
        </div>

        <div
          style={{
            lineHeight: 1.7,
            fontSize: '0.88rem',
            color: 'var(--text-main)',
            background: 'var(--bg-surface-elevated)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p style={{ marginBottom: '6px' }}>
            <strong>1. Ưu điểm:</strong> <code>FavoritesContext</code> kết hợp <code>useReducer</code> và <code>useMemo</code> tận dụng hoàn toàn API có sẵn của React, không cần cài thêm thư viện bên ngoài, cấu hình nhanh gọn và tách biệt hoàn toàn phạm vi dữ liệu Yêu thích mà không làm phình to Redux Store.
          </p>
          <p style={{ marginBottom: '6px' }}>
            <strong>2. Nhược điểm:</strong> So với Redux Toolkit, Context API không hỗ trợ cơ chế selector granular (khi context thay đổi sẽ kích hoạt re-render các component tiêu thụ), thiếu hệ thống middleware bất đồng bộ mạnh mẽ và không hỗ trợ Time-travel debugging qua Redux DevTools.
          </p>
          <p>
            <strong>3. Kết luận:</strong> Việc lựa chọn Context nâng cao cho tính năng <em>Sản phẩm yêu thích</em> là giải pháp tối ưu, giúp phân tách rõ ràng giữa State toàn cục phức tạp (Giỏ hàng/Đơn hàng trên Redux Toolkit) và State tính năng cục bộ độc lập.
          </p>
        </div>
      </div>
    </div>
  );
};
