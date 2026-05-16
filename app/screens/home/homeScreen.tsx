import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import { router } from "expo-router";
import { useMemo, useState } from "react";

/* ---------------- MOCK DATA ---------------- */
type FileItem = {
  name: string;
  size: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const FILES: FileItem[] = [
  {
    name: "Preview.mp4",
    size: "8 MB",
    icon: "play",
    color: "#5B7CFA",
  },
  {
    name: "Wallpaper.jpg",
    size: "4.8 MB",
    icon: "image",
    color: "#FF5E8A",
  },
  {
    name: "Music.mp3",
    size: "12 MB",
    icon: "musical-notes",
    color: "#FF914D",
  },
  {
    name: "Project.pdf",
    size: "2 MB",
    icon: "document-text",
    color: "#22C7B8",
  },
];

/* ---------------- SCREEN ---------------- */
export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const filteredFiles = useMemo(() => {
    return FILES.filter((f) =>
      f.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9AA3C7"
        />
        <TextInput
          placeholder="Search files..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* STORAGE */}
        <View style={styles.storageCard}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>
              80%
            </Text>
          </View>

          <View>
            <Text style={styles.storageTitle}>
              Available{"\n"}Storage
            </Text>

            <Text style={styles.storageSub}>
              130GB / 512GB
            </Text>
          </View>
        </View>

        {/* CATEGORIES */}
        <View style={styles.categories}>
          <Category
            label="All"
            icon="grid-view"
            color="#5B7CFA"
            onPress={() => router.push("/all")}
          />
          <Category
            label="Folders"
            icon="folder"
            color="#59C2FF"
            onPress={() =>
              router.push("/folders")
            }
          />
          <Category
            label="Files"
            icon="document-text"
            color="#FF914D"
            onPress={() => router.push("/files")}
          />
          <Category
            label="People"
            icon="people"
            color="#FF5E8A"
            onPress={() =>
              router.push("/people")
            }
          />
        </View>

        {/* FILE LIST */}
        <Text style={styles.sectionTitle}>
          {search
            ? "Search Results"
            : "Recent Files"}
        </Text>

        {filteredFiles.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="search"
              size={60}
              color="#D0D5E5"
            />
            <Text style={styles.emptyTitle}>
              No Files Found
            </Text>
            <Text style={styles.emptySub}>
              Try a different name
            </Text>
          </View>
        ) : (
          filteredFiles.map((file, i) => (
            <FileCard
              key={i}
              file={file}
            />
          ))
        )}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <Nav
          icon="home"
          label="Home"
          active
          onPress={() => router.push("/home")}
        />

        <Nav
          icon="folder"
          label="Folders"
          active={false}
          onPress={() =>
            router.push("/folders")
          }
        />

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => router.push("/upload")}
        >
          <Ionicons
            name="cloud-upload"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <Nav
          icon="document-text"
          label="Files"
          active={false}
          onPress={() => router.push("/files")}
        />

        <Nav
          icon="person"
          label="Profile"
          active={false}
          onPress={() =>
            router.push("/profile")
          }
        />
      </View>
    </View>
  );
}

/* ---------------- CATEGORY ---------------- */
function Category({
  label,
  icon,
  color,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={onPress}
    >
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: color },
        ]}
      >
        <MaterialIcons
          name={icon}
          size={22}
          color="#fff"
        />
      </View>
      <Text style={styles.categoryText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- FILE CARD ---------------- */
function FileCard({ file }: { file: FileItem }) {
  return (
    <View style={styles.fileCard}>
      <View style={styles.fileLeft}>
        <View
          style={[
            styles.fileIcon,
            { backgroundColor: file.color },
          ]}
        >
          <Ionicons
            name={file.icon}
            size={18}
            color="#fff"
          />
        </View>

        <View>
          <Text style={styles.fileName}>
            {file.name}
          </Text>
          <Text style={styles.fileSize}>
            {file.size}
          </Text>
        </View>
      </View>

      <Ionicons
        name="ellipsis-horizontal"
        size={20}
        color="#7B7B9D"
      />
    </View>
  );
}

/* ---------------- NAV ---------------- */
function Nav({
  icon,
  label,
  active,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={22}
        color={
          active ? "#22C7B8" : "#9AA3C7"
        }
      />
      <Text
        style={
          active
            ? styles.navActive
            : styles.navText
        }
      >
        {label}
      </Text>
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

  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
  },

  storageCard: {
    backgroundColor: "#39D2C0",
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  circle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  circleText: {
    color: "#fff",
    fontWeight: "700",
  },

  storageTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  storageSub: {
    color: "#fff",
    marginTop: 5,
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
    marginBottom: 5,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  fileCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  fileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  fileIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  fileName: {
    fontWeight: "700",
  },

  fileSize: {
    color: "#8F96B3",
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

  bottomNav: {
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 10,
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 11,
    color: "#9AA3C7",
  },

  navActive: {
    fontSize: 11,
    color: "#22C7B8",
    fontWeight: "700",
  },

  uploadBtn: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#22C7B8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
});