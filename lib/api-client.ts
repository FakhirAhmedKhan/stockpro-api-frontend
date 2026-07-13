import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "@/lib/auth-storage";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface BackendErrorBody {
  message?: string | string[];
  error?: string;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "The request could not be processed. Please check the form and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "The requested resource was not found.",
  409: "This conflicts with existing data.",
  429: "Too many attempts. Please try again shortly.",
  500: "Something went wrong on our end. Please try again.",
};

function extractMessage(status: number, body?: BackendErrorBody): string {
  if (body?.message) {
    return Array.isArray(body.message) ? body.message.join(" ") : body.message;
  }
  return STATUS_MESSAGES[status] ?? "An unexpected error occurred.";
}

function extractFieldErrors(body?: BackendErrorBody): Record<string, string[]> | undefined {
  if (!body?.message || !Array.isArray(body.message)) return undefined;
  const fieldErrors: Record<string, string[]> = {};
  for (const entry of body.message) {
    const [field] = entry.split(" ");
    const key = field && /^[a-zA-Z0-9_.]+$/.test(field) ? field : "form";
    if (!fieldErrors[key]) fieldErrors[key] = [];
    fieldErrors[key].push(entry);
  }
  return fieldErrors;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorBody>) => {
    if (!error.response) {
      const networkError: ApiError = {
        status: 0,
        message: "Unable to reach the server. Check your connection and try again.",
        isNetworkError: true,
      };
      return Promise.reject(networkError);
    }

    const { status, data } = error.response;

    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined" && window.location.pathname !== ROUTES.login) {
        window.location.href = ROUTES.login;
      }
    }

    const apiError: ApiError = {
      status,
      message: extractMessage(status, data),
      fieldErrors: status === 400 ? extractFieldErrors(data) : undefined,
    };

    return Promise.reject(apiError);
  },
);
