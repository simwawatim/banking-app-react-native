import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";

import { API_BASE_URL } from "@/app/api/client";
import { deleteFile, FileRecord, getFile } from "@/app/api/clients/file";
import { getFolder } from "@/app/api/clients/folder";

const SERVER_ROOT = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

function resolveFileUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SERVER_ROOT}${path}`;
}

type Kind = "image" | "video" | "pdf" | "audio" | "other";

function kindFor(name: string): Kind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "heic"].includes(ext))
    return "image";
  if (["mp4", "mov", "m4v", "webm"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (["mp3", "wav", "m4a", "aac"].includes(ext)) return "audio";
  return "other";
}

export default function FileViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fileId = Number(id);
  const validId = Boolean(id) && !Number.isNaN(fileId) && fileId > 0;

  const [file, setFile] = useState<FileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [folderName, setFolderName] = useState<string | null>(null);
  const [loadingFolder, setLoadingFolder] = useState(false);

  useEffect(() => {
    if (!validId) {
      router.replace("/files");
    }
  }, [validId]);

  useEffect(() => {
    if (!validId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      const response = await getFile(fileId);
      if (cancelled) return;

      if (response.status === "success" && response.data) {
        setFile(response.data);
      } else {
        Alert.alert("Error", response.message, [
          { text: "OK", onPress: () => router.replace("/files") },
        ]);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [validId, fileId]);

  // Resolve the folder's display name once we know which folder this file
  // belongs to. `file.folder` is just the numeric folder id.
  useEffect(() => {
    if (!file) return;

    let cancelled = false;

    (async () => {
      setLoadingFolder(true);
      const response = await getFolder(file.folder);
      if (cancelled) return;

      if (response.status === "success" && response.data) {
        setFolderName(response.data.folder_name);
      } else {
        setFolderName(null);
      }

      setLoadingFolder(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [file?.folder]);

  const handleDelete = () => {
    if (!file) return;

    Alert.alert("Delete File", "Are you sure you want to delete this file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          const response = await deleteFile(file.id);
          setDeleting(false);

          if (response.status === "success") {
            router.back();
          } else {
            Alert.alert("Error", response.message);
          }
        },
      },
    ]);
  };

  const handleOpenExternally = () => {
    if (!file) return;
    Linking.openURL(resolveFileUrl(file.file));
  };

  if (!validId || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#5B7CFA"
          style={{ marginTop: 100 }}
        />
      </View>
    );
  }

  if (!file) return null;

  const url = resolveFileUrl(file.file);
  const kind = kindFor(file.original_name);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {file.original_name}
        </Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#FF5E5E" />
          ) : (
            <Ionicons name="trash" size={20} color="#FF5E5E" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {kind === "image" && (
          <Image
            source={{ uri: url }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {kind === "video" && <VideoBlock uri={url} />}

        {kind === "audio" && (
          <View style={styles.centerBlock}>
            <View style={styles.iconRing}>
              <Ionicons name="musical-notes" size={40} color="#FF914D" />
            </View>
            <Text style={styles.centerLabel}>Audio file</Text>
            <TouchableOpacity
              style={styles.openButton}
              onPress={handleOpenExternally}
            >
              <Ionicons name="play" size={18} color="#fff" />
              <Text style={styles.openButtonText}>Play</Text>
            </TouchableOpacity>
          </View>
        )}

        {kind === "pdf" && (
          <View style={styles.centerBlock}>
            <View style={styles.iconRing}>
              <MaterialIcons name="picture-as-pdf" size={40} color="#E53935" />
            </View>
            <Text style={styles.centerLabel}>PDF document</Text>
            <TouchableOpacity
              style={styles.openButton}
              onPress={handleOpenExternally}
            >
              <Ionicons name="open-outline" size={18} color="#fff" />
              <Text style={styles.openButtonText}>Open</Text>
            </TouchableOpacity>
          </View>
        )}

        {kind === "other" && (
          <View style={styles.centerBlock}>
            <View style={styles.iconRing}>
              <Ionicons name="document-outline" size={40} color="#8F96B3" />
            </View>
            <Text style={styles.centerLabel}>
              This file type can't be previewed
            </Text>
            <TouchableOpacity
              style={styles.openButton}
              onPress={handleOpenExternally}
            >
              <Ionicons name="open-outline" size={18} color="#fff" />
              <Text style={styles.openButtonText}>Open</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.metaBlock}>
          <MetaRow
            label="Uploaded"
            value={new Date(file.uploaded_at).toLocaleString()}
          />
          <MetaRow
            label="Folder"
            value={
              loadingFolder ? "Loading..." : (folderName ?? String(file.folder))
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

function VideoBlock({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
  });

  return (
    <VideoView
      style={styles.video}
      player={player}
      nativeControls
      allowsPictureInPicture
    />
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  iconButton: {
    width: 46,
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1D4D",
    textAlign: "center",
    marginHorizontal: 10,
  },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  image: {
    width: "100%",
    height: 380,
    borderRadius: 20,
    backgroundColor: "#EEF2F9",
  },
  video: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    backgroundColor: "#000",
  },
  centerBlock: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  iconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#F0F2FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  centerLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B1D4D",
    marginBottom: 20,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5B7CFA",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  openButtonText: { color: "#fff", fontWeight: "700", marginLeft: 8 },
  metaBlock: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  metaLabel: { color: "#8F96B3", fontSize: 13 },
  metaValue: { color: "#1B1D4D", fontSize: 13, fontWeight: "600" },
});
