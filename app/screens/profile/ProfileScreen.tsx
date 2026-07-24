import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { logout } from "@/app/api/api";
import {
  getProfile,
  updateProfile,
  updateProfilePicture,
} from "@/app/api/client";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300";

export default function ProfileScreen() {
  const [editVisible, setEditVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalError, setModalError] = useState("");

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const displayName =
    [firstName, lastName].filter(Boolean).join(" ").trim() || username;

  useEffect(() => {
    loadProfile();
  }, []);

  const applyProfile = (profile: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string | null;
  }) => {
    setUsername(profile.username);
    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
    setEmail(profile.email);
    setProfilePicture(profile.profile_picture || null);
    setTempFirstName(profile.first_name || "");
    setTempLastName(profile.last_name || "");
    setTempEmail(profile.email);
  };

  const loadProfile = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const token = await AsyncStorage.getItem("access_token");

    if (!token) {
      setIsLoading(false);
      router.replace("/login");
      return;
    }

    const result = await getProfile();

    if (result.status === "success" && result.data) {
      applyProfile(result.data);
    } else {
      setErrorMessage(result.message || "Could not load your profile.");
    }

    setIsLoading(false);
  };

  const openEditModal = () => {
    setTempFirstName(firstName);
    setTempLastName(lastName);
    setTempEmail(email);
    setModalError("");
    setEditVisible(true);
  };

  const saveProfile = async () => {
    if (!tempEmail.trim()) {
      setModalError("Email is required.");
      return;
    }

    setModalError("");
    setIsSaving(true);

    const result = await updateProfile({
      first_name: tempFirstName.trim(),
      last_name: tempLastName.trim(),
      email: tempEmail.trim(),
    });

    if (result.status === "success" && result.data) {
      applyProfile(result.data);
      setEditVisible(false);
    } else {
      setModalError(result.message || "Could not save your changes.");
    }

    setIsSaving(false);
  };

  const changeProfilePicture = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to update your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    const filename = asset.uri.split("/").pop() || "profile.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : "image/jpeg";

    const formData = new FormData();
    formData.append("profile_picture", {
      uri: asset.uri,
      name: filename,
      type: fileType,
    } as any);

    setIsUploadingPhoto(true);

    const uploadResult = await updateProfilePicture(formData);

    if (uploadResult.status === "success" && uploadResult.data) {
      applyProfile(uploadResult.data);
    } else {
      Alert.alert(
        "Upload failed",
        uploadResult.message || "Could not update your profile picture.",
      );
    }

    setIsUploadingPhoto(false);
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);

          const refreshToken = await AsyncStorage.getItem("refresh_token");

          if (refreshToken) {
            await logout({ refresh: refreshToken });
          }

          await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

          setIsLoggingOut(false);
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="arrow-back" size={22} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings-outline" size={20} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#22C7B8" />
            <Text style={styles.loadingBoxText}>Loading profile…</Text>
          </View>
        ) : (
          <>
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#D64545"
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* PROFILE CARD */}
            <View style={styles.profileCard}>
              <TouchableOpacity
                onPress={changeProfilePicture}
                disabled={isUploadingPhoto}
                style={styles.avatarWrap}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: profilePicture || DEFAULT_AVATAR }}
                  style={styles.profileImage}
                />

                <View style={styles.avatarEditBadge}>
                  {isUploadingPhoto ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="camera" size={16} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userHandle}>@{username}</Text>

              <Text style={styles.userEmail}>{email}</Text>

              <TouchableOpacity
                style={styles.editButton}
                onPress={openEditModal}
                activeOpacity={0.85}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* STORAGE (MOCK ONLY) */}
            <View style={styles.storageCard}>
              <View>
                <Text style={styles.storageTitle}>Storage</Text>
                <Text style={styles.storageText}>130GB used of 512GB</Text>
              </View>

              <Text style={styles.storagePercent}>80%</Text>
            </View>

            {/* LOGOUT */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={isLoggingOut}
              activeOpacity={0.85}
            >
              {isLoggingOut ? (
                <ActivityIndicator color="#FF5E8A" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={20} color="#FF5E8A" />
                  <Text style={styles.logoutButtonText}>Log Out</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {modalError ? (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#D64545"
                />
                <Text style={styles.errorText}>{modalError}</Text>
              </View>
            ) : null}

            <TextInput
              value={tempFirstName}
              onChangeText={setTempFirstName}
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#8F96B3"
              editable={!isSaving}
            />

            <TextInput
              value={tempLastName}
              onChangeText={setTempLastName}
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#8F96B3"
              editable={!isSaving}
            />

            <TextInput
              value={tempEmail}
              onChangeText={setTempEmail}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8F96B3"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isSaving}
            />

            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={saveProfile}
              activeOpacity={0.85}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditVisible(false)}
              disabled={isSaving}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- MENU ITEM ---------------- */
function MenuItem({ icon, color, label }: any) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={[styles.menuIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>

      <Text style={styles.menuText}>{label}</Text>

      <Ionicons name="chevron-forward" size={20} color="#9AA3C7" />
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
    marginBottom: 25,
  },

  iconButton: {
    width: 46,
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1B1D4D",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },

  loadingBoxText: {
    color: "#8F96B3",
    fontSize: 14,
    fontWeight: "600",
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

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    alignItems: "center",
    padding: 28,
    marginBottom: 20,
    shadowColor: "#1B1D4D",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  profileImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
    marginBottom: 14,
    backgroundColor: "#F5F7FB",
  },

  avatarWrap: {
    marginBottom: 14,
  },

  avatarEditBadge: {
    position: "absolute",
    bottom: 14,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#22C7B8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  userName: {
    fontSize: 21,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  userHandle: {
    color: "#8F96B3",
    fontSize: 13,
    marginTop: 2,
  },

  userEmail: {
    color: "#8F96B3",
    marginTop: 6,
    marginBottom: 16,
  },

  editButton: {
    backgroundColor: "#22C7B8",
    paddingVertical: 11,
    paddingHorizontal: 26,
    borderRadius: 15,
    shadowColor: "#22C7B8",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  editButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  storageCard: {
    backgroundColor: "#22C7B8",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  storageTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  storageText: {
    color: "#EFFFFC",
    marginTop: 4,
    fontSize: 13,
  },

  storagePercent: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#FFE1EA",
  },

  logoutButtonText: {
    color: "#FF5E8A",
    fontSize: 15,
    fontWeight: "700",
  },

  menuContainer: {
    marginBottom: 30,
  },

  menuItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
  },

  /* MODAL */
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(27, 29, 77, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1B1D4D",
  },

  input: {
    backgroundColor: "#F5F7FB",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    color: "#1B1D4D",
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: "#22C7B8",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  saveBtnDisabled: {
    opacity: 0.7,
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
  },

  cancel: {
    textAlign: "center",
    marginTop: 12,
    color: "#FF5E8A",
    fontWeight: "600",
  },
});
