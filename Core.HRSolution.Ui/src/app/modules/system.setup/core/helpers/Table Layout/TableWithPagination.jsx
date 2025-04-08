import React, { useState } from 'react';
import Pagination from './Pagination';
import { KTIcon } from '@/_metronic/helpers';

const TableWithPagination = ({
  data,
  columns,
  totalRecords,
  isLoadingValue,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageInput, setPageInput] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const isLoading = isLoadingValue;

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    // Notify parent component about sorting changes
    if (onSortChange) {
      onSortChange(key, direction);
    }
  };

  const handlePageChange = (page) => {
    const newPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(newPage);
    setPageInput(newPage + 1); // Update page input to match
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  return (
    <div className="table-with-pagination">
      <div className="table-responsive">
        <table className="table table-bordered align-middle gy-5 gx-7">
          <thead className='fw-bold table-dark text-uppercase'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className={`${column.className || ''} ${
                    column.sortable ? 'sortable' : ''
                  }`}
                  onClick={column.sortable ? () => handleSort(column.accessor) : undefined}
                >
                  {column.Header}
                  {column.sortable && (
                    <span>
                      {sortConfig.key === column.accessor
                        ? sortConfig.direction === 'asc'
                          ? <KTIcon iconName="arrow-up" className='ms-2' />
                          : <KTIcon iconName="arrow-down" className='ms-2' />
                        : "" //<KTIcon iconName="filter" className='ms-2' />
                        }
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody >
            {!isLoading && data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className='bg-hover-secondary'>
                  {columns.map((column) => (
                    <td key={column.accessor} className={`text-gray-800 fs-6 fw-semibold ${column.className || ''}`}>
                      {column.Cell ? column.Cell(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : !isLoading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center fs-1">
                  No Data Available
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center fs-1">
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageInput={pageInput}
        setPageInput={setPageInput}
        totalRecords={totalRecords}
      />
    </div>
  );
};

export default TableWithPagination;
