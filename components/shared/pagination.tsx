"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/api.types";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, totalItems } = pagination;

  if (totalItems === 0) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
    >
      <span>
        Page {page} of {Math.max(totalPages, 1)} &middot; {totalItems} total
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex items-center gap-1 rounded-md border border-zinc-300 px-2.5 py-1.5 disabled:opacity-40 dark:border-zinc-700"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex items-center gap-1 rounded-md border border-zinc-300 px-2.5 py-1.5 disabled:opacity-40 dark:border-zinc-700"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
