"use client";
import React from "react";

interface SkeletonTableProps {
  columns: number;
  rows?: number;
}

export function SkeletonTable({ columns, rows = 5 }: SkeletonTableProps) {
  return (
    <div className="w-full overflow-hidden glass-panel rounded-2xl border border-glass-border/50 animate-pulse">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={`th-${i}`} className="py-4 px-4">
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded-md w-3/4"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={`tr-${rowIndex}`} className="border-b border-glass-border/30">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={`td-${rowIndex}-${colIndex}`} className="py-4 px-4">
                  <div 
                    className="h-4 bg-black/5 dark:bg-white/5 rounded-md" 
                    style={{ width: `${Math.random() * 40 + 40}%` }}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
