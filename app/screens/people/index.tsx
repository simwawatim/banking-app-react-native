import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function PeopleScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>People</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.menuContainer}>
          <PeopleItem name="John Doe" />
          <PeopleItem name="Sarah Kim" />
          <PeopleItem name="Alex Johnson" />
        </View>
      </ScrollView>
    </View>
  );
}

function PeopleItem({ name }: { name: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />

        <Text style={styles.menuText}>{name}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9AA3C7" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", paddingTop: 60, paddingHorizontal: 20 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },

  iconButton: { width: 50, height: 50, backgroundColor: "#fff", borderRadius: 15, justifyContent: "center", alignItems: "center" },

  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1B1D4D" },

  menuContainer: { marginBottom: 30 },

  menuItem: { backgroundColor: "#fff", borderRadius: 20, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },

  menuLeft: { flexDirection: "row", alignItems: "center" },

  avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 15 },

  menuText: { fontSize: 16, fontWeight: "600", color: "#1B1D4D" },
});