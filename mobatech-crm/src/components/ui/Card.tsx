import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", noPadding = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border glass-panel overflow-x-auto shadow-sm hover-lift ${
        noPadding ? "" : "p-6"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
