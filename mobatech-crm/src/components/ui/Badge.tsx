import React from "react";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-200",
  error: "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-200",
  neutral: "bg-gray-500/10 border-gray-500/20 text-gray-800 dark:text-gray-200",
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = "neutral", className = "", ...props }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
