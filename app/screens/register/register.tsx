import {
    Ionicons
} from "@expo/vector-icons";

import { router } from "expo-router";

import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RegisterScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#1B1D4D"
          />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Start managing your files and storage
          beautifully.
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Work Email
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8F96B3"
            />

            <TextInput
              placeholder="Enter email"
              placeholderTextColor="#8F96B3"
              style={styles.input}
            />
          </View>
        </View>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Username
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#8F96B3"
            />

            <TextInput
              placeholder="Enter username"
              placeholderTextColor="#8F96B3"
              style={styles.input}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8F96B3"
            />

            <TextInput
              placeholder="Enter password"
              secureTextEntry
              placeholderTextColor="#8F96B3"
              style={styles.input}
            />

            <Ionicons
              name="eye-off-outline"
              size={20}
              color="#8F96B3"
            />
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#8F96B3"
            />

            <TextInput
              placeholder="Re-enter password"
              secureTextEntry
              placeholderTextColor="#8F96B3"
              style={styles.input}
            />

            <Ionicons
              name="eye-off-outline"
              size={20}
              color="#8F96B3"
            />
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerBtn}
        >
          <Ionicons
            name="person-add"
            size={20}
            color="#fff"
          />

          <Text style={styles.registerText}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
      >
        <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text style={styles.loginText}>
            Login
          </Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
    fontSize: 22,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  welcomeCard: {
    backgroundColor: "#22C7B8",
    borderRadius: 30,
    padding: 25,
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    color: "#EFFFFC",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  socialBtn: {
    width: "30%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDE3F0",
  },

  dividerText: {
    marginHorizontal: 10,
    color: "#8F96B3",
    fontSize: 12,
    fontWeight: "600",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    marginBottom: 25,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#1B1D4D",
  },

  inputContainer: {
    backgroundColor: "#F5F7FB",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: "#1B1D4D",
    fontSize: 15,
  },

  registerBtn: {
    backgroundColor: "#22C7B8",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },

  registerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },

  switchText: {
    textAlign: "center",
    marginBottom: 40,
    color: "#8F96B3",
    fontSize: 15,
  },

  loginText: {
    color: "#22C7B8",
    fontWeight: "700",
  },
});