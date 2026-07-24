import { authClient } from "../client";

export interface ApiResponse<T> {
  status: "success" | "fail";
  message: string;
  data: T | null;
}

export interface UserRecord {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function unwrap<T>(
  request: Promise<{ data: ApiResponse<T> }>,
): Promise<ApiResponse<T>> {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<T>;
    }

    return {
      status: "fail",
      message:
        "Unable to reach the server. Check your connection and try again.",
      data: null,
    };
  }
}

export const getUsers = (
  page: number = 1,
  pageSize?: number,
): Promise<ApiResponse<PaginatedResponse<UserRecord>>> => {
  if (!Number.isFinite(page) || page <= 0) {
    console.warn(
      `getUsers() called with invalid page (${page}) — request blocked. Call stack:`,
      new Error().stack,
    );

    return Promise.resolve({
      status: "fail",
      message: "Invalid page number.",
      data: null,
    });
  }

  const params: Record<string, number> = { page };
  if (pageSize) {
    params.page_size = pageSize;
  }

  return unwrap<PaginatedResponse<UserRecord>>(
    authClient.get("/users/", { params }),
  );
};

export const getUser = (id: number): Promise<ApiResponse<UserRecord>> => {
  if (!Number.isFinite(id) || id <= 0) {
    console.warn(
      `getUser() called with invalid id (${id}) — request blocked. Call stack:`,
      new Error().stack,
    );

    return Promise.resolve({
      status: "fail",
      message: "Invalid user id.",
      data: null,
    });
  }

  return unwrap<UserRecord>(authClient.get(`/users/${id}/`));
};
