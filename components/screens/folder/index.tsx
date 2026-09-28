import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  deleteFolder as deleteFolderApi,
  Folder,
  getFolders,
  updateFolder as updateFolderApi,
} from "@/api/clients/folder";

const FOLDER_COLORS = ["#5B7CFA", "#59C2FF", "#FF914D", "#22C7B8", "#FF5E8A"];

function colorForId(id: number) {
  return FOLDER_COLORS[id % FOLDER_COLORS.length];
}

export default function FolderScreen() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadFolders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await getFolders();

      if (response.status === "success" && response.data) {
        setFolders(response.data);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load folders. Check your connection.");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [loadFolders]),
  );

  const handleRefresh = () => {
    loadFolders(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Folder",
      "Are you sure you want to delete this folder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const response = await deleteFolderApi(id);

              if (response.status === "success") {
                setFolders((prev) => prev.filter((item) => item.id !== id));
              } else {
                Alert.alert("Error", response.message);
              }
            } catch (error) {
              Alert.alert("Error", "Could not delete folder. Try again.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  };

  const startEdit = (item: Folder) => {
    setEditingId(item.id);
    setEditingName(item.folder_name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id: number) => {
    if (!editingName.trim()) {
      Alert.alert("Error", "Folder name cannot be empty");
      return;
    }

    setUpdatingId(id);
    try {
      const response = await updateFolderApi(id, {
        folder_name: editingName.trim(),
      });

      if (response.status === "success" && response.data) {
        const updated = response.data;
        setFolders((prev) =>
          prev.map((item) => (item.id === id ? updated : item)),
        );
        setEditingId(null);
        setEditingName("");
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Could not rename folder. Try again.");
    } finally {
      setUpdatingId(null);
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

        <Text style={styles.headerTitle}>Folders</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/folderCreate")}
        >
          <Ionicons name="add" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#5B7CFA"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#5B7CFA"
              colors={["#5B7CFA"]}
            />
          }
        >
          {folders.length === 0 ? (
            <Text style={styles.emptyText}>
              No folders yet. Tap + to create one.
            </Text>
          ) : (
            <View style={styles.menuContainer}>
              {folders.map((item) => (
                <FolderItem
                  key={item.id}
                  item={item}
                  deleting={deletingId === item.id}
                  updating={updatingId === item.id}
                  isEditing={editingId === item.id}
                  editingName={editingName}
                  onEditingNameChange={setEditingName}
                  onStartEdit={() => startEdit(item)}
                  onCancelEdit={cancelEdit}
                  onSaveEdit={() => saveEdit(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

interface FolderItemProps {
  item: Folder;
  deleting: boolean;
  updating: boolean;
  isEditing: boolean;
  editingName: string;
  onEditingNameChange: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}

function FolderItem({
  item,
  deleting,
  updating,
  isEditing,
  editingName,
  onEditingNameChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: FolderItemProps) {
  const busy = deleting || updating;

  return (
    <View style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View
          style={[styles.menuIcon, { backgroundColor: colorForId(item.id) }]}
        >
          <Ionicons name="folder" size={22} color="#fff" />
        </View>

        {isEditing ? (
          <TextInput
            value={editingName}
            onChangeText={onEditingNameChange}
            style={styles.editInput}
            editable={!updating}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={onSaveEdit}
          />
        ) : (
          <Text style={styles.menuText} numberOfLines={1}>
            {item.folder_name}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity
              onPress={onSaveEdit}
              style={styles.saveBtn}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#22C7B8" />
              ) : (
                <Ionicons name="checkmark" size={20} color="#22C7B8" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancelEdit}
              style={styles.cancelBtn}
              disabled={updating}
            >
              <Ionicons name="close" size={20} color="#8F96B3" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={onStartEdit}
              style={styles.editBtn}
              disabled={busy}
            >
              <Ionicons name="pencil" size={18} color="#5B7CFA" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteBtn}
              disabled={busy}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#FF5E5E" />
              ) : (
                <Ionicons name="trash" size={20} color="#FF5E5E" />
              )}
            </TouchableOpacity>

            <Ionicons name="chevron-forward" size={20} color="#9AA3C7" />
          </>
        )}
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
  },

  emptyText: {
    textAlign: "center",
    color: "#8F96B3",
    marginTop: 40,
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
    flex: 1,
    marginRight: 10,
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
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1D4D",
  },

  editInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1D4D",
    backgroundColor: "#F5F7FB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  editBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#EEF1FF",
    marginRight: 4,
  },

  deleteBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#FFECEC",
    marginRight: 8,
  },

  saveBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#E9FBF8",
    marginRight: 4,
  },

  cancelBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#F0F1F5",
  },
});
