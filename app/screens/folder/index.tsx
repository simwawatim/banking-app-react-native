import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function FolderScreen() {
  const [locked, setLocked] = useState(true);

  const [folders, setFolders] = useState([
    { id: "1", name: "Work Files", icon: "briefcase", color: "#5B7CFA" },
    { id: "2", name: "School Docs", icon: "school", color: "#59C2FF", lib: "MaterialIcons" },
    { id: "3", name: "Personal", icon: "person", color: "#FF914D" },
  ]);

  const deleteFolder = (id: string) => {
    Alert.alert("Delete Folder", "Are you sure you want to delete this folder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setFolders((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
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

        <Text style={styles.headerTitle}>Folders</Text>

        <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/folderCreate")}
            >
            <Ionicons name="add" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* NORMAL FOLDERS */}
        <View style={styles.menuContainer}>
          {folders.map((item) => (
            <FolderItem
              key={item.id}
              item={item}
              onDelete={() => deleteFolder(item.id)}
            />
          ))}
        </View>

        {/* SECRET FOLDER */}
        <Text style={styles.sectionTitle}>Secure Folder</Text>

        <TouchableOpacity
          style={styles.secretCard}
          onPress={() => setLocked(!locked)}
        >
          <View style={styles.secretLeft}>
            <View style={styles.secretIcon}>
              <Ionicons
                name={locked ? "lock-closed" : "lock-open"}
                size={22}
                color="#fff"
              />
            </View>

            <View>
              <Text style={styles.secretTitle}>
                {locked ? "Private Vault" : "Unlocked Vault"}
              </Text>
              <Text style={styles.secretText}>
                {locked
                  ? "Tap to unlock secure files"
                  : "Access granted"}
              </Text>
            </View>
          </View>

          <Ionicons
            name={locked ? "eye-off" : "eye"}
            size={22}
            color="#9AA3C7"
          />
        </TouchableOpacity>

        {/* SECRET FILES */}
        {!locked && (
          <View style={styles.menuContainer}>
            <FolderItem
              item={{
                id: "s1",
                name: "Hidden Photos",
                icon: "image",
                color: "#FF5E8A",
              }}
              onDelete={() => Alert.alert("Cannot delete secure file")}
            />

            <FolderItem
              item={{
                id: "s2",
                name: "Private Docs",
                icon: "document-text",
                color: "#22C7B8",
              }}
              onDelete={() => Alert.alert("Cannot delete secure file")}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* Folder Item */
interface FolderItemProps {
  item: {
    id: string;
    name: string;
    icon: string;
    color: string;
    lib?: string;
  };
  onDelete: () => void;
}

function FolderItem({ item, onDelete }: FolderItemProps) {
  const IconComponent =
    item.lib === "MaterialIcons" ? MaterialIcons : Ionicons;

  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
          <IconComponent name={item.icon as any} size={22} color="#fff" />
        </View>

        <Text style={styles.menuText}>{item.name}</Text>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash" size={20} color="#FF5E5E" />
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

  menuContainer: {
    marginBottom: 30,
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

  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1D4D",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  deleteBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#FFECEC",
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1D4D",
    marginBottom: 15,
  },

  secretCard: {
    backgroundColor: "#1B1D4D",
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  secretLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  secretIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FF5E8A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  secretTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  secretText: {
    color: "#B8B8C7",
    fontSize: 12,
    marginTop: 4,
  },
});