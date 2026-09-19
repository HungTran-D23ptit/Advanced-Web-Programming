import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageNumbers: number[];
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
  className?: string;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasNextPage,
  hasPrevPage,
  pageNumbers,
  onNextPage,
  onPrevPage,
  onGoToPage,
  onItemsPerPageChange,
  itemsPerPage = 6,
  pageSizeOptions = [4, 6, 8, 12],
  className = '',
  itemLabel = 'sản phẩm',
}) => {
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={`pagination-container ${className}`}>
      {/* Thông tin số lượng hiển thị */}
      <div className="pagination-info">
        Hiển thị <span className="highlight">{startIndex}</span> - <span className="highlight">{endIndex}</span> trên tổng số <span className="highlight">{totalItems}</span> {itemLabel}
      </div>

      {/* Bộ chọn số item trên mỗi trang (nếu có) */}
      {onItemsPerPageChange && (
        <div className="pagination-page-size">
          <label htmlFor="page-size-select" className="page-size-label">
            Số lượng / trang:
          </label>
          <select
            id="page-size-select"
            className="form-control page-size-select"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} {itemLabel}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Các nút bấm điều hướng trang */}
      <div className="pagination-nav">
        {/* Nút về trang đầu tiên */}
        <button
          type="button"
          className="pagination-btn pagination-arrow"
          onClick={() => onGoToPage(1)}
          disabled={!hasPrevPage}
          title="Trang đầu tiên"
          aria-label="Trang đầu tiên"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Nút lùi 1 trang */}
        <button
          type="button"
          className="pagination-btn pagination-arrow"
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          title="Trang trước"
          aria-label="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Danh sách các nút số trang */}
        <div className="pagination-numbers">
          {pageNumbers.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                className={`pagination-btn pagination-page ${isActive ? 'active' : ''}`}
                onClick={() => onGoToPage(page)}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Nút tiến 1 trang */}
        <button
          type="button"
          className="pagination-btn pagination-arrow"
          onClick={onNextPage}
          disabled={!hasNextPage}
          title="Trang kế tiếp"
          aria-label="Trang kế tiếp"
        >
          <ChevronRight size={16} />
        </button>

        {/* Nút đến trang cuối */}
        <button
          type="button"
          className="pagination-btn pagination-arrow"
          onClick={() => onGoToPage(totalPages)}
          disabled={!hasNextPage}
          title="Trang cuối cùng"
          aria-label="Trang cuối cùng"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
