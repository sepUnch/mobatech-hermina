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
  }
};
