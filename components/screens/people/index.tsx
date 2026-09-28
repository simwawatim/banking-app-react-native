import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FileRecord, getFiles, shareSecretFile } from "@/api/clients/file";
import { getUsers, UserRecord } from "@/api/clients/user";

export default function PeopleScreen() {
  const [people, setPeople] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  const [myFiles, setMyFiles] = useState<FileRecord[]>([]);
  const [loadingMyFiles, setLoadingMyFiles] = useState(false);
  const [fileSearch, setFileSearch] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [canDownload, setCanDownload] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async (pageToLoad: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError("");

    const result = await getUsers(pageToLoad);

    if (result.status === "success" && result.data) {
      const data = result.data;

      setPeople((prev) => (append ? [...prev, ...data.results] : data.results));
      setHasNext(Boolean(data.next));
      setPage(pageToLoad);
    } else {
      setError(result.message || "Could not load people.");
    }

    if (append) {
      setIsLoadingMore(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(1, false);
  }, [loadUsers]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasNext) return;
    loadUsers(page + 1, true);
  };

  const removePerson = (id: number) => {
    Alert.alert("Remove Person", "Remove this contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setPeople((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  };

  const filteredPeople = useMemo(() => {
    const q = search.toLowerCase();
    return people.filter((p) => {
      const name = displayName(p).toLowerCase();
      return name.includes(q) || p.email.toLowerCase().includes(q);
    });
  }, [people, search]);

  const filteredMyFiles = useMemo(() => {
    const q = fileSearch.toLowerCase();
    return myFiles.filter((f) => f.original_name.toLowerCase().includes(q));
  }, [myFiles, fileSearch]);

  /* ---- SHARE FLOW ---- */
  const openShareModal = async (user: UserRecord) => {
    setSelectedUser(user);
    setShareModalVisible(true);
    setSelectedFileId(null);
    setFileSearch("");
    setMessage("");
    setCanDownload(true);

    setLoadingMyFiles(true);
    const result = await getFiles();
    if (result.status === "success" && result.data) {
      setMyFiles(result.data);
    } else {
      setMyFiles([]);
      Alert.alert("Error", result.message || "Could not load your files.");
    }
    setLoadingMyFiles(false);
  };

  const closeShareModal = () => {
    setShareModalVisible(false);
    setSelectedUser(null);
  };

  const handleShare = async () => {
    if (!selectedUser) return;

    if (!selectedFileId) {
      Alert.alert("Select a file", "Choose which of your files to share.");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Message required", "Enter a message for the recipient.");
      return;
    }

    setSubmitting(true);

    const result = await shareSecretFile({
      file: selectedFileId,
      recipientUsername: selectedUser.username,
      message: message.trim(),
      canDownload,
    });

    setSubmitting(false);

    if (result.status === "success") {
      Alert.alert("Shared", `File shared with ${selectedUser.username}.`);
      closeShareModal();
    } else {
      Alert.alert("Error", result.message || "Could not share the file.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>People</Text>

        <View style={styles.iconButtonPlaceholder} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8F96B3" />
        <TextInput
          placeholder="Search people..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
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
        ) : filteredPeople.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={60} color="#D0D5E5" />
            <Text style={styles.emptyTitle}>No People Found</Text>
            <Text style={styles.emptySub}>Try a different search</Text>
          </View>
        ) : (
          <>
            <View style={styles.menuContainer}>
              {filteredPeople.map((item) => (
                <PeopleItem
                  key={item.id}
                  item={item}
                  onPress={() => openShareModal(item)}
                  onDelete={() => removePerson(item.id)}
                />
              ))}
            </View>

            {hasNext && !search ? (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <ActivityIndicator size="small" color="#5B7CFA" />
                ) : (
                  <Text style={styles.loadMoreText}>Load More</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </ScrollView>

      {/* SHARE MODAL */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeShareModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeShareModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Share with {selectedUser ? displayName(selectedUser) : ""}
                </Text>
                <TouchableOpacity onPress={closeShareModal}>
                  <Ionicons name="close" size={24} color="#1B1D4D" />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Choose a file</Text>

              <View style={styles.fileSearchBox}>
                <Ionicons name="search" size={16} color="#8F96B3" />
                <TextInput
                  placeholder="Search your files..."
                  value={fileSearch}
                  onChangeText={setFileSearch}
                  style={styles.fileSearchInput}
                />
              </View>

              {loadingMyFiles ? (
                <ActivityIndicator
                  size="small"
                  color="#22C7B8"
                  style={{ marginVertical: 10 }}
                />
              ) : filteredMyFiles.length === 0 ? (
                <Text style={[styles.emptySub, { marginBottom: 16 }]}>
                  {myFiles.length === 0
                    ? "You have no files to share."
                    : "No files match your search."}
                </Text>
              ) : (
                <ScrollView
                  style={styles.fileList}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {filteredMyFiles.map((f) => {
                    const active = selectedFileId === f.id;
                    return (
                      <TouchableOpacity
                        key={f.id}
                        style={[styles.fileRow, active && styles.fileRowActive]}
                        onPress={() => setSelectedFileId(f.id)}
                      >
                        <Text
                          style={[
                            styles.fileRowText,
                            active && styles.fileRowTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {f.original_name}
                        </Text>
                        {active && (
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#fff"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <Text style={styles.fieldLabel}>Message</Text>
              <TextInput
                placeholder="Write a message..."
                value={message}
                onChangeText={setMessage}
                multiline
                style={styles.messageInput}
              />

              <View style={styles.switchRow}>
                <Text style={styles.fieldLabel}>
                  Allow recipient to download
                </Text>
                <Switch value={canDownload} onValueChange={setCanDownload} />
              </View>

              <TouchableOpacity
                style={[styles.shareBtn, submitting && { opacity: 0.7 }]}
                onPress={handleShare}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.shareBtnText}>Share</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function displayName(user: UserRecord) {
  const full = `${user.first_name} ${user.last_name}`.trim();
  return full || user.username;
}

/* PEOPLE ITEM */
function PeopleItem({
  item,
  onPress,
  onDelete,
}: {
  item: UserRecord;
  onPress: () => void;
  onDelete: () => void;
}) {
  const name = displayName(item);
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        {/* Avatar */}
        <View style={styles.avatar}>
          {item.profile_picture ? (
            <Image
              source={{ uri: item.profile_picture }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>

        <View>
          <Text style={styles.menuText}>{name}</Text>
          <Text style={styles.statusText}>{item.email}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash" size={18} color="#FF5E5E" />
        </TouchableOpacity>

        <Ionicons name="chevron-forward" size={20} color="#9AA3C7" />
      </View>
    </TouchableOpacity>
  );
}

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

  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  iconButtonPlaceholder: {
    width: 50,
    height: 50,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
    height: 50,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
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

  menuContainer: {
    marginBottom: 15,
  },

  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5B7CFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
    overflow: "hidden",
  },

  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1D4D",
  },

  statusText: {
    fontSize: 12,
    color: "#8F96B3",
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteBtn: {
    padding: 6,
    backgroundColor: "#FFECEC",
    borderRadius: 10,
    marginRight: 10,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyTitle: {
    fontWeight: "700",
    marginTop: 10,
  },

  emptySub: {
    color: "#8F96B3",
  },

  loadMoreBtn: {
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 30,
  },

  loadMoreText: {
    color: "#5B7CFA",
    fontWeight: "700",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "88%",
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
    color: "#1B1D4D",
    flexShrink: 1,
    marginRight: 10,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B1D4D",
    marginBottom: 8,
  },

  fileSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2FA",
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 46,
    marginBottom: 10,
  },

  fileSearchInput: {
    marginLeft: 8,
    flex: 1,
  },

  fileList: {
    maxHeight: 180,
    marginBottom: 16,
  },

  fileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F2FA",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },

  fileRowActive: {
    backgroundColor: "#5B7CFA",
  },

  fileRowText: {
    fontSize: 13.5,
    color: "#1B1D4D",
    fontWeight: "600",
    flexShrink: 1,
    marginRight: 8,
  },

  fileRowTextActive: {
    color: "#fff",
  },

  messageInput: {
    backgroundColor: "#F0F2FA",
    borderRadius: 14,
    padding: 14,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  shareBtn: {
    backgroundColor: "#5B7CFA",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  shareBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
