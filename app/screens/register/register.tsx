import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signup } from "../../api/api";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setErrorMessage("");

    if (!email || !username || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const result = await signup({ username, email, password });

    if (result.status === "success" && result.data) {
      const { access, refresh, user } = result.data;

      await AsyncStorage.setItem("access_token", access);
      await AsyncStorage.setItem("refresh_token", refresh);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      router.replace("/home");
    } else {
      setErrorMessage(
        result.message || "Registration failed. Please try again.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={22} color="#1B1D4D" />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to get started, it only takes a minute.
          </Text>
        </View>

        <View style={styles.formCard}>
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color="#D64545" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Work Email</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#8F96B3" />

              <TextInput
                placeholder="Enter email"
                placeholderTextColor="#8F96B3"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isSubmitting}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#8F96B3" />

              <TextInput
                placeholder="Enter username"
                placeholderTextColor="#8F96B3"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#8F96B3" />

              <TextInput
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#8F96B3"
                style={styles.inputSecure}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                editable={!isSubmitting}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#8F96B3"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#8F96B3"
              />

              <TextInput
                placeholder="Re-enter password"
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#8F96B3"
                style={styles.inputSecure}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                editable={!isSubmitting}
              />

              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#8F96B3"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.registerBtn,
              isSubmitting && styles.registerBtnDisabled,
            ]}
            onPress={handleRegister}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.registerText}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.loginText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={isSubmitting} animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#22C7B8" />
            <Text style={styles.loadingText}>Creating your account…</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  iconButton: {
    width: 46,
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1B1D4D",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  welcomeCard: {
    backgroundColor: "#22C7B8",
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#22C7B8",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },

  subtitle: {
    color: "#EFFFFC",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
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
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#1B1D4D",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEC",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 8,
  },

  errorText: {
    color: "#D64545",
    fontSize: 13,
    flex: 1,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    marginBottom: 7,
    fontWeight: "600",
    color: "#1B1D4D",
    fontSize: 13,
  },

  inputContainer: {
    backgroundColor: "#F5F7FB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF1F8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    minHeight: 56,
  },

  input: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    color: "#1B1D4D",
    fontSize: 15,
    paddingVertical: 12,
  },

  inputSecure: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    color: "#1B1D4D",
    fontSize: 15,
    paddingVertical: 12,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  registerBtn: {
    backgroundColor: "#22C7B8",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 6,
    shadowColor: "#22C7B8",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  registerBtnDisabled: {
    opacity: 0.7,
  },

  registerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },

  switchText: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 10,
    color: "#8F96B3",
    fontSize: 14,
  },

  loginText: {
    color: "#22C7B8",
    fontWeight: "700",
  },

  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(27, 29, 77, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 36,
    alignItems: "center",
    gap: 12,
    shadowColor: "#1B1D4D",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  loadingText: {
    color: "#1B1D4D",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 4,
  },
});
