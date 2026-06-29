export const Formatters = {
  phone: (raw: string | undefined | null): string => {
    if (!raw) return "-";
    let val = raw.replace(/\D/g, "");
    if (val.startsWith("62")) {
      val = val.slice(2);
    } else if (val.startsWith("0")) {
      val = val.slice(1);
    } else if (raw.startsWith("+62")) {
      val = raw.slice(3).replace(/\D/g, "");
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
        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      case "long":
        return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      case "weekday":
        return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      case "datetime":
        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
      default:
        return d.toLocaleDateString("id-ID");
    }
  }
};
