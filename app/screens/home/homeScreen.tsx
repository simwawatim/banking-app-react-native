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
  MaterialIcons
} from "@expo/vector-icons";

import { router } from "expo-router";
import { useState } from "react";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const mockResults = [
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

  const filteredResults = mockResults.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="menu"
            size={24}
            color="#1B1D4D"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Home</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#1B1D4D"
          />
        </TouchableOpacity>
      </View> */}

      {/* SEARCH BAR */}
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
          placeholderTextColor="#9AA3C7"
        />
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

            <Text style={styles.storageSub}>
              130GB / 512GB
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/all")}
          >
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: "#5B7CFA" },
              ]}
            >
              <MaterialIcons
                name="grid-view"
                size={24}
                color="#fff"
              />
            </View>

            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/folders")}
          >
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: "#59C2FF" },
              ]}
            >
              <Ionicons
                name="folder"
                size={22}
                color="#fff"
              />
            </View>

            <Text style={styles.categoryText}>
              Folder
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/files")}
          >
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: "#FF914D" },
              ]}
            >
              <Ionicons
                name="document-text"
                size={22}
                color="#fff"
              />
            </View>

            <Text style={styles.categoryText}>Files</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push("/people")}
          >
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: "#FF5E8A" },
              ]}
            >
              <Ionicons
                name="people"
                size={22}
                color="#fff"
              />
            </View>

            <Text style={styles.categoryText}>People</Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {search.length > 0 && (
          <>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>
                Search Results
              </Text>

              <Text style={styles.resultCount}>
                {filteredResults.length} found
              </Text>
            </View>

            {filteredResults.map((item, index) => (
              <View
                key={index}
                style={styles.fileCard}
              >
                <View style={styles.fileLeft}>
                  <View
                    style={[
                      styles.fileIcon,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color="#fff"
                    />
                  </View>

                  <View>
                    <Text style={styles.fileName}>
                      {item.name}
                    </Text>

                    <Text style={styles.fileSize}>
                      {item.size}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color="#7B7B9D"
                />
              </View>
            ))}

            {filteredResults.length === 0 && (
              <View style={styles.emptyBox}>
                <Ionicons
                  name="search"
                  size={60}
                  color="#D0D5E5"
                />

                <Text style={styles.emptyTitle}>
                  No Results Found
                </Text>

                <Text style={styles.emptySub}>
                  Try another file name
                </Text>
              </View>
            )}
          </>
        )}

        {/* Recent Files */}
        {search.length === 0 && (
          <>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>
                Recent files
              </Text>

              <TouchableOpacity>
                <Text style={styles.seeAll}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <FileCard
              icon="play"
              color="#5B7CFA"
              name="Preview.mp4"
              size="8 MB"
            />

            <FileCard
              icon="image"
              color="#FF5E8A"
              name="Wallpaper.jpg"
              size="4.8 MB"
            />

            <FileCard
              icon="musical-notes"
              color="#FF914D"
              name="Music.mp3"
              size="12 MB"
            />
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
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
          <Ionicons
            name="cloud-upload"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <NavItem
          icon="document-text"
          label="Files"
          active={false}
          onPress={() => router.push("/files")}
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

/* FILE CARD */
function FileCard({
  icon,
  color,
  name,
  size,
}: {
  icon: any;
  color: string;
  name: string;
  size: string;
}) {
  return (
    <View style={styles.fileCard}>
      <View style={styles.fileLeft}>
        <View
          style={[
            styles.fileIcon,
            { backgroundColor: color },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color="#fff"
          />
        </View>

        <View>
          <Text style={styles.fileName}>{name}</Text>
          <Text style={styles.fileSize}>{size}</Text>
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

/* NAVIGATION ITEM */
function NavItem({
  icon,
  label,
  onPress,
  active,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  active: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={24}
        color={active ? "#22C7B8" : "#9AA3C7"}
      />

      <Text
        style={
          active
            ? styles.navTextActive
            : styles.navText
        }
      >
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

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1B1D4D",
  },

  storageCard: {
    backgroundColor: "#39D2C0",
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: 65,
    height: 65,
    borderRadius: 20,
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
    alignItems: "center",
    marginBottom: 18,
  },

  recentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  resultCount: {
    color: "#8F96B3",
    fontWeight: "600",
  },

  seeAll: {
    color: "#22C7B8",
    fontWeight: "700",
  },

  fileCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  fileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  fileIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
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

  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 40,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1D4D",
    marginTop: 15,
  },

  emptySub: {
    color: "#8F96B3",
    marginTop: 5,
  },

  bottomNav: {
    height: 85,
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 15,
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#22C7B8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    elevation: 5,
  },
});