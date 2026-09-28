// Generic screen for both "Shared With Me" (received) and "Shared By Me"
// (sent). Lives in components/, not app/, since it isn't a route itself —
// app/shared/index.tsx and app/shared/sent.tsx render it with a direction.
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    getReceivedSharedFiles,
    getSharedFileDetail,
    SharedFileDetail,
    SharedFileReceived,
} from "@/app/api/clients/shared";

import {
    getSentFileDetail,
    getSentSharedFiles,
    SentFileDetail,
    SharedFileSent,
} from "@/app/api/clients/sent";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export type SharedDirection = "received" | "sent";

type FilterType = "all" | "unread";

// Common shape the UI renders, regardless of which direction the data came
// from. All filtering/search/rendering below is direction-agnostic — only
// the normalize* functions and the two loadFiles/openDetail branches know
// about SharedFileReceived vs SharedFileSent.
interface DisplayFile {
  id: number;
  file_name: string;
  carrier_image: string;
  counterpart_username: string;
  is_read: boolean;
  can_download: boolean;
  shared_at: string;
}

interface DisplayDetail {
  file: number;
  file_name: string;
  carrier_image: string;
  counterpart_username: string;
  shared_at: string;
  can_download: boolean;
  decrypted_message: string | null;
}

function normalizeReceived(f: SharedFileReceived): DisplayFile {
  return {
    id: f.id,
    file_name: f.file_name,
    carrier_image: f.carrier_image,
    counterpart_username: f.shared_by_username,
    is_read: f.is_read,
    can_download: f.can_download,
    shared_at: f.shared_at,
  };
}

function normalizeSent(f: SharedFileSent): DisplayFile {
  return {
    id: f.id,
    file_name: f.file_name,
    carrier_image: f.carrier_image,
    counterpart_username: f.shared_with_username,
    is_read: f.is_read,
    can_download: f.can_download,
    shared_at: f.shared_at,
  };
}

function normalizeReceivedDetail(d: SharedFileDetail): DisplayDetail {
  return {
    file: d.file,
    file_name: d.file_name,
    carrier_image: d.carrier_image,
    counterpart_username: d.shared_by_username,
    shared_at: d.shared_at,
    can_download: d.can_download,
    decrypted_message: d.decrypted_message,
  };
}

function normalizeSentDetail(d: SentFileDetail): DisplayDetail {
  return {
    file: d.file,
    file_name: d.file_name,
    carrier_image: d.carrier_image,
    counterpart_username: d.shared_with_username,
    shared_at: d.shared_at,
    can_download: d.can_download,
    decrypted_message: d.decrypted_message,
  };
}

const COPY: Record<
  SharedDirection,
  {
    title: string;
    emptyTitle: string;
    emptySub: string;
    counterpartPrefix: string;
    unreadChipLabel: string;
  }
> = {
  received: {
    title: "Shared With Me",
    emptyTitle: "Nothing Shared Yet",
    emptySub: "Files others share with you will show up here",
    counterpartPrefix: "from",
    unreadChipLabel: "Unread",
  },
  sent: {
    title: "Shared By Me",
    emptyTitle: "Nothing Sent Yet",
    emptySub: "Files you share with others will show up here",
    counterpartPrefix: "to",
    unreadChipLabel: "Unseen",
  },
};

function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString();
}

/* ---------------- SCREEN ---------------- */
export default function SharedFilesScreen({
  direction,
}: {
  direction: SharedDirection;
}) {
  const copy = COPY[direction];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const [files, setFiles] = useState<DisplayFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [detail, setDetail] = useState<DisplayDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [revealed, setRevealed] = useState(false);

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const result =
      direction === "received"
        ? await getReceivedSharedFiles()
        : await getSentSharedFiles();

    if (result.status === "success" && result.data) {
      const normalized =
        direction === "received"
          ? (result.data as SharedFileReceived[]).map(normalizeReceived)
          : (result.data as SharedFileSent[]).map(normalizeSent);
      setFiles(normalized);
    } else {
      setError(result.message || "Could not load shared files.");
    }

    setIsLoading(false);
  }, [direction]);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [loadFiles]),
  );

  const filteredFiles = useMemo(() => {
    return files
      .filter((f) => f.file_name.toLowerCase().includes(search.toLowerCase()))
      .filter((f) => filter === "all" || !f.is_read);
  }, [files, search, filter]);

  const unreadCount = useMemo(
    () => files.filter((f) => !f.is_read).length,
    [files],
  );

  const openDetail = async (id: number) => {
    setModalVisible(true);
    setDetail(null);
    setDetailError("");
    setRevealed(false);
    setDetailLoading(true);

    const result =
      direction === "received"
        ? await getSharedFileDetail(id)
        : await getSentFileDetail(id);

    if (result.status === "success" && result.data) {
      const normalized =
        direction === "received"
          ? normalizeReceivedDetail(result.data as SharedFileDetail)
          : normalizeSentDetail(result.data as SentFileDetail);
      setDetail(normalized);
    } else {
      setDetailError(result.message || "Could not load this file.");
    }

    setDetailLoading(false);
  };

  const closeDetail = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1E2140" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{copy.title}</Text>
        <View style={styles.backBtn} />
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9AA3C7" />
        <TextInput
          placeholder="Search shared files..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "all" && styles.filterChipActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === "all" && styles.filterChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "unread" && styles.filterChipActive,
          ]}
          onPress={() => setFilter("unread")}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === "unread" && styles.filterChipTextActive,
            ]}
          >
            {copy.unreadChipLabel}
            {unreadCount > 0 ? ` (${unreadCount})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color="#D64545" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.emptyBox}>
            <ActivityIndicator size="large" color="#22C7B8" />
          </View>
        ) : filteredFiles.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="lock-closed-outline" size={60} color="#D0D5E5" />
            <Text style={styles.emptyTitle}>{copy.emptyTitle}</Text>
            <Text style={styles.emptySub}>{copy.emptySub}</Text>
          </View>
        ) : (
          filteredFiles.map((file) => (
            <SharedFileRow
              key={file.id}
              file={file}
              prefix={copy.counterpartPrefix}
              onPress={() => openDetail(file.id)}
            />
          ))
        )}
      </ScrollView>

      {/* DETAIL MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeDetail}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shared File</Text>
              <TouchableOpacity onPress={closeDetail}>
                <Ionicons name="close" size={24} color="#1E2140" />
              </TouchableOpacity>
            </View>

            {detailLoading ? (
              <View style={styles.emptyBox}>
                <ActivityIndicator size="large" color="#22C7B8" />
              </View>
            ) : detailError ? (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#D64545"
                />
                <Text style={styles.errorText}>{detailError}</Text>
              </View>
            ) : detail ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: detail.carrier_image }}
                  style={styles.carrierImage}
                />

                <View style={styles.senderRow}>
                  <View style={styles.senderAvatar}>
                    <Text style={styles.senderInitial}>
                      {detail.counterpart_username.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.senderName}>
                      {copy.counterpartPrefix} @{detail.counterpart_username}
                    </Text>
                    <Text style={styles.sharedAt}>
                      {new Date(detail.shared_at).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.detailFileName}>{detail.file_name}</Text>

                {/* REVEAL CARD */}
                <View style={styles.revealCard}>
                  {!revealed ? (
                    <TouchableOpacity
                      style={styles.revealBtn}
                      onPress={() => setRevealed(true)}
                      disabled={!detail.decrypted_message}
                    >
                      <Ionicons name="eye-outline" size={20} color="#fff" />
                      <Text style={styles.revealBtnText}>
                        {detail.decrypted_message
                          ? "Tap to Reveal Message"
                          : "No Hidden Message"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <View style={styles.revealHeaderRow}>
                        <Ionicons
                          name="lock-open-outline"
                          size={16}
                          color="#22C7B8"
                        />
                        <Text style={styles.revealHeaderText}>
                          Hidden message
                        </Text>
                        <TouchableOpacity onPress={() => setRevealed(false)}>
                          <Ionicons
                            name="eye-off-outline"
                            size={18}
                            color="#8F96B3"
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.decryptedText}>
                        {detail.decrypted_message}
                      </Text>
                    </View>
                  )}
                </View>

                {/* DOWNLOAD */}
                <TouchableOpacity
                  style={[
                    styles.downloadBtn,
                    !detail.can_download && styles.downloadBtnDisabled,
                  ]}
                  disabled={!detail.can_download}
                  onPress={() => {
                    // Wire this up to your existing file-download flow using detail.file
                  }}
                >
                  <Ionicons
                    name={
                      detail.can_download
                        ? "cloud-download-outline"
                        : "eye-outline"
                    }
                    size={20}
                    color={detail.can_download ? "#fff" : "#8F96B3"}
                  />
                  <Text
                    style={[
                      styles.downloadBtnText,
                      !detail.can_download && styles.downloadBtnTextDisabled,
                    ]}
                  >
                    {detail.can_download
                      ? "Download Original File"
                      : "View Only"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- ROW ---------------- */
function SharedFileRow({
  file,
  prefix,
  onPress,
}: {
  file: DisplayFile;
  prefix: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.fileCard} onPress={onPress}>
      <View style={styles.fileLeft}>
        <Image source={{ uri: file.carrier_image }} style={styles.thumb} />

        <View style={{ flexShrink: 1 }}>
          <View style={styles.nameRow}>
            {!file.is_read && <View style={styles.unreadDot} />}
            <Text style={styles.fileName} numberOfLines={1}>
              {file.file_name}
            </Text>
          </View>
          <Text style={styles.fileMeta}>
            {prefix} @{file.counterpart_username} ·{" "}
            {formatRelativeTime(file.shared_at)}
          </Text>
        </View>
      </View>

      <Ionicons
        name={file.can_download ? "download-outline" : "eye-outline"}
        size={20}
        color="#7B7B9D"
      />
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backBtn: {
    width: 32,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E2140",
  },

  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  filterChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5EAF3",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginRight: 10,
  },

  filterChipActive: {
    backgroundColor: "#5B7CFA",
    borderColor: "#5B7CFA",
  },

  filterChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#3A3F5C",
  },

  filterChipTextActive: {
    color: "#fff",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEC",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 8,
  },

  errorText: {
    color: "#D64545",
    fontSize: 13,
    flex: 1,
  },

  fileCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  fileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  thumb: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 12,
    backgroundColor: "#EEF0F6",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF5E8A",
    marginRight: 6,
  },

  fileName: {
    fontWeight: "700",
    maxWidth: 170,
    color: "#1E2140",
  },

  fileMeta: {
    color: "#8F96B3",
    fontSize: 12.5,
    marginTop: 2,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyTitle: {
    fontWeight: "700",
    marginTop: 10,
    color: "#1E2140",
  },

  emptySub: {
    color: "#8F96B3",
    textAlign: "center",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(30, 33, 64, 0.4)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#F5F7FB",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    maxHeight: "88%",
  },

  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0D5E5",
    alignSelf: "center",
    marginBottom: 14,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2140",
  },

  carrierImage: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    backgroundColor: "#EEF0F6",
    marginBottom: 16,
  },

  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5B7CFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  senderInitial: {
    color: "#fff",
    fontWeight: "700",
  },

  senderName: {
    fontWeight: "700",
    color: "#1E2140",
  },

  sharedAt: {
    color: "#8F96B3",
    fontSize: 12.5,
    marginTop: 1,
  },

  detailFileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A3F5C",
    marginBottom: 16,
  },

  revealCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  revealBtn: {
    backgroundColor: "#22C7B8",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  revealBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  revealHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },

  revealHeaderText: {
    color: "#8F96B3",
    fontSize: 12.5,
    fontWeight: "600",
    flex: 1,
  },

  decryptedText: {
    fontSize: 15,
    color: "#1E2140",
    lineHeight: 22,
  },

  downloadBtn: {
    backgroundColor: "#5B7CFA",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  downloadBtnDisabled: {
    backgroundColor: "#EEF0F6",
  },

  downloadBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  downloadBtnTextDisabled: {
    color: "#8F96B3",
  },
});
