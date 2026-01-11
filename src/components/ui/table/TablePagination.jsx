"use client";

import { cn } from "../../../utils";
import Button from "../Button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export function TablePagination({ table }) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const generatePaginationItems = () => {
    const items = [];
    const ellipsis = "...";

    // Always show first page
    items.push(1);

    if (currentPage <= 4) {
      // Show first 5 pages
      for (let i = 2; i <= Math.min(5, pageCount - 1); i++) {
        items.push(i);
      }
      if (pageCount > 6) items.push(ellipsis);
    } else if (currentPage >= pageCount - 3) {
      // Show last 5 pages
      if (pageCount > 6) items.push(ellipsis);
      for (let i = Math.max(pageCount - 4, 2); i < pageCount; i++) {
        items.push(i);
      }
    } else {
      // Show current page and neighbors
      items.push(ellipsis);
      items.push(currentPage - 1, currentPage, currentPage + 1);
      if (pageCount > currentPage + 3) items.push(ellipsis);
    }

    // Always show last page
    if (pageCount !== 1) {
      items.push(pageCount);
    }

    return items;
  };

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center space-x-2">
        {generatePaginationItems().map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-sm text-gray-500"
              >
                {item}
              </span>
            );
          }

          const pageNumber = item;
          return (
            <button
              key={pageNumber}
              onClick={() => table.setPageIndex(pageNumber - 1)}
              className={cn(
                "px-3 py-1 text-sm rounded-md min-w-8",
                currentPage === pageNumber
                  ? "bg-blue-700 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={cn(
            "p-2 rounded-md inline-flex items-center gap-2",
            !table.getCanPreviousPage()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-slate-100"
          )}
        >
          <LuChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={cn(
            "p-2 rounded-md inline-flex items-center gap-2",
            !table.getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          <span>Next</span>
          <LuChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
