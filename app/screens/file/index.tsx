import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Files</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="filter" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.menuContainer}>
          <FileItem name="Report.pdf" icon="document-text" />
          <FileItem name="Invoice.docx" icon="document" />
          <FileItem name="Image.png" icon="image" />
        </View>
      </ScrollView>
    </View>
  );
}

function FileItem({ name, icon }: { name: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={20} color="#fff" />
        </View>

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

  menuIcon: { width: 50, height: 50, borderRadius: 15, backgroundColor: "#FF914D", justifyContent: "center", alignItems: "center", marginRight: 15 },

  menuText: { fontSize: 16, fontWeight: "600", color: "#1B1D4D" },
});