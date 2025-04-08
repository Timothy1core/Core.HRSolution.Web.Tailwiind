import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageInput,
  setPageInput,
  totalRecords,
}) => {
  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInput(value ? Math.max(1, Math.min(totalPages, Number(value))) : 1);
  };

  const handlePageInputSubmit = () => {
    onPageChange(pageInput - 1); // Convert to zero-based index
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    onPageSizeChange(newPageSize); // Trigger the callback immediately
  };

  const startRecord = currentPage * pageSize + 1;
  const endRecord = Math.min(totalRecords, (currentPage + 1) * pageSize);

  return (
    <div className="flex justify-between gap-3 items-center m-3">
      <div className="flex items-center gap-5 font-bold text-xs text-gray-700">
      <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="form-select form-select-sm form-select-solid"
          style={{ width: 'auto' }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>
          Showing {startRecord} to {endRecord} of {totalRecords} records
        </span>
      </div>

      <div>
        <button
          className="btn btn-light btn-sm me-1 btn-clear"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page}
            className={`btn btn-sm me-1 ${
              page === currentPage ? 'btn-danger' : 'btn-light'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}
        <button
          className="btn btn-light btn-sm me-1 btn-clear"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default Pagination;
