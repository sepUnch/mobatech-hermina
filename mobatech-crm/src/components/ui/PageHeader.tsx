import React from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-foreground/60 text-sm mt-1">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};
