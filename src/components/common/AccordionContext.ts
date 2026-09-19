import { createContext, useContext } from 'react';

export type AccordionId = string | number;

/**
 * Context cấp cao quản lý trạng thái panel nào đang mở trên toàn bộ Accordion
 */
export interface AccordionContextType {
  activeId: AccordionId | null;
  toggleItem: (id: AccordionId) => void;
  isOpen: (id: AccordionId) => boolean;
}

/**
 * Context cấp item để Header & Body con tự động nhận biết trạng thái mà không cần prop drilling
 */
export interface AccordionItemContextType {
  id: AccordionId;
  isOpen: boolean;
  toggle: () => void;
}

export const AccordionContext = createContext<AccordionContextType | null>(null);
export const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

/**
 * Hook truy xuất context Accordion tổng
 */
export const useAccordionContext = (): AccordionContextType => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Các component con của Accordion phải được bọc bên trong <Accordion>');
  }
  return context;
};

/**
 * Hook truy xuất context AccordionItem
 */
export const useAccordionItemContext = (): AccordionItemContextType => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('Accordion.Header và Accordion.Body phải được đặt bên trong <Accordion.Item>');
  }
  return context;
};
