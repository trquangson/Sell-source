import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Component Pagination tái sử dụng.
 *
 * Props:
 * @param {number} currentPage  - Trang hiện tại (bắt đầu từ 1)
 * @param {number} totalPages   - Tổng số trang
 * @param {function} onPageChange - Callback khi đổi trang: (page: number) => void
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  // Tạo mảng số trang hiển thị (có dấu "..." khi nhiều trang)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Số trang hiển thị mỗi bên trang hiện tại
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      }
    }

    // Chèn "..." vào giữa các khoảng trống
    const result = [];
    let prev = null;
    for (const page of pages) {
      if (prev !== null && page - prev > 1) {
        result.push('...');
      }
      result.push(page);
      prev = page;
    }
    return result;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Nút Trước */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
        {t('common.previous')}
      </button>

      {/* Số trang */}
      {pageNumbers.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-slate-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all border ${
              currentPage === page
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Nút Sau */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {t('common.next')}
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
