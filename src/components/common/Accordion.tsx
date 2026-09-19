import React, { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  AccordionId,
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
} from './AccordionContext';

export type { AccordionId, AccordionContextType, AccordionItemContextType } from './AccordionContext';

// ==================== COMPONENT PROPS ====================

export interface AccordionProps {
  /** ID của panel mở mặc định ban đầu */
  defaultActiveId?: AccordionId | null;
  /** Cho phép click lại vào panel đang mở để đóng nó hay không (mặc định: true) */
  allowToggleCollapse?: boolean;
  /** Callback khi trạng thái mở/đóng thay đổi */
  onChange?: (activeId: AccordionId | null) => void;
  /** Danh sách các Accordion.Item con */
  children: ReactNode;
  /** CSS class tùy chỉnh */
  className?: string;
  /** Style inline tùy chỉnh */
  style?: React.CSSProperties;
}

export interface AccordionItemProps {
  /** Định danh duy nhất của panel */
  id: AccordionId;
  /** Các component con bên trong (Header, Body) */
  children: ReactNode;
  /** Vô hiệu hóa panel */
  disabled?: boolean;
  /** CSS class tùy chỉnh */
  className?: string;
  /** Style inline tùy chỉnh */
  style?: React.CSSProperties;
}

export interface AccordionHeaderProps {
  /** Tiêu đề hoặc nội dung Header */
  children: ReactNode;
  /** Icon phụ ở bên trái */
  icon?: ReactNode;
  /** Tùy biến icon mở rộng bên phải (mặc định là mũi tên ChevronDown xoay) */
  customIndicator?: ReactNode;
  /** CSS class tùy chỉnh */
  className?: string;
  /** Style inline tùy chỉnh */
  style?: React.CSSProperties;
}

export interface AccordionBodyProps {
  /** Nội dung chi tiết bên trong panel */
  children: ReactNode;
  /** CSS class tùy chỉnh */
  className?: string;
  /** Style inline tùy chỉnh */
  style?: React.CSSProperties;
}


// ==================== SUB-COMPONENTS ====================

/**
 * 1. Accordion.Item: Đại diện cho một panel độc lập
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  disabled = false,
  className = '',
  style,
}) => {
  const { toggleItem, isOpen } = useAccordionContext();
  const open = isOpen(id);

  const toggle = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };

  return (
    <AccordionItemContext.Provider value={{ id, isOpen: open, toggle }}>
      <div
        className={`accordion-item ${open ? 'open' : ''} ${disabled ? 'disabled' : ''} ${className}`}
        style={style}
        data-state={open ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

/**
 * 2. Accordion.Header: Phần tiêu đề có thể click để toggle mở/đóng
 */
export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  children,
  icon,
  customIndicator,
  className = '',
  style,
}) => {
  const { isOpen, toggle } = useAccordionItemContext();

  return (
    <button
      type="button"
      className={`accordion-header ${isOpen ? 'active' : ''} ${className}`}
      onClick={toggle}
      aria-expanded={isOpen}
      style={style}
    >
      <div className="accordion-header-content">
        {icon && <span className="accordion-icon">{icon}</span>}
        <span className="accordion-title">{children}</span>
      </div>

      <div className="accordion-indicator">
        {customIndicator ? (
          customIndicator
        ) : (
          <ChevronDown
            size={18}
            className={`accordion-chevron ${isOpen ? 'rotated' : ''}`}
          />
        )}
      </div>
    </button>
  );
};

/**
 * 3. Accordion.Body: Phần nội dung được render khi panel mở
 */
export const AccordionBody: React.FC<AccordionBodyProps> = ({
  children,
  className = '',
  style,
}) => {
  const { isOpen } = useAccordionItemContext();

  return (
    <div
      className={`accordion-collapse ${isOpen ? 'expanded' : 'collapsed'} ${className}`}
      style={style}
      aria-hidden={!isOpen}
    >
      <div className="accordion-body">
        {children}
      </div>
    </div>
  );
};


// ==================== MAIN COMPOUND ACCORDION ====================

/**
 * Compound Component Accordion
 * 
 * Đặc điểm:
 * - Chỉ mở DUY NHẤT 1 panel tại 1 thời điểm (Single Open / Exclusive Accordion)
 * - Mở panel này thì panel khác sẽ tự động thu lại
 * - Dùng Context API chuẩn React
 */
export const Accordion: React.FC<AccordionProps> & {
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Body: typeof AccordionBody;
} = ({
  defaultActiveId = null,
  allowToggleCollapse = true,
  onChange,
  children,
  className = '',
  style,
}) => {
  // Quản lý ID của panel đang mở duy nhất
  const [activeId, setActiveId] = useState<AccordionId | null>(defaultActiveId);

  // Logic đóng/mở panel tuân thủ quy tắc: Chỉ mở 1 panel tại 1 thời điểm
  const toggleItem = (id: AccordionId) => {
    setActiveId((prevId) => {
      let nextId: AccordionId | null;
      if (prevId === id) {
        // Nếu click vào chính panel đang mở: đóng lại nếu allowToggleCollapse = true
        nextId = allowToggleCollapse ? null : id;
      } else {
        // Nếu click vào panel khác: mở panel mới, tự động đóng panel cũ
        nextId = id;
      }
      onChange?.(nextId);
      return nextId;
    });
  };

  const isOpen = (id: AccordionId) => activeId === id;

  return (
    <AccordionContext.Provider value={{ activeId, toggleItem, isOpen }}>
      <div className={`accordion-container ${className}`} style={style}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Gắn sub-components để sử dụng cú pháp Compound Component <Accordion.Item>, <Accordion.Header>, <Accordion.Body>
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

export default Accordion;
