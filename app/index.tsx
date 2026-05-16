import { router } from "expo-router";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#22C7B8" />

      {/* Center Content */}
      <View style={styles.content}>
        <Image
          source={require("../assets/images/credit-card.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Cloud Storage
        </Text>

        <Text style={styles.subtitle}>
          Store and manage your files easily
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22C7B8",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#EFFFFC",
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
  },

  buttonText: {
    color: "#22C7B8",
    fontWeight: "700",
    fontSize: 16,
  },
});