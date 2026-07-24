import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  deleteFile as deleteFileApi,
  FileRecord,
  getFile,
  getFiles,
  uploadFiles,
} from "../../api/clients/file";

function iconForFile(name: string): keyof typeof Ionicons.glyphMap {
  const ext = name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") return "document-text";
  if (["doc", "docx"].includes(ext ?? "")) return "document";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext ?? "")) return "image";
  if (["xls", "xlsx", "csv"].includes(ext ?? "")) return "grid";
  if (["zip", "rar", "7z"].includes(ext ?? "")) return "archive";
  return "document-attach";
}

export default function FileScreen() {
  const { folderId } = useLocalSearchParams<{ folderId?: string }>();
  const targetFolder = folderId ? Number(folderId) : 1;

  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openingId, setOpeningId] = useState<number | null>(null);

  const loadFiles = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const response = await getFiles();

    if (response.status === "success" && response.data) {
      setFiles(response.data);
    } else {
      Alert.alert("Error", response.message);
    }

    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleRefresh = () => loadFiles(true);

  const handleDelete = (id: number) => {
    Alert.alert("Delete File", "Are you sure you want to delete this file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeletingId(id);
          const response = await deleteFileApi(id);
          setDeletingId(null);

          if (response.status === "success") {
            setFiles((prev) => prev.filter((item) => item.id !== id));
          } else {
            Alert.alert("Error", response.message);
          }
        },
      },
    ]);
  };

  // Only place GET /files/{id}/ is ever called — explicitly, from a button tap,
  // after the list is already loaded. We confirm the file still exists before
  // navigating, so the viewer never receives a bad or stale id.
  const handleView = async (id: number) => {
    setOpeningId(id);
    const response = await getFile(id);
    setOpeningId(null);

    if (response.status === "success" && response.data) {
      router.push({
        pathname: "/fileViewer",
        params: { id: response.data.id },
      });
    } else {
      Alert.alert("Error", response.message);
    }
  };

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) return;

    setUploading(true);
    const response = await uploadFiles(
      targetFolder,
      result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      })),
    );
    setUploading(false);

    if (response.status === "success" && response.data) {
      setFiles((prev) => [...response.data!, ...prev]);
    } else {
      Alert.alert("Error", response.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Files</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#5B7CFA" />
          ) : (
            <Ionicons name="cloud-upload" size={22} color="#1B1D4D" />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#5B7CFA"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#5B7CFA"
              colors={["#5B7CFA"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No files yet. Tap upload to add one.
            </Text>
          }
          renderItem={({ item }) => (
            <FileItem
              item={item}
              deleting={deletingId === item.id}
              opening={openingId === item.id}
              onView={() => handleView(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

function FileItem({
  item,
  deleting,
  opening,
  onView,
  onDelete,
}: {
  item: FileRecord;
  deleting: boolean;
  opening: boolean;
  onView: () => void;
  onDelete: () => void;
}) {
  const busy = deleting || opening;

  return (
    <View style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons
            name={iconForFile(item.original_name)}
            size={20}
            color="#fff"
          />
        </View>

        <Text style={styles.menuText} numberOfLines={1}>
          {item.original_name}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={onView}
          disabled={busy}
        >
          {opening ? (
            <ActivityIndicator size="small" color="#5B7CFA" />
          ) : (
            <>
              <Ionicons name="eye-outline" size={16} color="#5B7CFA" />
              <Text style={styles.viewBtnText}>View</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
          disabled={busy}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#FF5E5E" />
          ) : (
            <Ionicons name="trash" size={18} color="#FF5E5E" />
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 30,
  },

  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B1D4D",
    flex: 1,
    textAlign: "center",
  },

  emptyText: { textAlign: "center", color: "#8F96B3", marginTop: 40 },

  menuContainer: { paddingBottom: 30 },

  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FF914D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B1D4D",
    flexShrink: 1,
  },

  actions: { flexDirection: "row", alignItems: "center", gap: 8 },

  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF1FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 68,
    justifyContent: "center",
  },

  viewBtnText: {
    color: "#5B7CFA",
    fontWeight: "700",
    fontSize: 12.5,
    marginLeft: 4,
  },

  deleteBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#FFECEC",
  },
});
