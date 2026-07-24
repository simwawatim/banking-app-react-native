import { ApiResponse } from "../api";
import { authClient } from "../client";

export interface Folder {
  id: number;
  folder_name: string;
  created_at: string;
}

export interface CreateFolderPayload {
  folder_name: string;
}

export interface UpdateFolderPayload {
  folder_name: string;
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

export const getFolders = () => unwrap<Folder[]>(authClient.get("/folders/"));

export const getFolder = (id: number) =>
  unwrap<Folder>(authClient.get(`/folders/${id}/`));

export const createFolder = (payload: CreateFolderPayload) =>
  unwrap<Folder>(authClient.post("/folders/create/", payload));

export const updateFolder = (id: number, payload: UpdateFolderPayload) =>
  unwrap<Folder>(authClient.patch(`/folders/${id}/`, payload));

export const deleteFolder = (id: number) =>
  unwrap<Folder>(authClient.delete(`/folders/${id}/`));
