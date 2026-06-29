import React from "react";
import { Filter } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Filter...",
  className = "" 
}) => {
  return (
    <div className={`relative flex items-center w-full max-w-[200px] rounded-xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-[#172A1E]/80 backdrop-blur-[12px] saturate-[180%] shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-primary/50 ${className}`}>
      <div className="pl-3 py-2.5 text-foreground/50 pointer-events-none">
        <Filter className="w-4 h-4" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2.5 pl-2 pr-8 bg-transparent border-none outline-none text-sm text-foreground appearance-none cursor-pointer"
      >
        <option value="" className="bg-background text-foreground">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-background text-foreground">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 pointer-events-none text-foreground/50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
};
