"use client";
import { useRef } from "react";
import { Phone } from "lucide-react";
import { APP_STRINGS } from "@/lib/constants";

const COUNTRY_CODE = "+62";

function toDisplayFormat(digits: string): string {
  if (!digits) return "";
  const d = digits.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 12)}`;
}

function stripLeadingZeroOrCode(raw: string): string {
  let val = raw.trim();
  if (val.startsWith("+62")) val = val.slice(3);
  else if (val.startsWith("62")) val = val.slice(2);
  if (val.startsWith("0")) val = val.slice(1);
  return val.replace(/\D/g, "");
}

export function PhoneInput({
  value,
  onChange,
  disabled,
  className,
}: {
  value: string;
  onChange: (e62: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const rawDigits = stripLeadingZeroOrCode(value.replace(COUNTRY_CODE, "").replace(/\s/g, ""));
  const displayValue = toDisplayFormat(rawDigits);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = stripLeadingZeroOrCode(e.target.value);
    const limited = stripped.slice(0, 12);
    onChange(`${COUNTRY_CODE}${limited}`);
  };

  return (
    <div className={`flex items-center border glass-input rounded-xl overflow-hidden focus-within:border-primary transition-all h-10 ${className ?? ""}`}>
      <span className="flex items-center gap-1.5 px-3 text-sm font-medium text-foreground/60 border-r border-glass-border h-full whitespace-nowrap bg-black/5 dark:bg-white/5 select-none">
        <Phone size={14} />
        {COUNTRY_CODE}
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={displayValue}
        onChange={handleChange}
        placeholder={APP_STRINGS.common.phonePlaceholder}
        className="flex-1 px-3 h-full bg-transparent outline-none text-sm text-foreground"
      />
    </div>
  );
}
