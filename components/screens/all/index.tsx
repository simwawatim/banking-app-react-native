import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AllScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#1B1D4D"
          />
        </TouchableOpacity>

        <Text style={styles.title}>All Files</Text>

        {/* MENU BUTTON */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="grid-outline"
            size={22}
            color="#1B1D4D"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.grid}>
          <Card
            title="Folders"
            icon="folder"
            color="#5B7CFA"
            onPress={() => router.push("/folders")}
          />

          <Card
            title="Files"
            icon="document-text"
            color="#FF914D"
            onPress={() => router.push("/files")}
          />

          <Card
            title="People"
            icon="people"
            color="#FF5E8A"
            onPress={() => router.push("/people")}
          />

          <Card
            title="Uploads"
            icon="cloud-upload"
            color="#22C7B8"
            onPress={() => router.push("/upload")}
          />
        </View>

        {/* Recent Section */}
        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

        <View style={styles.card}>
          <View
            style={[
              styles.cardIcon,
              { backgroundColor: "#EEF2FF" },
            ]}
          >
            <Ionicons
              name="cloud-upload"
              size={20}
              color="#5B7CFA"
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Project.mp4 uploaded
            </Text>
            <Text style={styles.cardSub}>
              2 minutes ago
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View
            style={[
              styles.cardIcon,
              { backgroundColor: "#FFF3EA" },
            ]}
          >
            <Ionicons
              name="folder"
              size={20}
              color="#FF914D"
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Work Files created
            </Text>
            <Text style={styles.cardSub}>
              Yesterday
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View
            style={[
              styles.cardIcon,
              { backgroundColor: "#FFF0F5" },
            ]}
          >
            <Ionicons
              name="people"
              size={20}
              color="#FF5E8A"
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              John Doe added
            </Text>
            <Text style={styles.cardSub}>
              3 days ago
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Card({
  title,
  icon,
  color,
  onPress,
}: {
  title: string;
  icon: any;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.box, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={30} color="#fff" />
      <Text style={styles.boxText}>{title}</Text>
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

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  box: {
    width: "48%",
    height: 130,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },

  boxText: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 12,
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1D4D",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  cardSub: {
    fontSize: 12,
    color: "#8F96B3",
    marginTop: 4,
  },
});