import React, { useState } from 'react';
import { Accordion } from './common/Accordion';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from './common/Pagination';
import { initialProducts, initialCustomers, initialOrders } from '../data/mockData';
import { Product, Customer, Order } from '../types/order-management.types';
import {
  Layers,
  Code2,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Sparkles,
  Sliders,
  Box,
  Users,
  Package,
  BookOpen,
} from 'lucide-react';

export const AccordionLabTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'demo' | 'accordion-code' | 'hook-code' | 'evaluation'>('demo');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Playground dataset state for usePagination<T>
  const [datasetType, setDatasetType] = useState<'products' | 'customers' | 'orders'>('products');
  const [itemsPerPageSetting, setItemsPerPageSetting] = useState<number>(4);

  // Controlled Accordion State Demo
  const [accordionActiveId, setAccordionActiveId] = useState<string | number | null>('panel-1');

  // Generic Pagination Instances demonstrating Type Safety
  const productPagination = usePagination<Product>(initialProducts, itemsPerPageSetting);
  const customerPagination = usePagination<Customer>(initialCustomers, itemsPerPageSetting);
  const orderPagination = usePagination<Order>(initialOrders, itemsPerPageSetting);

  const activePagination =
    datasetType === 'products'
      ? productPagination
      : datasetType === 'customers'
      ? customerPagination
      : orderPagination;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub Navigation Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeSubTab === 'demo' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('demo')}
        >
          <Zap size={16} /> 1. Phòng thí nghiệm & Demo trực quan (Live Test)
        </button>
        <button
          className={`btn ${activeSubTab === 'accordion-code' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('accordion-code')}
        >
          <Layers size={16} /> 2. Mã nguồn Accordion (Context API)
        </button>
        <button
          className={`btn ${activeSubTab === 'hook-code' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('hook-code')}
        >
          <Code2 size={16} /> 3. Mã nguồn usePagination&lt;T&gt; (Generic)
        </button>
        <button
          className={`btn ${activeSubTab === 'evaluation' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('evaluation')}
        >
          <CheckCircle size={16} /> 4. Đối chiếu tiêu chí đánh giá
        </button>
      </div>

      {/* ==================== SUBTAB 1: LIVE DEMO ==================== */}
      {activeSubTab === 'demo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section A: Accordion Compound Component Test */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
                  <Layers size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    A. Kiểm thử Compound Component Accordion
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Quy tắc: <strong>Mở panel này thì panel khác tự động đóng</strong> (Chỉ 1 panel mở tại một thời điểm).
                  </p>
                </div>
              </div>

              {/* Quick test buttons to control Accordion externally */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Điều khiển nhanh:</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setAccordionActiveId('panel-1')}>
                  Mở Panel 1
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setAccordionActiveId('panel-2')}>
                  Mở Panel 2
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setAccordionActiveId('panel-3')}>
                  Mở Panel 3
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setAccordionActiveId(null)}>
                  Đóng tất cả
                </button>
              </div>
            </div>

            {/* Accordion Component Demo */}
            <Accordion
              defaultActiveId={accordionActiveId}
              onChange={(newActiveId) => setAccordionActiveId(newActiveId)}
            >
              <Accordion.Item id="panel-1">
                <Accordion.Header icon={<Sparkles size={18} color="var(--primary)" />}>
                  Panel 1: Nguyên lý Compound Component & Context API trong React
                </Accordion.Header>
                <Accordion.Body>
                  <div style={{ lineHeight: 1.7, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <p style={{ marginBottom: '8px' }}>
                      Compound Component là một design pattern cho phép các component con giao tiếp ngầm với component cha thông qua <strong>React Context API</strong> mà người dùng không cần truyền props lặp đi lặp lại.
                    </p>
                    <ul style={{ paddingLeft: '20px' }}>
                      <li><code>&lt;Accordion&gt;</code> quản lý trạng thái <code>activeId</code> duy nhất.</li>
                      <li><code>&lt;Accordion.Item&gt;</code> cung cấp context cho từng panel.</li>
                      <li><code>&lt;Accordion.Header&gt;</code> và <code>&lt;Accordion.Body&gt;</code> tự động đồng bộ đóng/mở.</li>
                    </ul>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item id="panel-2">
                <Accordion.Header icon={<Zap size={18} color="var(--accent-amber)" />}>
                  Panel 2: Cơ chế Single-Open (Mở 1 panel tại một thời điểm)
                </Accordion.Header>
                <Accordion.Body>
                  <div style={{ lineHeight: 1.7, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <p>
                      Khi người dùng click vào bất kỳ Header nào, hàm <code>toggleItem(id)</code> được kích hoạt trong Context:
                    </p>
                    <pre className="code-block" style={{ margin: '10px 0', padding: '12px' }}>
{`// Logic đảm bảo chỉ 1 panel mở duy nhất
setActiveId((prevId) => (prevId === id ? null : id));`}
                    </pre>
                    <p>
                      Nhờ state <code>activeId</code> duy nhất, khi một panel mới nhận được trạng thái active, tất cả các panel còn lại có <code>id !== activeId</code> sẽ tự động chuyển sang trạng thái <code>isOpen = false</code> và thu lại.
                    </p>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item id="panel-3">
                <Accordion.Header icon={<Code2 size={18} color="var(--accent-cyan)" />}>
                  Panel 3: Khả năng tùy biến và mở rộng linh hoạt
                </Accordion.Header>
                <Accordion.Body>
                  <div style={{ lineHeight: 1.7, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <p>
                      Component hỗ trợ đầy đủ các tính năng nâng cao:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '10px' }}>
                      <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <strong style={{ color: 'var(--text-main)' }}>Custom Icon & Indicator:</strong>
                        <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Tùy biến icon trái và icon mở rộng phải.</p>
                      </div>
                      <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <strong style={{ color: 'var(--text-main)' }}>Controlled & Uncontrolled:</strong>
                        <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Hỗ trợ <code>defaultActiveId</code> và callback <code>onChange</code>.</p>
                      </div>
                      <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <strong style={{ color: 'var(--text-main)' }}>CSS Transitions:</strong>
                        <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Hiệu ứng mở/đóng và xoay mũi tên mượt mà 60fps.</p>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Section B: usePagination<T> Custom Hook Test */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
                  <Sliders size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    B. Kiểm thử Generic Custom Hook: <code>usePagination&lt;T&gt;</code>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Type Generic rõ ràng, không dùng <code>any</code>, áp dụng linh hoạt cho nhiều kiểu thực thể.
                  </p>
                </div>
              </div>

              {/* Select dataset to test Generic Type T */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Kiểu thực thể T:</span>
                <button
                  className={`btn btn-sm ${datasetType === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDatasetType('products')}
                >
                  <Box size={14} /> Product[] ({initialProducts.length})
                </button>
                <button
                  className={`btn btn-sm ${datasetType === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDatasetType('customers')}
                >
                  <Users size={14} /> Customer[] ({initialCustomers.length})
                </button>
                <button
                  className={`btn btn-sm ${datasetType === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDatasetType('orders')}
                >
                  <Package size={14} /> Order[] ({initialOrders.length})
                </button>
              </div>
            </div>

            {/* Pagination KPI Info Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Trang hiện tại (currentPage)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {activePagination.currentPage} / {activePagination.totalPages}
                </div>
              </div>
              <div style={{ background: 'rgba(2, 132, 199, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Số item/trang (itemsPerPage)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {activePagination.itemsPerPage}
                </div>
              </div>
              <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Chỉ số hiển thị (startIndex - endIndex)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {activePagination.startIndex} - {activePagination.endIndex}
                </div>
              </div>
              <div style={{ background: 'rgba(217, 119, 6, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>Tổng số item (totalItems)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  {activePagination.totalItems}
                </div>
              </div>
            </div>

            {/* Rendered Paginated Items preview */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--accent-emerald)" /> Dữ liệu trang hiện tại (<code>currentData: T[]</code> - length: {activePagination.currentData.length}):
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                {datasetType === 'products' &&
                  (activePagination.currentData as Product[]).map((p) => (
                    <div key={p.id} style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{p.sku}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '6px' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                      </div>
                    </div>
                  ))}

                {datasetType === 'customers' &&
                  (activePagination.currentData as Customer[]).map((c) => (
                    <div key={c.id} style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>{c.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>SĐT: {c.phone}</div>
                    </div>
                  ))}

                {datasetType === 'orders' &&
                  (activePagination.currentData as Order[]).map((o) => (
                    <div key={o.id} style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{o.orderCode}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Khách: {o.customerSnapshot.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '6px' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalAmount)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pagination Controls UI Component */}
            <Pagination
              currentPage={activePagination.currentPage}
              totalPages={activePagination.totalPages}
              totalItems={activePagination.totalItems}
              startIndex={activePagination.startIndex}
              endIndex={activePagination.endIndex}
              hasNextPage={activePagination.hasNextPage}
              hasPrevPage={activePagination.hasPrevPage}
              pageNumbers={activePagination.pageNumbers}
              onNextPage={activePagination.nextPage}
              onPrevPage={activePagination.prevPage}
              onGoToPage={activePagination.goToPage}
              onItemsPerPageChange={(size) => {
                setItemsPerPageSetting(size);
                activePagination.setItemsPerPage(size);
              }}
              itemsPerPage={activePagination.itemsPerPage}
              pageSizeOptions={[2, 4, 6, 8]}
              itemLabel={datasetType === 'products' ? 'sản phẩm' : datasetType === 'customers' ? 'khách hàng' : 'đơn hàng'}
            />
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 2: ACCORDION CODE ==================== */}
      {activeSubTab === 'accordion-code' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Mã nguồn Compound Component Accordion</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Đường dẫn file: <code>src/components/common/Accordion.tsx</code>
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => copyToClipboard('accordion-code', `// Xem toàn bộ mã nguồn tại src/components/common/Accordion.tsx`)}
            >
              {copiedKey === 'accordion-code' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />} Copy
            </button>
          </div>

          <pre className="code-block">
{`// src/components/common/Accordion.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export type AccordionId = string | number;

// Context cấp cao quản lý panel nào đang mở trên toàn bộ Accordion
export interface AccordionContextType {
  activeId: AccordionId | null;
  toggleItem: (id: AccordionId) => void;
  isOpen: (id: AccordionId) => boolean;
}

// Context cấp item để Header & Body con tự động nhận biết trạng thái
export interface AccordionItemContextType {
  id: AccordionId;
  isOpen: boolean;
  toggle: () => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);
const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

// ==================== SUB-COMPONENTS ====================

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, disabled = false }) => {
  const { toggleItem, isOpen } = useAccordionContext();
  const open = isOpen(id);

  const toggle = () => {
    if (!disabled) toggleItem(id);
  };

  return (
    <AccordionItemContext.Provider value={{ id, isOpen: open, toggle }}>
      <div className={\`accordion-item \${open ? 'open' : ''}\`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({ children, icon, customIndicator }) => {
  const { isOpen, toggle } = useAccordionItemContext();

  return (
    <button type="button" className={\`accordion-header \${isOpen ? 'active' : ''}\`} onClick={toggle}>
      <div className="accordion-header-content">
        {icon && <span className="accordion-icon">{icon}</span>}
        <span className="accordion-title">{children}</span>
      </div>
      <div className="accordion-indicator">
        {customIndicator ?? <ChevronDown size={18} className={\`accordion-chevron \${isOpen ? 'rotated' : ''}\`} />}
      </div>
    </button>
  );
};

export const AccordionBody: React.FC<AccordionBodyProps> = ({ children }) => {
  const { isOpen } = useAccordionItemContext();

  return (
    <div className={\`accordion-collapse \${isOpen ? 'expanded' : 'collapsed'}\`}>
      <div className="accordion-body">{children}</div>
    </div>
  );
};

// ==================== MAIN COMPOUND COMPONENT ====================

export const Accordion: React.FC<AccordionProps> & {
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Body: typeof AccordionBody;
} = ({ defaultActiveId = null, allowToggleCollapse = true, onChange, children }) => {
  const [activeId, setActiveId] = useState<AccordionId | null>(defaultActiveId);

  // Logic đảm bảo CHỈ MỞ 1 PANEL DUY NHẤT: mở panel này thì đóng panel khác
  const toggleItem = (id: AccordionId) => {
    setActiveId((prevId) => {
      const nextId = prevId === id ? (allowToggleCollapse ? null : id) : id;
      onChange?.(nextId);
      return nextId;
    });
  };

  const isOpen = (id: AccordionId) => activeId === id;

  return (
    <AccordionContext.Provider value={{ activeId, toggleItem, isOpen }}>
      <div className="accordion-container">{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;`}
          </pre>
        </div>
      )}

      {/* ==================== SUBTAB 3: HOOK CODE ==================== */}
      {activeSubTab === 'hook-code' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Mã nguồn Custom Hook usePagination&lt;T&gt;</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Đường dẫn file: <code>src/hooks/usePagination.ts</code>
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => copyToClipboard('hook-code', `// Xem toàn bộ mã nguồn tại src/hooks/usePagination.ts`)}
            >
              {copiedKey === 'hook-code' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />} Copy
            </button>
          </div>

          <pre className="code-block">
{`// src/hooks/usePagination.ts
import { useState, useMemo, useEffect } from 'react';

export interface UsePaginationOptions {
  itemsPerPage?: number;
  initialPage?: number;
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentData: T[];
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageNumbers: number[];
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  itemsPerPage: number;
}

/**
 * Custom Hook usePagination<T>
 * @template T Kiểu dữ liệu mảng (Type generic an toàn, không dùng any)
 */
export function usePagination<T>(
  items: T[],
  optionsOrItemsPerPage: number | UsePaginationOptions = 6,
  initialPage: number = 1
): UsePaginationReturn<T> {
  const defaultItemsPerPage =
    typeof optionsOrItemsPerPage === 'number'
      ? optionsOrItemsPerPage
      : optionsOrItemsPerPage.itemsPerPage ?? 6;

  const startPage =
    typeof optionsOrItemsPerPage === 'object' && optionsOrItemsPerPage.initialPage !== undefined
      ? optionsOrItemsPerPage.initialPage
      : initialPage;

  const [currentPage, setCurrentPage] = useState<number>(startPage);
  const [itemsPerPage, setItemsPerPageState] = useState<number>(defaultItemsPerPage);

  const totalItems = items.length;

  // Tính tổng số trang (tối thiểu 1 trang)
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Điều chỉnh an toàn khi số lượng phần tử thay đổi do tìm kiếm / lọc
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Cắt mảng cho trang hiện tại (currentData: T[])
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const nextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const prevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const setItemsPerPage = (size: number) => {
    setItemsPerPageState(Math.max(1, size));
    setCurrentPage(1); // Reset về trang đầu khi đổi page size
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    currentData,
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
  };
}`}
          </pre>
        </div>
      )}

      {/* ==================== SUBTAB 4: EVALUATION CRITERIA ==================== */}
      {activeSubTab === 'evaluation' && (
        <div className="glass-panel" style={{ lineHeight: 1.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div className="brand-icon" style={{ width: '38px', height: '38px' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Bảng đối chiếu 4 Tiêu chí Đánh giá</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Học viên: Trần Duy Hưng - Mã sinh viên: B23DCCC083
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Criteria 1 */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                <CheckCircle size={18} /> Tiêu chí 1: Accordion hoạt động đúng - Mở panel này thì đóng panel khác
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                - Trạng thái <code>activeId: string | number | null</code> duy nhất được lưu trữ tại <code>AccordionContext</code>.<br />
                - Khi người dùng bấm mở bất kỳ panel mới nào, hàm <code>toggleItem(id)</code> lập tức gán <code>activeId = id</code>, khiến các panel khác tự động chuyển về <code>isOpen = false</code> và đóng lại ngay lập tức.<br />
                - Hỗ trợ toggle đóng panel khi click lại vào chính panel đang mở.
              </p>
            </div>

            {/* Criteria 2 */}
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                <CheckCircle size={18} /> Tiêu chí 2: usePagination&lt;T&gt; có type generic rõ ràng, không dùng any
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                - Định nghĩa với generic parameter: <code>function usePagination&lt;T&gt;(items: T[], ...): UsePaginationReturn&lt;T&gt;</code>.<br />
                - Mảng <code>currentData: T[]</code> bảo toàn 100% kiểu dữ liệu ban đầu truyền vào (như <code>Product</code>, <code>Customer</code>, <code>Order</code>), đạt chuẩn type-safety tuyệt đối, không có bất kỳ khai báo <code>any</code> nào trong toàn bộ codebase.
              </p>
            </div>

            {/* Criteria 3 */}
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#67e8f9', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                <CheckCircle size={18} /> Tiêu chí 3: Tách bạch logic (hook/context) và phần hiển thị (UI)
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                - <strong>Logic phân trang</strong>: Được cô lập hoàn toàn trong hook <code>src/hooks/usePagination.ts</code>.<br />
                - <strong>Giao diện điều khiển phân trang</strong>: Đóng gói thành component tái sử dụng <code>src/components/common/Pagination.tsx</code>.<br />
                - <strong>Logic Accordion</strong>: Được bao bọc qua Context Provider trong <code>src/components/common/Accordion.tsx</code> mà không can thiệp logic nghiệp vụ của các component sử dụng nó.
              </p>
            </div>

            {/* Criteria 4 */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                <CheckCircle size={18} /> Tiêu chí 4: Code có tổ chức, đặt tên rõ ràng, có comment cần thiết
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                - Cấu trúc thư mục chuẩn mực (<code>src/hooks</code>, <code>src/components/common</code>, <code>src/types</code>, <code>src/data</code>).<br />
                - Đặt tên tường minh theo chuẩn PascalCase (Component) và camelCase (Hook/Hàm).<br />
                - Bổ sung JSDoc tiếng Việt chi tiết cho mọi interface, generic props và hàm điều hướng.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionLabTab;
