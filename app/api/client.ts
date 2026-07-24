import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const API_BASE_URL = "http://192.168.100.45:8000/api/v1";

export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authClient.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(authClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      const { data } = await publicClient.post("/token/refresh/", {
        refresh: refreshToken,
      });

      const newAccessToken = data.data.access;
      await AsyncStorage.setItem("access_token", newAccessToken);

      pendingRequests.forEach((callback) => callback(newAccessToken));
      pendingRequests = [];

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return authClient(originalRequest);
    } catch (refreshError) {
      await AsyncStorage.multiRemove(["access_token", "refresh_token", "user"]);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export interface AuthUser {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
}

export interface ApiResult<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
}

async function unwrap<T>(
  request: Promise<{ data: ApiResult<T> }>,
): Promise<ApiResult<T>> {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    const responseData = error?.response?.data;

    return {
      status: "error",
      message:
        responseData?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
      data: responseData?.data,
    };
  }
}

export const getProfile = () => unwrap<AuthUser>(authClient.get("/profile/"));

export const updateProfile = (payload: UpdateProfilePayload) =>
  unwrap<AuthUser>(authClient.patch("/profile/update/", payload));

export const updateProfilePicture = (formData: FormData) =>
  unwrap<AuthUser>(
    authClient.patch("/profile/picture/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
export interface RecentFile {
  id: number;
  name: string;
  size: string;
  size_bytes: number;
  icon: string;
  status: "pending" | "processing" | "completed" | "failed";
  folder_id: number;
  folder_name: string;
  uploaded_at: string;
}

export interface StorageStats {
  used_bytes: number;
  used_readable: string;
  max_bytes: number;
  max_readable: string;
  percent_used: number;
}

export interface DashboardStats {
  total_folders: number;
  total_files: number;
  shared_people: number;
  storage: StorageStats;
  recent_files: RecentFile[];
}

export const getDashboardStats = () =>
  unwrap<DashboardStats>(authClient.get("/dashboard/stats/"));
