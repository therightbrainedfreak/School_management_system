function PaginationNav({ pagination, isLoading, setPage }) {
    if (isLoading) return null;
    if (!pagination.totalPages) return null;
    if (pagination.totalPages <= 1) return null;

    const getPageNumbers = (current, total) => {

        // No dots needed
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        // Zone 1 — Near START
        if (current <= 3) {
            return [1, 2, 3, 4, '...', total];
        }

        // Zone 3 — Near END
        if (current >= total - 3) {
            return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        }

        // Zone 2 — MIDDLE
        return [1, '...', current - 2, current - 1, current, current + 1, current + 2, '...', total];
    };

    const pages = getPageNumbers(pagination.page, pagination.totalPages);

    return (
        <div className="pagination-nav flex flex-row gap-2 items-center justify-center">
            {pages.map((pageNum, idx) =>
                pageNum === '...'
                    ? <span key={`dot-${idx}`} className="h-10 w-10 flex items-center justify-center text-gray-500">...</span>
                    : <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-2 py-1 text-sm rounded-sm ${pageNum === pagination.page ? "bg-gray-800 text-white" : "bg-gray-200"} flex items-center justify-center hover:text-white hover:bg-gray-800 cursor-pointer transition-colors duration-200`}
                    >
                        {pageNum}
                    </button>
            )}
        </div>
    );
}

export default PaginationNav;