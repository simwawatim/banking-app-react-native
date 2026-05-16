import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";

import {
    Ionicons
} from "@expo/vector-icons";

export default function LoginScreen() {
  const handleGoBackToSplash = () => {
    router.push("/");
  };

  const goToRegister = () => {
    router.push("/register");
  };

  const goToHome = () => {
    router.push("/home");
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBackToSplash}
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
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue managing your
          files and cloud storage.
        </Text>
      </View>
      
      {/* Divider */}


      {/* Form Card */}
      <View style={styles.formCard}>
        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Username or Email
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#8F96B3"
            />

            <TextInput
              placeholder="Enter username or email"
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
              placeholderTextColor="#8F96B3"
              secureTextEntry
              style={styles.input}
            />

            <Ionicons
              name="eye-off-outline"
              size={20}
              color="#8F96B3"
            />
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={goToHome}
        >
          <Ionicons
            name="log-in-outline"
            size={20}
            color="#fff"
          />

          <Text style={styles.loginText}>
            Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* Register */}
      <TouchableOpacity
        onPress={goToRegister}
      >
        <Text style={styles.registerText}>
          Don’t have an account?{" "}
          <Text style={styles.registerLink}>
            Register
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

  forgotText: {
    textAlign: "right",
    color: "#22C7B8",
    fontWeight: "600",
    marginBottom: 25,
  },

  loginBtn: {
    backgroundColor: "#22C7B8",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },

  registerText: {
    textAlign: "center",
    marginBottom: 40,
    color: "#8F96B3",
    fontSize: 15,
  },

  registerLink: {
    color: "#22C7B8",
    fontWeight: "700",
  },
});