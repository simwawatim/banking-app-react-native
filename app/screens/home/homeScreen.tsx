import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { logout } from "@/app/api/api";
import {
  DashboardStats,
  getDashboardStats,
  getProfile,
  RecentFile,
} from "@/app/api/client";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300";

type FilterType = "all" | "image" | "video" | "document";

const FILTERS: {
  key: FilterType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "all", label: "All", icon: "apps" },
  { key: "image", label: "Photos", icon: "image" },
  { key: "video", label: "Videos", icon: "videocam" },
  { key: "document", label: "Docs", icon: "document-text" },
];

// RecentFile has no explicit "type" field from the API — only an `icon`
// name string. Map that icon to a coarse type bucket for filtering.
function inferType(file: RecentFile): FilterType {
  if (file.icon === "image") return "image";
  if (file.icon === "play") return "video";
  return "document";
}

/* ---------------- SCREEN ---------------- */
export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [menuVisible, setMenuVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  const filteredFiles = useMemo(() => {
    const files = stats?.recent_files ?? [];

    return files
      .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
      .filter((f) => activeFilter === "all" || inferType(f) === activeFilter);
  }, [search, stats, activeFilter]);

  useEffect(() => {
    loadProfilePicture();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, []),
  );

  const loadProfilePicture = async () => {
    const token = await AsyncStorage.getItem("access_token");

    if (!token) {
      return;
    }

    const result = await getProfile();

    if (result.status === "success" && result.data) {
      setProfilePicture(result.data.profile_picture || null);
    }
  };

  const loadStats = async () => {
    setIsLoadingStats(true);
    setStatsError("");

    const result = await getDashboardStats();

    if (result.status === "success" && result.data) {
      setStats(result.data);
    } else {
      setStatsError(result.message || "Could not load your files.");
    }

    setIsLoadingStats(false);
  };

  const handleViewProfile = () => {
    setMenuVisible(false);
    router.push("/profile");
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    setLoggingOut(true);

    const refreshToken = await AsyncStorage.getItem("refresh_token");

    if (refreshToken) {
      await logout({ refresh: refreshToken });
    }

    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

    setLoggingOut(false);
    router.replace("/login");
  };

  const percentUsed = stats?.storage.percent_used ?? 0;
  const usedReadable = stats?.storage.used_readable ?? "0 B";
  const maxReadable = stats?.storage.max_readable ?? "1.0 GB";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Files</Text>

        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => setMenuVisible(true)}
        >
          <Image
            source={{ uri: profilePicture || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* PROFILE DROPDOWN MENU */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleViewProfile}
            >
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#3A3F5C"
              />
              <Text style={styles.menuItemText}>View Profile</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
              disabled={loggingOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF5E8A" />
              <Text style={[styles.menuItemText, { color: "#FF5E8A" }]}>
                {loggingOut ? "Logging out..." : "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9AA3C7" />
        <TextInput
          placeholder="Search files..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* STORAGE */}
        <View style={styles.storageCard}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>{percentUsed}%</Text>
          </View>

          <View>
            <Text style={styles.storageTitle}>Available{"\n"}Storage</Text>

            <Text style={styles.storageSub}>
              {usedReadable} / {maxReadable}
            </Text>
          </View>
        </View>

        {statsError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color="#D64545" />
            <Text style={styles.errorText}>{statsError}</Text>
          </View>
        ) : null}

        {/* CATEGORIES */}
        <View style={styles.categories}>
          <Category
            label="All"
            icon="grid-view"
            color="#5B7CFA"
            count={stats ? stats.total_files : undefined}
            onPress={() => router.push("/all")}
          />
          <Category
            label="Folders"
            icon="folder"
            color="#59C2FF"
            count={stats ? stats.total_folders : undefined}
            onPress={() => router.push("/folders")}
          />
          <Category
            label="Files"
            icon="document-text"
            color="#FF914D"
            count={stats ? stats.total_files : undefined}
            onPress={() => router.push("/files")}
          />
          <Category
            label="People"
            icon="people"
            color="#FF5E8A"
            count={stats ? stats.shared_people : undefined}
            onPress={() => router.push("/people")}
          />
        </View>

        {/* SECTION HEADER + TYPE FILTERS */}
        <Text style={styles.sectionTitle}>
          {search ? "Search Results" : "Recent Files"}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.key;

            return (
              <TouchableOpacity
                key={filter.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter.key)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={filter.icon}
                  size={15}
                  color={active ? "#fff" : "#5B7CFA"}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isLoadingStats ? (
          <View style={styles.emptyBox}>
            <ActivityIndicator size="large" color="#22C7B8" />
          </View>
        ) : filteredFiles.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="search" size={60} color="#D0D5E5" />
            <Text style={styles.emptyTitle}>No Files Found</Text>
            <Text style={styles.emptySub}>Try a different name or filter</Text>
          </View>
        ) : (
          filteredFiles.map((file) => <FileCard key={file.id} file={file} />)
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
          onPress={() => router.push("/folders")}
        />

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => router.push("/upload")}
        >
          <Ionicons name="cloud-upload" size={26} color="#fff" />
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
          onPress={() => router.push("/profile")}
        />
      </View>
    </View>
  );
}

/* ---------------- CATEGORY ---------------- */
function Category({ label, icon, color, count, onPress }: any) {
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View style={[styles.categoryIcon, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={22} color="#fff" />
      </View>
      <Text style={styles.categoryText}>{label}</Text>
      {typeof count === "number" ? (
        <Text style={styles.categoryCount}>{count}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

/* ---------------- FILE CARD ---------------- */
function FileCard({ file }: { file: RecentFile }) {
  const type = inferType(file);

  return (
    <TouchableOpacity
      style={styles.fileCard}
      onPress={() =>
        router.push({
          pathname: "/file/[id]",
          params: { id: String(file.id) },
        })
      }
    >
      <View style={styles.fileLeft}>
        <View
          style={[
            styles.fileIcon,
            { backgroundColor: colorForIcon(file.icon) },
          ]}
        >
          <Ionicons name={file.icon as any} size={18} color="#fff" />

          {type === "video" && (
            <View style={styles.playBadge}>
              <Ionicons name="play" size={10} color="#fff" />
            </View>
          )}
        </View>

        <View style={{ flexShrink: 1 }}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>
          <Text style={styles.fileSize}>{file.size}</Text>
        </View>
      </View>

      <Ionicons name="ellipsis-horizontal" size={20} color="#7B7B9D" />
    </TouchableOpacity>
  );
}

function colorForIcon(icon: string) {
  const colors: Record<string, string> = {
    play: "#5B7CFA",
    image: "#FF5E8A",
    "musical-notes": "#FF914D",
    "document-text": "#22C7B8",
    archive: "#9B59B6",
    document: "#8F96B3",
  };
  return colors[icon] || "#8F96B3";
}

/* ---------------- NAV ---------------- */
function Nav({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={active ? "#22C7B8" : "#9AA3C7"} />
      <Text style={active ? styles.navActive : styles.navText}>{label}</Text>
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

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E2140",
  },

  avatarWrapper: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 20,
  },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    width: 190,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  menuItemText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#3A3F5C",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#EEF0F6",
    marginHorizontal: 8,
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
    marginBottom: 16,
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

  categoryCount: {
    fontSize: 11,
    color: "#8F96B3",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  filterRow: {
    marginBottom: 16,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: 6,
  },

  filterChipTextActive: {
    color: "#fff",
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

  fileIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  playBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(21, 24, 51, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  fileName: {
    fontWeight: "700",
    maxWidth: 180,
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
    marginBottom: 20,
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
