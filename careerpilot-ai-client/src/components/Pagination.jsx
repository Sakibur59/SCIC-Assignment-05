'use client'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      if (currentPage <= 2) {
        start = 2
        end = 4
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
        end = totalPages - 1
      }
      
      if (start > 2) pages.push('...')
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...' || page === currentPage}
          className={`px-4 py-2 rounded-lg text-sm transition ${
            page === currentPage
              ? 'bg-primary-600 text-white'
              : page === '...'
              ? 'cursor-default text-gray-400'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;