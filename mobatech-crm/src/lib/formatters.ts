/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const Formatters = {
  phone: (raw: string | undefined | null): string => {
    if (!raw) return "-";
    let val = raw.replace(/\D/g, "");
    if (val.startsWith("62")) {
      val = val.slice(2);
    }
    
    if (val.startsWith("0")) {
      val = val.slice(1);
    }
    
    if (!val) return "-";
    if (val.length <= 3) return `+62 ${val}`;
    if (val.length <= 7) return `+62 ${val.slice(0, 3)}-${val.slice(3)}`;
    if (val.length <= 11) return `+62 ${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
    return `+62 ${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 12)}`;
  },

  currency: (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) return "Rp 0";
    return `Rp ${amount.toLocaleString("id-ID")}`;
  },

  date: (dateVal: string | Date | undefined | null, format: "short" | "long" | "datetime" | "weekday" = "short"): string => {
    if (!dateVal) return "-";
    const d = new Date(dateVal);
    
    switch (format) {
      case "short":
        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
      case "long":
        return d.toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
      case "weekday":
        return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
      case "datetime":
        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
      default:
        return d.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });
    }
  }
};
