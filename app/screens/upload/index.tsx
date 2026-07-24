import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { useVideoPlayer, VideoView } from "expo-video";

import { uploadFiles as uploadFilesApi } from "@/app/api/clients/file";
import { Folder, getFolders } from "@/app/api/clients/folder";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

type FileItem = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  progress: number;
  uploaded: boolean;
  failed: boolean;
};

const INK = "#151833";
const MUTED = "#8288A3";
const CANVAS = "#F4F5FA";
const SURFACE = "#FFFFFF";
const ACCENT = "#4B5EE4";
const TEAL = "#0FB8A6";
const CORAL = "#E8555F";
const AMBER = "#E8A23D";
const VIOLET = "#8A63D2";
const HAIRLINE = "#E7E9F2";

function spineColorFor(mimeType?: string) {
  if (mimeType?.startsWith("image/")) return TEAL;
  if (mimeType?.startsWith("video/")) return ACCENT;
  if (mimeType?.startsWith("audio/")) return AMBER;
  if (mimeType === "application/pdf") return CORAL;
  return VIOLET;
}

export default function UploadScreen() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const loadFolders = useCallback(async () => {
    setLoadingFolders(true);
    const response = await getFolders();

    if (response.status === "success" && response.data) {
      setFolders(response.data);
      if (response.data.length > 0) {
        setSelectedFolder((prev) => prev ?? response.data![0]);
      }
    } else {
      Alert.alert("Error", response.message);
    }

    setLoadingFolders(false);
  }, []);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  /* PICK FILES */
  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const selectedFiles: FileItem[] = result.assets.map((file) => ({
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        progress: 0,
        uploaded: false,
        failed: false,
      }));

      setFiles((prev) => [...prev, ...selectedFiles]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to select files");
    }
  };

  /* REMOVE FILE */
  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const updateFileAt = (index: number, patch: Partial<FileItem>) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    );
  };

  /* REAL UPLOAD, one file at a time so progress bars map correctly */
  const handleUpload = async () => {
    if (!selectedFolder) {
      Alert.alert("No Folder", "Please select a folder to upload into");
      return;
    }

    const pendingIndexes = files
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => !f.uploaded)
      .map(({ i }) => i);

    if (pendingIndexes.length === 0) {
      Alert.alert("No Files", "Please select files first");
      return;
    }

    setUploading(true);

    let hadFailure = false;

    for (const index of pendingIndexes) {
      const file = files[index];
      updateFileAt(index, { failed: false, progress: 0 });

      const response = await uploadFilesApi(
        selectedFolder.id,
        [{ uri: file.uri, name: file.name, mimeType: file.mimeType }],
        (percent) => updateFileAt(index, { progress: percent }),
      );

      if (response.status === "success") {
        updateFileAt(index, { progress: 100, uploaded: true });
      } else {
        hadFailure = true;
        updateFileAt(index, { failed: true, progress: 0 });
        Alert.alert("Upload Failed", `${file.name}: ${response.message}`);
      }
    }

    setUploading(false);

    if (!hadFailure) {
      Alert.alert("Success", "Files uploaded successfully");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Documents</Text>
          <Text style={styles.title}>Upload Files</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={pickFiles}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* FOLDER PICKER */}
      <Text style={styles.sectionLabel}>Upload to</Text>

      {loadingFolders ? (
        <ActivityIndicator
          size="small"
          color={ACCENT}
          style={{ marginBottom: 20, alignSelf: "flex-start" }}
        />
      ) : folders.length === 0 ? (
        <View style={styles.noFoldersBox}>
          <Ionicons name="folder-outline" size={18} color={MUTED} />
          <Text style={styles.noFoldersText}>
            No folders yet — create one before uploading
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.folderRow}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {folders.map((folder) => {
            const active = selectedFolder?.id === folder.id;

            return (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderTab}
                onPress={() => setSelectedFolder(folder)}
                disabled={uploading}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.folderTabText,
                    active && styles.folderTabTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {folder.folder_name}
                </Text>
                <View
                  style={[
                    styles.folderTabUnderline,
                    active && styles.folderTabUnderlineActive,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* ACTION BUTTONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={pickFiles}
          activeOpacity={0.85}
        >
          <Ionicons name="folder-open-outline" size={19} color={INK} />
          <Text style={styles.selectButtonText}>Select Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedFolder || uploading) && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!selectedFolder || uploading}
          activeOpacity={0.85}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="cloud-upload-outline" size={19} color="#fff" />
          )}
          <Text style={styles.uploadButtonText}>
            {uploading ? "Uploading" : "Upload"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* FILES */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {files.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconRing}>
              <Ionicons name="cloud-upload-outline" size={40} color={ACCENT} />
            </View>

            <Text style={styles.emptyTitle}>Nothing selected yet</Text>

            <Text style={styles.emptyText}>
              Add images, videos, audio, or documents to send to{"\n"}
              {selectedFolder ? selectedFolder.folder_name : "a folder"}
            </Text>
          </View>
        ) : (
          files.map((file, index) => (
            <PreviewCard
              key={index}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* VIDEO PREVIEW (separate component so useVideoPlayer is called unconditionally per instance) */
function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

  return (
    <VideoView
      style={styles.previewVideo}
      player={player}
      nativeControls
      allowsPictureInPicture
    />
  );
}

/* PREVIEW CARD */
function PreviewCard({
  file,
  onRemove,
}: {
  file: FileItem;
  onRemove: () => void;
}) {
  const isImage = file.mimeType?.startsWith("image/");
  const isVideo = file.mimeType?.startsWith("video/");
  const isAudio = file.mimeType?.startsWith("audio/");
  const isPdf = file.mimeType === "application/pdf";
  const spine = spineColorFor(file.mimeType);

  return (
    <View style={styles.card}>
      <View style={[styles.cardSpine, { backgroundColor: spine }]} />

      <View style={styles.cardBody}>
        {/* REMOVE BUTTON */}
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>

        {/* PREVIEW */}
        <View style={styles.previewContainer}>
          {isImage && (
            <Image source={{ uri: file.uri }} style={styles.previewImage} />
          )}

          {isVideo && <VideoPreview uri={file.uri} />}

          {isAudio && (
            <View style={styles.centerPreview}>
              <FontAwesome5 name="music" size={42} color={AMBER} />
              <Text style={[styles.previewLabel, { color: AMBER }]}>
                Audio File
              </Text>
            </View>
          )}

          {isPdf && (
            <View style={styles.centerPreview}>
              <MaterialIcons name="picture-as-pdf" size={46} color={CORAL} />
              <Text style={[styles.previewLabel, { color: CORAL }]}>
                PDF Document
              </Text>
            </View>
          )}

          {!isImage && !isVideo && !isAudio && !isPdf && (
            <View style={styles.centerPreview}>
              <Ionicons name="document-outline" size={46} color={VIOLET} />
              <Text style={[styles.previewLabel, { color: VIOLET }]}>
                Document File
              </Text>
            </View>
          )}
        </View>

        {/* INFO */}
        <View style={styles.info}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>

          <Text style={styles.fileSize}>
            {file.size
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
              : "Unknown size"}
          </Text>

          {/* PROGRESS BAR */}
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: file.failed ? CORAL : TEAL },
                { width: `${file.progress}%` },
              ]}
            />
          </View>

          <View style={styles.progressRow}>
            <Text
              style={[
                styles.progressText,
                { color: file.failed ? CORAL : TEAL },
              ]}
            >
              {file.failed ? "Upload failed" : `${file.progress}%`}
            </Text>

            {file.uploaded && (
              <View style={styles.uploadedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.uploadedText}>Uploaded</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CANVAS,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: ACCENT,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: INK,
    letterSpacing: -0.5,
  },

  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: INK,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: INK,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  noFoldersBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
  },

  noFoldersText: {
    color: MUTED,
    fontSize: 13,
    marginLeft: 8,
    flexShrink: 1,
  },

  folderRow: {
    marginBottom: 24,
  },

  folderTab: {
    alignItems: "center",
    marginRight: 26,
    maxWidth: 140,
  },

  folderTabText: {
    fontSize: 15,
    fontWeight: "600",
    color: MUTED,
    paddingBottom: 10,
  },

  folderTabTextActive: {
    color: INK,
    fontWeight: "800",
  },

  folderTabUnderline: {
    height: 3,
    width: "100%",
    borderRadius: 3,
    backgroundColor: "transparent",
  },

  folderTabUnderlineActive: {
    backgroundColor: ACCENT,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
    gap: 12,
  },

  selectButton: {
    flex: 1,
    height: 54,
    backgroundColor: SURFACE,
    borderWidth: 1.5,
    borderColor: HAIRLINE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  selectButtonText: {
    color: INK,
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 14.5,
  },

  uploadButton: {
    flex: 1,
    height: 54,
    backgroundColor: ACCENT,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: ACCENT,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  uploadButtonDisabled: {
    backgroundColor: "#C4CAF0",
    shadowOpacity: 0,
    elevation: 0,
  },

  uploadButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 14.5,
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#EAEDFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: INK,
  },

  emptyText: {
    color: MUTED,
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: SURFACE,
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#1B1D4D",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  cardSpine: {
    width: 5,
  },

  cardBody: {
    flex: 1,
  },

  removeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(21, 24, 51, 0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  previewContainer: {
    height: 200,
    backgroundColor: "#F0F2FA",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  previewVideo: {
    width: "100%",
    height: "100%",
  },

  centerPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  previewLabel: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 14,
  },

  info: {
    padding: 18,
  },

  fileName: {
    fontSize: 16,
    fontWeight: "700",
    color: INK,
  },

  fileSize: {
    marginTop: 4,
    marginBottom: 14,
    color: MUTED,
    fontSize: 12.5,
  },

  progressBackground: {
    height: 6,
    backgroundColor: "#EEF0F8",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
  },

  progressRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressText: {
    fontWeight: "700",
    fontSize: 12.5,
  },

  uploadedBadge: {
    backgroundColor: TEAL,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  uploadedText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "700",
    fontSize: 11,
  },
});
