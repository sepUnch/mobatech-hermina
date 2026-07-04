"use client";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 glass-panel p-2 rounded-2xl w-max mx-auto shadow-sm animate-slide-in">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-9 w-9 p-0 rounded-xl"
      >
        <ChevronLeft size={16} />
      </Button>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 p-0 rounded-xl font-medium transition-all duration-300 ${page === currentPage ? 'shadow-md scale-105' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            {page}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-9 w-9 p-0 rounded-xl"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
