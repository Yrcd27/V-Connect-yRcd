import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import { TablePagination } from './Pagination';
import EmptyState from './EmptyState';
import Loading from './Loading';

/**
 * Table component for displaying data in rows and columns
 * 
 * @param {Object} props Component properties
 * @param {Array} props.columns Array of column definitions {header, accessor, cell, sortable, width}
 * @param {Array} props.data Array of data objects
 * @param {boolean} props.isLoading Whether data is loading
 * @param {string} props.sortColumn Current sort column accessor
 * @param {string} props.sortDirection Current sort direction 'asc' or 'desc'
 * @param {Function} props.onSort Callback when a column is sorted
 * @param {boolean} props.pagination Whether to show pagination
 * @param {number} props.currentPage Current page number
 * @param {number} props.totalPages Total number of pages
 * @param {number} props.pageSize Number of items per page
 * @param {number} props.totalItems Total number of items
 * @param {Function} props.onPageChange Callback when page changes
 * @param {Function} props.onPageSizeChange Callback when page size changes
 * @param {boolean} props.striped Whether to apply striped rows
 * @param {boolean} props.hover Whether to apply hover effect
 * @param {boolean} props.bordered Whether to show borders
 * @param {string} props.size Size variant: 'sm', 'md', 'lg'
 * @param {Object} props.emptyState Custom empty state props
 */
const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  sortColumn,
  sortDirection = 'asc',
  onSort,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  striped = false,
  hover = true,
  bordered = false,
  size = 'md',
  emptyState = {},
}) => {
  // State for columns widths
  const [resizingColumn, setResizingColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  
  // Handle column sort
  const handleSort = (column) => {
    if (!column.sortable || !onSort) return;
    
    if (sortColumn === column.accessor) {
      onSort(column.accessor, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column.accessor, 'asc');
    }
  };
  
  // Handle column resize
  const handleResizeMouseDown = (e, columnId) => {
    e.preventDefault();
    setResizingColumn(columnId);
    
    const startX = e.clientX;
    const startWidth = e.target.parentElement.offsetWidth;
    
    const handleMouseMove = (moveEvent) => {
      if (resizingColumn === columnId) {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        if (newWidth >= 50) { // Minimum width
          setColumnWidths({
            ...columnWidths,
            [columnId]: newWidth,
          });
        }
      }
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      case 'md':
      default:
        return 'text-sm';
    }
  };
  
  const getCellPaddingClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1';
      case 'lg':
        return 'px-6 py-4';
      case 'md':
      default:
        return 'px-4 py-3';
    }
  };
  
  // Render empty state
  if (!isLoading && data.length === 0) {
    return (
      <div className={`overflow-hidden bg-white rounded-lg ${bordered ? 'border' : 'shadow-sm'}`}>
        <EmptyState
          type="data"
          title={emptyState.title || "No data available"}
          message={emptyState.message || "There are no items to display at this time."}
          action={emptyState.action}
          compact
        />
        
        {pagination && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>
    );
  }
  
  return (
    <div className={`overflow-hidden bg-white rounded-lg ${bordered ? 'border' : 'shadow-sm'}`}>
      <div className="overflow-x-auto">
        <table className={`w-full ${getSizeClasses()}`}>
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.accessor || index}
                  className={`
                    ${getCellPaddingClasses()}
                    font-medium text-left
                    ${bordered ? 'border-b' : ''}
                    ${column.width ? '' : 'whitespace-nowrap'}
                    ${column.sortable ? 'cursor-pointer select-none' : ''}
                    relative
                  `}
                  style={{
                    width: columnWidths[column.accessor] || column.width,
                    minWidth: column.minWidth || 'auto',
                    maxWidth: column.maxWidth || 'none',
                  }}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{column.header}</span>
                    {column.sortable && (
                      <span className="ml-1">
                        {sortColumn === column.accessor ? (
                          sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                        ) : (
                          <FiFilter className="opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                  
                  {/* Resizable handle */}
                  <div
                    className="absolute right-0 top-0 h-full w-3 cursor-col-resize z-10"
                    onMouseDown={(e) => handleResizeMouseDown(e, column.accessor)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className={`${isLoading ? 'opacity-50' : ''}`}>
            {isLoading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <Loading text="Loading data..." />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`
                    ${striped && rowIndex % 2 !== 0 ? 'bg-gray-50' : ''}
                    ${hover ? 'hover:bg-gray-50' : ''}
                    ${bordered ? 'border-b' : ''}
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${column.accessor || colIndex}`}
                      className={`${getCellPaddingClasses()} ${column.className || ''}`}
                    >
                      {column.cell
                        ? column.cell(row)
                        : row[column.accessor]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default Table;
