import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function AddPeopleScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addPerson = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    Alert.alert("Success", `${name} added successfully`);
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

        <Text style={styles.headerTitle}>Add Person</Text>

        <TouchableOpacity style={styles.iconButton} onPress={addPerson}>
          <Ionicons name="checkmark" size={24} color="#22C7B8" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          style={styles.input}
        />

        <Text style={styles.label}>Email (optional)</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          style={styles.input}
        />

        {/* Avatar Preview */}
        <View style={styles.avatarPreview}>
          <Text style={styles.avatarText}>
            {name ? name[0].toUpperCase() : "?"}
          </Text>
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.button} onPress={addPerson}>
          <Ionicons name="person-add" size={18} color="#fff" />
          <Text style={styles.buttonText}>Add Person</Text>
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
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 20,
  },

  label: {
    fontSize: 14,
    color: "#8F96B3",
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    backgroundColor: "#F5F7FB",
    padding: 15,
    borderRadius: 15,
  },

  avatarPreview: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#5B7CFA",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 25,
  },

  avatarText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
  },

  button: {
    backgroundColor: "#22C7B8",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
});