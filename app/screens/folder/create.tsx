import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function CreateFolderScreen() {
  const [name, setName] = useState("");

  const createFolder = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Folder name cannot be empty");
      return;
    }

    Alert.alert("Success", `Folder "${name}" created`);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Folder</Text>

        <TouchableOpacity style={styles.iconButton} onPress={createFolder}>
          <Ionicons name="checkmark" size={24} color="#22C7B8" />
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View style={styles.form}>
        <Text style={styles.label}>Folder Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter folder name"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={createFolder}>
          <Text style={styles.buttonText}>Create Folder</Text>
        </TouchableOpacity>
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
    marginBottom: 40,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },

  label: {
    fontSize: 14,
    color: "#8F96B3",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#F5F7FB",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#5B7CFA",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});