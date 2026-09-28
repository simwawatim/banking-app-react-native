import { authClient } from "../client"; // adjust this path if authClient lives elsewhere

export interface ApiResponse<T> {
  status: "success" | "fail";
  message: string;
  data: T | null;
}

export async function unwrap<T>(
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

export { authClient };
