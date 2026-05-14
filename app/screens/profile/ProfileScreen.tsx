import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={22} color="#1B1D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/300",
            }}
            style={styles.profileImage}
          />

          <Text style={styles.userName}>Kulamwa Malusa</Text>

          <Text style={styles.userEmail}>
            kulamwa@example.com
          </Text>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Storage Card */}
        <View style={styles.storageCard}>
          <View>
            <Text style={styles.storageTitle}>Storage</Text>
            <Text style={styles.storageText}>
              130GB used of 512GB
            </Text>
          </View>

          <Text style={styles.storagePercent}>80%</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: "#5B7CFA" },
                ]}
              >
                <Ionicons name="folder" size={20} color="#fff" />
              </View>

              <Text style={styles.menuText}>My Files</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9AA3C7"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: "#22C7B8" },
                ]}
              >
                <Ionicons name="cloud-upload" size={20} color="#fff" />
              </View>

              <Text style={styles.menuText}>Uploads</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9AA3C7"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: "#FF914D" },
                ]}
              >
                <MaterialIcons
                  name="security"
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.menuText}>Privacy</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9AA3C7"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: "#FF5E8A" },
                ]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.menuText}>Logout</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9AA3C7"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    elevation: 2,
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
    marginBottom: 25,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },

  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  userEmail: {
    fontSize: 15,
    color: "#8F96B3",
    marginTop: 6,
    marginBottom: 20,
  },

  editButton: {
    backgroundColor: "#22C7B8",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },

  editButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  storageCard: {
    backgroundColor: "#22C7B8",
    borderRadius: 25,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  storageTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  storageText: {
    color: "#EFFFFC",
    marginTop: 5,
  },

  storagePercent: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
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

  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1D4D",
  },
});