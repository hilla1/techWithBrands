// components/Pagination.jsx
import React from 'react';

const Pagination = ({ page, rowsPerPage, onPageChange, onRowsPerPageChange, totalItems }) => (
  <div className="flex justify-between items-center mt-4 flex-wrap">
    <div className="flex items-center">
      <span className="mr-2 text-gray-600 text-sm">Rows per page:</span>
      <select
        value={rowsPerPage}
        onChange={onRowsPerPageChange}
        className="border border-gray-300 rounded-md p-1 text-sm"
      >
        {[5, 10, 25].map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="px-3 py-1 bg-gray-300 rounded-md text-xs disabled:opacity-50"
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= Math.ceil(totalItems / rowsPerPage) - 1}
        className="px-3 py-1 bg-gray-300 rounded-md text-xs disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);

export default Pagination;
