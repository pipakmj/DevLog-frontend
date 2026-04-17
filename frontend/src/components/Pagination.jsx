import React from 'react'
import '../styles/Pagination.css';

function Pagination({ pageInfo, onPageChange }) {
    const { totalPages, number: currentPage } = pageInfo;

    if (!totalPages || totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className='pagination'>
            <button
                className="nav-btn"
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &lt;
            </button>
            {pageNumbers.map(page => (
                <button
                    key={page}
                    className={currentPage === page ? 'page-btn active' : 'page-btn'}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}
            <button
                className="nav-btn"
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            >
                &gt;
            </button>
        </div>

    );
}

export default Pagination;