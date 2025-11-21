import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { AxiosResponse } from "axios";
import { BASE_URL } from "./endpoints";
import { useNavigate } from "react-router-dom";

export interface ApiResponse<T> {
  status: string;
  message: string;
  status_code: number;
  data: T;
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // Only return .data to simplify all consumers
    if (response.status === 200) {
      return response;
    }
    return response;
  },

  (error: AxiosError<ApiResponse<null>>) => {
    if (!error.response) {
      toast.error("Network error! Please check your connection.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message =
      error.response.data?.message || "Unexpected error occurred.";

    switch (status) {
      case 401:
        toast.error(message || "Authentication failed.");
        // will remove all cache
        clearLocalMetaData();
        window.location.href = "/";
        break;
      case 422:
        toast.error(message || "Validation error.");
        break;
      case 500:
        toast.error("Internal server error. Please try again later.");
        break;
      case 550:
        toast.error("Custom server error occurred.");
        break;
      default:
        toast.error(message);
        break;
    }

    return Promise.reject(error);
  },
);

function clearLocalMetaData() {
  localStorage.clear();
}

export async function postApi<T>(
  url: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("authToken");

  const response = await api.post<ApiResponse<T>>(url, body, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
}

export async function getApi<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("authToken");
  const response = await api.get<ApiResponse<T>>(url, {
    params,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
}
