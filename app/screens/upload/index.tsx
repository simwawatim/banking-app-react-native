import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { Video, ResizeMode } from "expo-av";

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

type FileItem = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  progress: number;
  uploaded: boolean;
};

export default function UploadScreen() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  /* PICK FILES */
  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const selectedFiles: FileItem[] = result.assets.map(
        (file) => ({
          uri: file.uri,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType,
          progress: 0,
          uploaded: false,
        })
      );

      setFiles((prev) => [...prev, ...selectedFiles]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to select files");
    }
  };

  /* REMOVE FILE */
  const removeFile = (indexToRemove: number) => {
    setFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  /* MOCK UPLOAD */
  const uploadFiles = async () => {
    if (files.length === 0) {
      Alert.alert("No Files", "Please select files first");
      return;
    }

    setUploading(true);

    files.forEach((file, fileIndex) => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += 5;

        setFiles((prev) =>
          prev.map((f, index) => {
            if (index === fileIndex) {
              return {
                ...f,
                progress,
                uploaded: progress >= 100,
              };
            }

            return f;
          })
        );

        if (progress >= 100) {
          clearInterval(interval);

          if (fileIndex === files.length - 1) {
            setUploading(false);

            Alert.alert(
              "Success",
              "Files uploaded successfully"
            );
          }
        }
      }, 150);
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Upload Files</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={pickFiles}
        >
          <Ionicons
            name="add"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={pickFiles}
        >
          <Ionicons
            name="folder-open"
            size={20}
            color="#fff"
          />

          <Text style={styles.buttonText}>
            Select Files
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={uploadFiles}
        >
          <Ionicons
            name="cloud-upload"
            size={20}
            color="#fff"
          />

          <Text style={styles.buttonText}>
            {uploading
              ? "Uploading..."
              : "Upload"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* FILES */}
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {files.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="cloud-upload-outline"
              size={90}
              color="#B8C1D1"
            />

            <Text style={styles.emptyTitle}>
              No Files Selected
            </Text>

            <Text style={styles.emptyText}>
              Select images, videos, audio or
              documents
            </Text>
          </View>
        ) : (
          files.map((file, index) => (
            <PreviewCard
              key={index}
              file={file}
              onRemove={() =>
                removeFile(index)
              }
            />
          ))
        )}
      </ScrollView>
    </View>
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
  const isImage =
    file.mimeType?.startsWith("image/");
  const isVideo =
    file.mimeType?.startsWith("video/");
  const isAudio =
    file.mimeType?.startsWith("audio/");
  const isPdf =
    file.mimeType === "application/pdf";

  return (
    <View style={styles.card}>
      {/* REMOVE BUTTON */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
      >
        <Ionicons
          name="close"
          size={18}
          color="#fff"
        />
      </TouchableOpacity>

      {/* PREVIEW */}
      <View style={styles.previewContainer}>
        {/* IMAGE */}
        {isImage && (
          <Image
            source={{ uri: file.uri }}
            style={styles.previewImage}
          />
        )}

        {/* VIDEO */}
        {isVideo && (
          <Video
            source={{ uri: file.uri }}
            style={styles.previewVideo}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            isLooping
          />
        )}

        {/* AUDIO */}
        {isAudio && (
          <View style={styles.centerPreview}>
            <FontAwesome5
              name="music"
              size={50}
              color="#FF914D"
            />

            <Text style={styles.previewLabel}>
              Audio File
            </Text>
          </View>
        )}

        {/* PDF */}
        {isPdf && (
          <View style={styles.centerPreview}>
            <MaterialIcons
              name="picture-as-pdf"
              size={55}
              color="#E53935"
            />

            <Text style={styles.previewLabel}>
              PDF Document
            </Text>
          </View>
        )}

        {/* OTHER */}
        {!isImage &&
          !isVideo &&
          !isAudio &&
          !isPdf && (
            <View style={styles.centerPreview}>
              <Ionicons
                name="document"
                size={55}
                color="#22C7B8"
              />

              <Text style={styles.previewLabel}>
                Document File
              </Text>
            </View>
          )}
      </View>

      {/* INFO */}
      <View style={styles.info}>
        <Text
          style={styles.fileName}
          numberOfLines={1}
        >
          {file.name}
        </Text>

        <Text style={styles.fileSize}>
          {file.size
            ? `${(
                file.size /
                1024 /
                1024
              ).toFixed(2)} MB`
            : "Unknown Size"}
        </Text>

        {/* PROGRESS BAR */}
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${file.progress}%`,
              },
            ]}
          />
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {file.progress}%
          </Text>

          {file.uploaded && (
            <View style={styles.uploadedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#fff"
              />

              <Text
                style={styles.uploadedText}
              >
                Uploaded
              </Text>
            </View>
          )}
        </View>
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
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  addButton: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#22C7B8",
    justifyContent: "center",
    alignItems: "center",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  selectButton: {
    flex: 1,
    height: 55,
    backgroundColor: "#5B7CFA",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
  },

  uploadButton: {
    flex: 1,
    height: 55,
    backgroundColor: "#1B1D4D",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1D4D",
    marginTop: 20,
  },

  emptyText: {
    color: "#8F96B3",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    marginBottom: 20,
    overflow: "hidden",
  },

  removeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#FF5E8A",
    justifyContent: "center",
    alignItems: "center",
  },

  previewContainer: {
    height: 220,
    backgroundColor: "#EEF2F9",
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
    marginTop: 12,
    fontWeight: "700",
    color: "#1B1D4D",
    fontSize: 16,
  },

  info: {
    padding: 18,
  },

  fileName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  fileSize: {
    marginTop: 6,
    marginBottom: 14,
    color: "#8F96B3",
  },

  progressBackground: {
    height: 10,
    backgroundColor: "#E5EAF3",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22C7B8",
  },

  progressRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressText: {
    fontWeight: "700",
    color: "#22C7B8",
  },

  uploadedBadge: {
    backgroundColor: "#22C7B8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  uploadedText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "700",
    fontSize: 12,
  },
});