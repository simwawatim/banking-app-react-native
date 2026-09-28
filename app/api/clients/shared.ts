import { authClient, unwrap } from "./base";

export interface SharedFileReceived {
  id: number;
  file_name: string;
  carrier_image: string;
  shared_by_username: string;
  is_read: boolean;
  can_download: boolean;
  shared_at: string;
}

export interface SharedFileDetail {
  file: number;
  file_name: string;
  carrier_image: string;
  shared_by_username: string;
  shared_at: string;
  can_download: boolean;
  decrypted_message: string | null;
}

export const getReceivedSharedFiles = () =>
  unwrap<SharedFileReceived[]>(authClient.get("/shared-files/received/"));

export const getSharedFileDetail = (id: number) =>
  unwrap<SharedFileDetail>(authClient.get(`/shared-files/received/${id}/`));
