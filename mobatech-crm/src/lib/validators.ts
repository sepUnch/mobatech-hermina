const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.(com|id|co\.id|net|org|ac\.id|go\.id|sch\.id)$/i;
const NAME_REGEX = /^[a-zA-Z\s'.,-]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
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
    let cleanPhone = e62.replace(/[^\d+]/g, "");
    if (cleanPhone.startsWith("+62")) cleanPhone = cleanPhone.substring(3);
    else if (cleanPhone.startsWith("62")) cleanPhone = cleanPhone.substring(2);
    else if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
    
    const digits = cleanPhone.replace(/\D/g, "");
    if (!digits) return "Nomor HP tidak boleh kosong.";
    if (digits.length < PHONE_DIGITS_MIN) return "Nomor HP terlalu pendek.";
    if (digits.length > PHONE_DIGITS_MAX) return "Nomor HP terlalu panjang.";
    return null;
  },

  password: (value: string): string | null => {
    if (!value.trim()) return "Kata sandi tidak boleh kosong.";
    if (!PASSWORD_REGEX.test(value)) return "Kata sandi terlalu lemah (Min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka).";
    return null;
  },

  required: (value: string, label: string): string | null => {
    if (!value.trim()) return `${label} tidak boleh kosong.`;
    return null;
  },
} as const;
