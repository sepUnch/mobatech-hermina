import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { LoginResponseData } from "@/types/api";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ showToast }: { showToast: (msg: string, type: "success"|"error"|"warning") => void }) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      showToast(APP_STRINGS.login.emptyFieldsError, "warning");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast(APP_STRINGS.login.invalidEmailError, "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await api.post<LoginResponseData>("/api/auth/login", { email, password });
      
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.data.token }),
      });

      setAuth(res.data.token, res.data.user);
      showToast(APP_STRINGS.login.successMessage, "success");
      setTimeout(() => router.replace("/dashboard"), 1500);
    } catch (err) {
      setLoading(false);
      if (err instanceof ApiError) {
        const errorMsg = APP_STRINGS.errors[err.code as keyof typeof APP_STRINGS.errors] || err.message;
        showToast(errorMsg, "error");
      } else {
        showToast(APP_STRINGS.login.networkError, "error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider">
          {APP_STRINGS.login.emailLabel}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contoh@herminahospitals.com"
          className="w-full h-11 px-4 rounded-xl border glass-input text-sm text-foreground"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider">
          {APP_STRINGS.login.passwordLabel}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contoh: Password123!"
            className="w-full h-11 pl-4 pr-10 rounded-xl border glass-input text-sm text-foreground"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/50 hover:text-foreground/80"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-xl transition-all duration-200 shadow-md flex items-center justify-center disabled:opacity-50 cursor-pointer"
      >
        {loading ? APP_STRINGS.login.submittingButton : APP_STRINGS.login.submitButton}
      </button>
    </form>
  );
}
