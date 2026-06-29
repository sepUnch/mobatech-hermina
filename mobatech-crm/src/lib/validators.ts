const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.(com|id|co\.id|net|org|ac\.id|go\.id|sch\.id)$/i;
const NAME_REGEX = /^[a-zA-Z\s'.,-]+$/;
const PHONE_DIGITS_MIN = 7;
const PHONE_DIGITS_MAX = 12;

export const FormValidators = {
  name: (value: string): string | null => {
    if (!value.trim()) return "Nama tidak boleh kosong.";
    if (!NAME_REGEX.test(value)) return "Nama tidak boleh mengandung angka atau karakter khusus.";
    return null;
  },

  email: (value: string): string | null => {
    if (!value.trim()) return "Email tidak boleh kosong.";
    if (!EMAIL_REGEX.test(value)) return "Format email tidak valid. Gunakan domain yang benar (contoh: .com, .id).";
    return null;
  },

  phone: (e62: string): string | null => {
    const digits = e62.replace("+62", "").replace(/\D/g, "");
    if (!digits) return "Nomor HP tidak boleh kosong.";
    if (digits.length < PHONE_DIGITS_MIN) return "Nomor HP terlalu pendek.";
    if (digits.length > PHONE_DIGITS_MAX) return "Nomor HP terlalu panjang.";
    return null;
  },

  required: (value: string, label: string): string | null => {
    if (!value.trim()) return `${label} tidak boleh kosong.`;
    return null;
  },
} as const;
