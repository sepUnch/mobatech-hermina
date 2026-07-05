import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from "@/store/useAuthStore";
import { encryptData, decryptData } from "./crypto";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export interface PaginationMeta {
  current_page: number;
  limit: number;
  total_pages: number;
  total_data: number;
}
export interface ApiResponse<T = unknown> {
  success?: boolean;
  status?: string;
  code?: string;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}
export class ApiError extends Error {
  code: string;
  status: number;
  errors?: unknown;
  constructor(code: string, status: number, message: string, errors?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.errors = errors;
    this.name = "ApiError";
  }
}
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});
export interface CustomRequestConfig extends AxiosRequestConfig {
  securePayload?: boolean;
}
interface CustomInternalConfig extends InternalAxiosRequestConfig {
  securePayload?: boolean;
}
axiosInstance.interceptors.request.use(async (config: CustomInternalConfig) => {
  let token = useAuthStore.getState().token;
  if (!token && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("hermina-crm-auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.state?.token;
      }
    } catch (e) {
      console.error("Failed to read token from localStorage", e);
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.securePayload && config.data) {
    try {
      const stringData = JSON.stringify(config.data);
      const encrypted = await encryptData(stringData);
      config.data = { encrypted_payload: encrypted };
    } catch (e) {
      console.error("Encryption failed in interceptor:", e);
    }
  }
  return config;
}, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use(
  async (response) => {
    if (response.data && response.data.encrypted_payload) {
      try {
        const decryptedStr = await decryptData(response.data.encrypted_payload);
        response.data = JSON.parse(decryptedStr);
      } catch (e) {
        console.error("Decryption failed for response payload", e);
      }
    }
    const normalizeKeys = (obj: unknown): unknown => {
      if (Array.isArray(obj)) return obj.map(normalizeKeys);
      else if (obj !== null && typeof obj === "object") {
        const newObj: Record<string, unknown> = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let newKey = key;
            if (key === "ID") newKey = "id";
            else if (key === "CreatedAt") newKey = "created_at";
            else if (key === "UpdatedAt") newKey = "updated_at";
            else if (key === "DeletedAt") newKey = "deleted_at";
            newObj[newKey] = normalizeKeys((obj as Record<string, unknown>)[key]);
          }
        }
        return newObj;
      }
      return obj;
    };
    response.data = normalizeKeys(response.data);
    return response;
  },
  (error: AxiosError<unknown>) => {
    const status = error.response?.status || 500;
    const responseData = (error.response?.data || {}) as Record<string, unknown>;
    let errorCode = (responseData.code as string) || "INTERNAL_ERROR";
    if (!responseData.code) {
      switch (status) {
        case 401: errorCode = "UNAUTHENTICATED"; break;
        case 403: errorCode = "UNAUTHORIZED"; break;
        case 404: errorCode = "NOT_FOUND"; break;
        case 409: errorCode = "CONFLICT"; break;
        case 422: errorCode = "VALIDATION_ERROR"; break;
      }
    }
    const errorMessage = (responseData.message as string) || error.message || "Terjadi kesalahan koneksi.";
    return Promise.reject(new ApiError(errorCode, status, errorMessage, responseData.errors));
  }
);
export const api = {
  get: async <T>(path: string, options?: CustomRequestConfig): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.get<ApiResponse<T>>(path, options);
    return res.data;
  },
  post: async <T>(path: string, body: unknown, options?: CustomRequestConfig): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.post<ApiResponse<T>>(path, body, options);
    return res.data;
  },
  put: async <T>(path: string, body: unknown, options?: CustomRequestConfig): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.put<ApiResponse<T>>(path, body, options);
    return res.data;
  },
  delete: async <T>(path: string, options?: CustomRequestConfig): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.delete<ApiResponse<T>>(path, options);
    return res.data;
  }
};
