import { useState, useMemo } from 'react';

/**
 * Tùy chọn cấu hình cho hook usePagination
 */
export interface UsePaginationOptions {
  /** Số phần tử trên mỗi trang (mặc định: 6) */
  itemsPerPage?: number;
  /** Trang bắt đầu (mặc định: 1) */
  initialPage?: number;
}

/**
 * Giá trị trả về của hook usePagination<T>
 */
export interface UsePaginationReturn<T> {
  /** Trang hiện tại (1-indexed) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Tổng số phần tử trong toàn bộ danh sách */
  totalItems: number;
  /** Dữ liệu của trang hiện tại */
  currentData: T[];
  /** Chỉ số phần tử bắt đầu trên trang hiện tại (1-indexed) */
  startIndex: number;
  /** Chỉ số phần tử kết thúc trên trang hiện tại (1-indexed) */
  endIndex: number;
  /** Có trang kế tiếp hay không */
  hasNextPage: boolean;
  /** Có trang trước đó hay không */
  hasPrevPage: boolean;
  /** Danh sách các số trang để render nút bấm */
  pageNumbers: number[];
  /** Chuyển đến trang kế tiếp */
  nextPage: () => void;
  /** Quay lại trang trước đó */
  prevPage: () => void;
  /** Chuyển đến trang cụ thể */
  goToPage: (page: number) => void;
  /** Thay đổi số phần tử trên mỗi trang */
  setItemsPerPage: (size: number) => void;
  /** Số phần tử trên mỗi trang hiện tại */
  itemsPerPage: number;
}

/**
 * Custom Hook usePagination<T>
 * Tách biệt hoàn toàn logic phân trang với giao diện UI.
 * 
 * @template T Kiểu dữ liệu của phần tử trong danh sách (Type-safe, không dùng any)
 * @param items Mảng dữ liệu nguồn T[]
 * @param optionsOrItemsPerPage Số lượng item/trang (number) hoặc Object tùy chọn cấu hình
 * @param initialPage Trang khởi đầu (mặc định: 1)
 * @returns Object chứa dữ liệu trang hiện tại và các hàm điều hướng
 */
export function usePagination<T>(
  items: T[],
  optionsOrItemsPerPage: number | UsePaginationOptions = 6,
  initialPage: number = 1
): UsePaginationReturn<T> {
  // Chuẩn hóa tham số đầu vào
  const defaultItemsPerPage =
    typeof optionsOrItemsPerPage === 'number'
      ? optionsOrItemsPerPage
      : optionsOrItemsPerPage.itemsPerPage ?? 6;

  const startPage =
    typeof optionsOrItemsPerPage === 'object' && optionsOrItemsPerPage.initialPage !== undefined
      ? optionsOrItemsPerPage.initialPage
      : initialPage;

  // State quản lý trang hiện tại và số item mỗi trang
  const [currentPage, setCurrentPage] = useState<number>(startPage);
  const [itemsPerPage, setItemsPerPageState] = useState<number>(defaultItemsPerPage);

  const totalItems = items.length;

  // Tính tổng số trang (tối thiểu là 1 trang ngay cả khi danh sách rỗng)
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Derived state: Đảm bảo trang hiện tại luôn nằm trong khoảng hợp lệ [1, totalPages]
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Cắt mảng dữ liệu cho trang hiện tại
  const currentData = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, safeCurrentPage, itemsPerPage]);

  // Tính chỉ số bắt đầu và kết thúc hiển thị cho người dùng (1-indexed)
  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  // Điều kiện kích hoạt nút Next / Prev
  const hasNextPage = safeCurrentPage < totalPages;
  const hasPrevPage = safeCurrentPage > 1;

  // Mảng danh sách số trang [1, 2, 3, ...]
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // Các hàm điều hướng trang
  const nextPage = () => {
    setCurrentPage((prev) => {
      const current = Math.min(Math.max(1, prev), totalPages);
      return current < totalPages ? current + 1 : current;
    });
  };

  const prevPage = () => {
    setCurrentPage((prev) => {
      const current = Math.min(Math.max(1, prev), totalPages);
      return current > 1 ? current - 1 : current;
    });
  };

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const setItemsPerPage = (size: number) => {
    const validSize = Math.max(1, size);
    setItemsPerPageState(validSize);
    setCurrentPage(1); // Reset về trang 1 khi đổi page size
  };

  return {
    currentPage: safeCurrentPage,
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
}

export default usePagination;
