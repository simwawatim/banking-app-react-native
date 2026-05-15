import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="menu" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Home</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Storage Card */}
        <View style={styles.storageCard}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>80%</Text>
          </View>

          <View>
            <Text style={styles.storageTitle}>
              Available{"\n"}Storage
            </Text>
            <Text style={styles.storageSub}>130GB / 512GB</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/all")}
          >
            <View style={[styles.categoryIcon, { backgroundColor: "#5B7CFA" }]}>
              <MaterialIcons name="grid-view" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/screens/folder")}
          >
            <View style={[styles.categoryIcon, { backgroundColor: "#59C2FF" }]}>
              <Ionicons name="folder" size={22} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Folder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/screens/file")}
          >
            <View style={[styles.categoryIcon, { backgroundColor: "#FF914D" }]}>
              <Ionicons name="document-text" size={22} color="#fff" />
            </View>
            <Text style={styles.categoryText}>File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/screens/people")}
          >
            <View style={[styles.categoryIcon, { backgroundColor: "#FF5E8A" }]}>
              <Ionicons name="person" size={22} color="#fff" />
            </View>
            <Text style={styles.categoryText}>People</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Files */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent files</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fileCard}>
          <View style={styles.fileLeft}>
            <View style={styles.fileIcon}>
              <Ionicons name="play" size={18} color="#fff" />
            </View>

            <View>
              <Text style={styles.fileName}>Preview.mp4</Text>
              <Text style={styles.fileSize}>8 MB</Text>
            </View>
          </View>

          <Ionicons name="ellipsis-horizontal" size={20} color="#7B7B9D" />
        </View>

        <View style={styles.fileCard}>
          <View style={styles.fileLeft}>
            <View style={[styles.fileIcon, { backgroundColor: "#FF5E8A" }]}>
              <Ionicons name="image" size={18} color="#fff" />
            </View>

            <View>
              <Text style={styles.fileName}>Wallpaper.jpg</Text>
              <Text style={styles.fileSize}>4.8 MB</Text>
            </View>
          </View>

          <Ionicons name="ellipsis-horizontal" size={20} color="#7B7B9D" />
        </View>

        <View style={styles.fileCard}>
          <View style={styles.fileLeft}>
            <View style={[styles.fileIcon, { backgroundColor: "#FF914D" }]}>
              <FontAwesome5 name="music" size={16} color="#fff" />
            </View>

            <View>
              <Text style={styles.fileName}>Music.mp3</Text>
              <Text style={styles.fileSize}>12 MB</Text>
            </View>
          </View>

          <Ionicons name="ellipsis-horizontal" size={20} color="#7B7B9D" />
        </View>
      </ScrollView>

      {/* Bottom Navigation (FIXED) */}
      <View style={styles.bottomNav}>
        <NavItem
          icon="home"
          label="Home"
          active
          onPress={() => router.push("/home")}
        />

        <NavItem
          icon="folder"
          label="Folders"
          active={false}
          onPress={() => router.push("/folders")}
        />

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => router.push("/upload")}
        >
          <Ionicons name="cloud-upload" size={24} color="#fff" />
        </TouchableOpacity>

        <NavItem
          icon="document-text"
          label="Files"
          active={false}
          onPress={() => router.push("/screens/file")}
        />

        <NavItem
          icon="person"
          label="Profile"
          active={false}
          onPress={() => router.push("/profile")}
        />
      </View>
    </View>
  );
}

/* Reusable Nav Item */
function NavItem({ icon, label, onPress, active }: { icon: any; label: string; onPress: () => void; active: boolean }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons
        name={icon}
        size={24}
        color={active ? "#22C7B8" : "#9AA3C7"}
      />
      <Text style={active ? styles.navTextActive : styles.navText}>
        {label}
      </Text>
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

  storageCard: {
    backgroundColor: "#39D2C0",
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  circleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  storageTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
  },

  storageSub: {
    color: "#EFFFFC",
    marginTop: 8,
    fontSize: 14,
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  categoryItem: {
    alignItems: "center",
  },

  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  categoryText: {
    color: "#1B1D4D",
    fontWeight: "600",
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  recentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  seeAll: {
    color: "#22C7B8",
    fontWeight: "700",
  },

  fileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  fileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  fileIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#5B7CFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  fileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  fileSize: {
    color: "#8F96B3",
    marginTop: 4,
  },

  bottomNav: {
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 12,
    color: "#9AA3C7",
    marginTop: 4,
    fontWeight: "500",
  },

  navTextActive: {
    fontSize: 12,
    color: "#22C7B8",
    marginTop: 4,
    fontWeight: "700",
  },

  uploadButton: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#22C7B8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
});