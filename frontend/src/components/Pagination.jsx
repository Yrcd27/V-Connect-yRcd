import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

/**
 * Pagination component for navigating through multi-page data
 * 
 * @param {Object} props Component properties
 * @param {number} props.currentPage Current page number (1-based)
 * @param {number} props.totalPages Total number of pages
 * @param {Function} props.onPageChange Function called with new page number when page changes
 * @param {boolean} props.showFirstLast Whether to show first/last page buttons
 * @param {number} props.siblingCount Number of sibling pages to show around current page
 * @param {string} props.size Size variant: 'sm', 'md', 'lg'
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = false,
  siblingCount = 1,
  size = 'md',
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  // Generate page numbers to display
  const generatePaginationItems = () => {
    // Always show first page, last page, current page, and sibling pages
    const pageNumbers = new Set();
    pageNumbers.add(1); // First page
    pageNumbers.add(totalPages); // Last page
    
    // Current page and siblings
    for (let i = Math.max(1, currentPage - siblingCount); 
         i <= Math.min(totalPages, currentPage + siblingCount); 
         i++) {
      pageNumbers.add(i);
    }
    
    // Convert to array and sort
    const pageArray = Array.from(pageNumbers).sort((a, b) => a - b);
    
    // Add ellipsis markers if needed
    const result = [];
    let prevPage = 0;
    
    pageArray.forEach(page => {
      if (prevPage > 0 && page - prevPage > 1) {
        result.push('ellipsis-' + prevPage);
      }
      result.push(page);
      prevPage = page;
    });
    
    return result;
  };
  
  const items = generatePaginationItems();
  
  // Size classes for buttons
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-sm';
      case 'lg':
        return 'h-12 w-12 text-lg';
      case 'md':
      default:
        return 'h-10 w-10 text-base';
    }
  };
  
  const buttonSizeClasses = getSizeClasses();
  
  return (
    <div className="flex justify-center items-center py-4 space-x-1">
      {/* First Page Button */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`
            ${buttonSizeClasses}
            flex justify-center items-center rounded-md
            ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
          `}
          aria-label="First page"
        >
          <FiChevronsLeft />
        </button>
      )}
      
      {/* Previous Page Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          ${buttonSizeClasses}
          flex justify-center items-center rounded-md
          ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
        `}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>
      
      {/* Page Numbers */}
      {items.map((item, index) => {
        // Render ellipsis
        if (typeof item === 'string' && item.startsWith('ellipsis-')) {
          return (
            <span key={item} className="flex justify-center items-center px-1">
              ...
            </span>
          );
        }
        
        // Render page number
        return (
          <button
            key={index}
            onClick={() => handlePageChange(item)}
            className={`
              ${buttonSizeClasses}
              flex justify-center items-center rounded-md font-medium
              ${currentPage === item 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            {item}
          </button>
        );
      })}
      
      {/* Next Page Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          ${buttonSizeClasses}
          flex justify-center items-center rounded-md
          ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
        `}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
      
      {/* Last Page Button */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`
            ${buttonSizeClasses}
            flex justify-center items-center rounded-md
            ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
          `}
          aria-label="Last page"
        >
          <FiChevronsRight />
        </button>
      )}
    </div>
  );
};

/**
 * TablePagination component specifically for tables
 * Includes page size selector and item count information
 */
export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-white border-t">
      <div className="flex items-center text-sm text-gray-700 mb-4 sm:mb-0">
        <span>
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </span>
        
        <div className="ml-4">
          <label htmlFor="pageSize" className="mr-2">
            Show:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="form-select py-1 px-2 border rounded text-sm"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showFirstLast={true}
        size="sm"
      />
    </div>
  );
};

export default Pagination;
