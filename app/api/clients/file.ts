import { authClient } from "../client";

export interface ApiResponse<T> {
  status: "success" | "fail";
  message: string;
  data: T | null;
}

export interface FileRecord {
  id: number;
  file: string;
  original_name: string;
  uploaded_at: string;
  folder: number;
}

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string | null;
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

async function unwrapNoBody(
  request: Promise<{ status: number }>,
  successMessage: string,
): Promise<ApiResponse<null>> {
  try {
    await request;
    return { status: "success", message: successMessage, data: null };
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<null>;
    }

    return {
      status: "fail",
      message:
        "Unable to reach the server. Check your connection and try again.",
      data: null,
    };
  }
}

export const getFiles = () => unwrap<FileRecord[]>(authClient.get("/files/"));

export const deleteFile = (id: number) =>
  unwrapNoBody(authClient.delete(`/files/${id}/delete/`), "File deleted");

export const uploadFiles = (
  folder: number,
  files: PickedFile[],
  onUploadProgress?: (percent: number) => void,
) => {
  const formData = new FormData();
  formData.append("folder", String(folder));

  files.forEach((file) => {
    formData.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? "application/octet-stream",
    } as any);
  });

  return unwrap<FileRecord[]>(
    authClient.post("/files/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (!onUploadProgress || !event.total) return;
        onUploadProgress(Math.round((event.loaded / event.total) * 100));
      },
    }),
  );
};

export const getFile = (id: number): Promise<ApiResponse<FileRecord>> => {
  if (!Number.isFinite(id) || id <= 0) {
    console.warn(
      `getFile() called with invalid id (${id}) — request blocked. Call stack:`,
      new Error().stack,
    );

    return Promise.resolve({
      status: "fail",
      message: "Invalid file id.",
      data: null,
    });
  }

  return unwrap<FileRecord>(authClient.get(`/files/${id}/`));
};
export interface ShareSecretPayload {
  file: number;
  recipientUsername: string;
  message: string;
  carrierImage: PickedFile;
  canDownload?: boolean;
}

export const shareSecretFile = (
  payload: ShareSecretPayload,
): Promise<ApiResponse<unknown>> => {
  const formData = new FormData();
  formData.append("file", String(payload.file));
  formData.append("recipient_username", payload.recipientUsername);
  formData.append("message", payload.message);
  formData.append("carrier_image", {
    uri: payload.carrierImage.uri,
    name: payload.carrierImage.name,
    type: payload.carrierImage.mimeType ?? "image/jpeg",
  } as any);
  formData.append("can_download", String(payload.canDownload ?? true));

  return unwrap<unknown>(
    authClient.post("/files/share-secret/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
};