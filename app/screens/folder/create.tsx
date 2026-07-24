import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createFolder } from "@/app/api/clients/folder";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function CreateFolderScreen() {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Folder name cannot be empty");
      return;
    }

    setSubmitting(true);
    const response = await createFolder({ folder_name: name.trim() });
    setSubmitting(false);

    if (response.status === "success") {
      router.back();
    } else {
      Alert.alert("Error", response.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Ionicons name="close" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Folder</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleCreate}
          disabled={submitting}
        >
          <Ionicons name="checkmark" size={24} color="#22C7B8" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Folder Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter folder name"
          style={styles.input}
          editable={!submitting}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Folder</Text>
          )}
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
