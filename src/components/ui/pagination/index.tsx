import React from "react";
import { cn } from "@/utils/class-name";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
    disabled = false,
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage <= 3) {
                // Show first 4 pages and ellipsis
                for (let i = 2; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show ellipsis and last 4 pages
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show first, ellipsis, current-1, current, current+1, ellipsis, last
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div
            className={cn(
                "flex items-center justify-center gap-2 mt-4",
                className
            )}
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                className={cn(
                    "p-2 rounded-full transition-colors",
                    currentPage === 1 || disabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                )}
                aria-label="Página anterior"
            >
                <FontAwesomeIcon icon={faCaretLeft} className="w-4 h-4" size="xl" />
            </button>

            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-blue-500"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            disabled={disabled}
                            className={cn(
                                "min-w-[32px] h-8 px-3 rounded transition-colors",
                                isActive
                                    ? "bg-blue-500 text-white font-semibold"
                                    : disabled
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-blue-500 border border-blue-200 hover:bg-blue-50"
                            )}
                            aria-label={`Ir a página ${pageNum}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                className={cn(
                    "p-2 rounded-full transition-colors",
                    currentPage === totalPages || disabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                )}
                aria-label="Página siguiente"
            >
                <FontAwesomeIcon icon={faCaretRight} className="w-4 h-4" size="xl" />
            </button>
        </div>
    );
};

export default Pagination;

