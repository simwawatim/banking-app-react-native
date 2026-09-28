import { authClient } from "../client";
import { unwrap } from "./base";

export interface SharedFileSent {
  id: number;
  file_name: string;
  carrier_image: string;
  shared_with_username: string;
  is_read: boolean;
  can_download: boolean;
  shared_at: string;
}

export interface SentFileDetail {
  file: number;
  file_name: string;
  carrier_image: string;
  shared_with_username: string;
  shared_at: string;
  can_download: boolean;
  decrypted_message: string | null;
}

export const getSentSharedFiles = () =>
  unwrap<SharedFileSent[]>(authClient.get("/shared-files/sent/"));

export const getSentFileDetail = (id: number) =>
  unwrap<SentFileDetail>(authClient.get(`/shared-files/sent/${id}/`));
