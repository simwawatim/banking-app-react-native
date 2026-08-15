import { authClient } from "../client";

export interface ApiResponse<T> {
  status: "success" | "fail";
  message: string;
  data: T | null;
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

export interface SharedFileReceived {
  id: number;
  file: number;
  file_name: string;
  shared_by: number;
  shared_by_username: string;
  shared_with: number;
  shared_with_username: string;
  can_download: boolean;
  carrier_image: string;
  is_read: boolean;
  shared_at: string;
}

export interface SharedFileDetail extends SharedFileReceived {
  decrypted_message?: string;
}

export const getReceivedSharedFiles = () =>
  unwrap<SharedFileReceived[]>(authClient.get("/shared-files/received/"));

export const getSharedFileDetail = (
  id: number,
): Promise<ApiResponse<SharedFileDetail>> => {
  if (!Number.isFinite(id) || id <= 0) {
    console.warn(
      `getSharedFileDetail() called with invalid id (${id}) — request blocked. Call stack:`,
      new Error().stack,
    );

    return Promise.resolve({
      status: "fail",
      message: "Invalid shared file id.",
      data: null,
    });
  }

  return unwrap<SharedFileDetail>(authClient.get(`/shared-files/${id}/`));
};
