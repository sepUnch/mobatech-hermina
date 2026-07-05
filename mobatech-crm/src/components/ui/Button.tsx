import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md border border-transparent",
  secondary: "bg-white/50 dark:bg-black/20 text-foreground hover:bg-white/80 dark:hover:bg-white/10 border border-glass-border shadow-sm",
  danger: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/20 shadow-sm",
  ghost: "bg-transparent text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground border border-transparent",
  outline: "bg-transparent text-primary border border-primary/30 hover:bg-primary/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-11 px-4 text-sm rounded-xl gap-2",
  lg: "h-14 px-6 text-base rounded-2xl gap-3",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", icon, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children && <span>{children}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";
