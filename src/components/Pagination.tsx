import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { PaginationInfo } from '../types/task';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [20, 40, 80, 100];

/**
 * Pagination component with Liquid Design aesthetic
 * Features: page navigation, page size selector, smooth animations
 */
export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const { page, page_size, total, total_pages } = pagination;

  // Calculate visible page numbers (show max 7 pages)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (total_pages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(total_pages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < total_pages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(total_pages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page size selector */}
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-sm">每页显示</span>
        <div className="flex gap-2">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <motion.button
              key={size}
              onClick={() => onPageSizeChange(size)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                'backdrop-blur-xl border border-white/10',
                size === page_size
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {size}
            </motion.button>
          ))}
        </div>
        <span className="text-white/60 text-sm">条</span>
      </div>

      {/* Page info and navigation */}
      <div className="flex items-center gap-4">
        {/* Total info */}
        <span className="text-white/60 text-sm">
          共 <span className="text-white font-medium">{total}</span> 条
        </span>

        {/* Page navigation */}
        {total_pages > 1 && (
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <motion.button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={cn(
                'px-4 py-2 rounded-xl backdrop-blur-xl border border-white/10 transition-all duration-300',
                page === 1
                  ? 'opacity-30 cursor-not-allowed bg-white/5'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              )}
              whileHover={page !== 1 ? { scale: 1.05 } : {}}
              whileTap={page !== 1 ? { scale: 0.95 } : {}}
            >
              <span className="text-sm">←</span>
            </motion.button>

            {/* Page numbers */}
            <div className="flex gap-2">
              {visiblePages.map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-white/40"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = pageNum === page;

                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum as number)}
                    className={cn(
                      'min-w-[40px] px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                      'backdrop-blur-xl border border-white/10',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>

            {/* Next button */}
            <motion.button
              onClick={() => onPageChange(page + 1)}
              disabled={page === total_pages}
              className={cn(
                'px-4 py-2 rounded-xl backdrop-blur-xl border border-white/10 transition-all duration-300',
                page === total_pages
                  ? 'opacity-30 cursor-not-allowed bg-white/5'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              )}
              whileHover={page !== total_pages ? { scale: 1.05 } : {}}
              whileTap={page !== total_pages ? { scale: 0.95 } : {}}
            >
              <span className="text-sm">→</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
