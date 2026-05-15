import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

export default function UploadScreen() {
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

        <Text style={styles.headerTitle}>Upload</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="cloud-upload" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upload Card */}
        <View style={styles.uploadCard}>
          <Ionicons name="cloud-upload" size={60} color="#fff" />
          <Text style={styles.uploadTitle}>Upload Files</Text>
          <Text style={styles.uploadText}>
            Select files from your device
          </Text>

          <TouchableOpacity style={styles.uploadBtn}>
            <Text style={styles.uploadBtnText}>Choose Files</Text>
          </TouchableOpacity>
        </View>

        {/* File Types */}
        <Text style={styles.sectionTitle}>Supported Types</Text>

        <View style={styles.grid}>
          <TypeCard
            icon={<Ionicons name="image" size={24} color="#fff" />}
            title="Images"
            color="#FF5E8A"
          />

          <TypeCard
            icon={<Ionicons name="play" size={24} color="#fff" />}
            title="Videos"
            color="#5B7CFA"
          />

          <TypeCard
            icon={<FontAwesome5 name="music" size={22} color="#fff" />}
            title="Audio"
            color="#FF914D"
          />

          <TypeCard
            icon={<MaterialIcons name="insert-drive-file" size={24} color="#fff" />}
            title="Docs"
            color="#22C7B8"
          />
        </View>

        {/* Recent Uploads */}
        <Text style={styles.sectionTitle}>Recent Uploads</Text>

        <View style={styles.list}>
          <UploadItem name="Project.mp4" size="12 MB" />
          <UploadItem name="Design.jpg" size="3.2 MB" />
          <UploadItem name="Music.mp3" size="8 MB" />
        </View>
      </ScrollView>
    </View>
  );
}

/* File Type Card */
function TypeCard({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <View style={[styles.typeCard, { backgroundColor: color }]}>
      {icon}
      <Text style={styles.typeText}>{title}</Text>
    </View>
  );
}

/* Upload Item */
function UploadItem({ name, size }: { name: string; size: string }) {
  return (
    <View style={styles.uploadItem}>
      <View style={styles.left}>
        <Ionicons name="document" size={20} color="#fff" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.fileName}>{name}</Text>
          <Text style={styles.fileSize}>{size}</Text>
        </View>
      </View>

      <Ionicons name="checkmark-circle" size={22} color="#22C7B8" />
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
  },

  uploadCard: {
    backgroundColor: "#22C7B8",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    marginBottom: 25,
  },

  uploadTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },

  uploadText: {
    color: "#EFFFFC",
    marginTop: 5,
    marginBottom: 15,
  },

  uploadBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
  },

  uploadBtnText: {
    color: "#22C7B8",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1D4D",
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  typeCard: {
    width: "48%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
  },

  typeText: {
    color: "#fff",
    marginTop: 10,
    fontWeight: "600",
  },

  list: {
    marginBottom: 30,
  },

  uploadItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  fileName: {
    fontWeight: "600",
    color: "#1B1D4D",
  },

  fileSize: {
    color: "#8F96B3",
    fontSize: 12,
  },
});