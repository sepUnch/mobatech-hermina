import React from "react";
import { Search } from "lucide-react";

export interface SearchFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  value,
  onChange,
  placeholder = "Ketik untuk mencari...",
  className = "",
}) => {
  const [localValue, setLocalValue] = React.useState(value || "");

  React.useEffect(() => {
     
    setLocalValue(value || "");
  }, [value]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (value !== localValue) {
        onChange(localValue);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  return (
    <div
      className={`relative flex items-center w-full max-w-sm rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:[background-color:var(--color-dark-panel)] backdrop-blur-[12px] saturate-[180%] shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-primary/50 overflow-hidden ${className}`}
    >
      <div className="pl-3 pr-2 py-2.5 text-foreground/50">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 pr-4 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground/40"
      />
    </div>
  );
};
