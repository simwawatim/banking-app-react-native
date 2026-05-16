import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function ProfileScreen() {
  const [editVisible, setEditVisible] =
    useState(false);

  const [name, setName] = useState(
    "Kulamwa Malusa"
  );
  const [email, setEmail] = useState(
    "kulamwa@example.com"
  );

  const [tempName, setTempName] =
    useState(name);
  const [tempEmail, setTempEmail] =
    useState(email);

  const saveProfile = () => {
    setName(tempName);
    setEmail(tempEmail);
    setEditVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/home")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#1B1D4D"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Profile
        </Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/settings")}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color="#1B1D4D"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/300",
            }}
            style={styles.profileImage}
          />

          <Text style={styles.userName}>
            {name}
          </Text>

          <Text style={styles.userEmail}>
            {email}
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditVisible(true)}
          >
            <Text
              style={styles.editButtonText}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* STORAGE (MOCK ONLY) */}
        <View style={styles.storageCard}>
          <View>
            <Text style={styles.storageTitle}>
              Storage
            </Text>
            <Text style={styles.storageText}>
              130GB used of 512GB
            </Text>
          </View>

          <Text style={styles.storagePercent}>
            80%
          </Text>
        </View>

      </ScrollView>

      {/* EDIT PROFILE MODAL (MOCK UPDATE) */}
      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Edit Profile
            </Text>

            <TextInput
              value={tempName}
              onChangeText={setTempName}
              style={styles.input}
              placeholder="Name"
            />

            <TextInput
              value={tempEmail}
              onChangeText={setTempEmail}
              style={styles.input}
              placeholder="Email"
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={saveProfile}
            >
              <Text style={styles.saveText}>
                Save Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setEditVisible(false)
              }
            >
              <Text style={styles.cancel}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- MENU ITEM ---------------- */
function MenuItem({
  icon,
  color,
  label,
}: any) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
    >
      <View
        style={[
          styles.menuIcon,
          { backgroundColor: color },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#fff"
        />
      </View>

      <Text style={styles.menuText}>
        {label}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9AA3C7"
      />
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

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    alignItems: "center",
    padding: 30,
    marginBottom: 20,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },

  userName: {
    fontSize: 22,
    fontWeight: "700",
  },

  userEmail: {
    color: "#8F96B3",
    marginBottom: 15,
  },

  editButton: {
    backgroundColor: "#22C7B8",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
  },

  editButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  storageCard: {
    backgroundColor: "#22C7B8",
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  storageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  storageText: {
    color: "#fff",
    marginTop: 5,
  },

  storagePercent: {
    color: "#fff",
    fontSize: 26,
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#F5F7FB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#22C7B8",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
  },

  cancel: {
    textAlign: "center",
    marginTop: 10,
    color: "#FF5E8A",
    fontWeight: "600",
  },
});