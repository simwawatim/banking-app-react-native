import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function PeopleScreen() {
  const [people, setPeople] = useState([
    { id: "1", name: "John Doe", online: true },
    { id: "2", name: "Sarah Kim", online: false },
    { id: "3", name: "Alex Johnson", online: true },
  ]);

  const removePerson = (id: string) => {
    Alert.alert("Remove Person", "Remove this contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setPeople((prev) => prev.filter((p) => p.id !== id)),
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

        <Text style={styles.headerTitle}>People</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/addPeople")}
        >
          <Ionicons name="person-add" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8F96B3" />
        <TextInput
          placeholder="Search people..."
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {people.map((item) => (
            <PeopleItem
              key={item.id}
              item={item}
              onDelete={() => removePerson(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* PEOPLE ITEM */
function PeopleItem({ item, onDelete }: { item: { id: string; name: string; online: boolean }; onDelete: () => void }) {
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>

          {/* Online dot */}
          {item.online && <View style={styles.onlineDot} />}
        </View>

        <View>
          <Text style={styles.menuText}>{item.name}</Text>
          <Text style={styles.statusText}>
            {item.online ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash" size={18} color="#FF5E5E" />
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
    fontSize: 22,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
    height: 50,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
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

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5B7CFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C7B8",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1D4D",
  },

  statusText: {
    fontSize: 12,
    color: "#8F96B3",
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteBtn: {
    padding: 6,
    backgroundColor: "#FFECEC",
    borderRadius: 10,
    marginRight: 10,
  },
});