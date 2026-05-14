import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";

export default function LoginScreen() {
    const handleGoBackToSplash = () => {
        router.push("/");
    };
    const goToRegister = () => {
        router.push("/register");
    };

    const goToHome = () => {
        console.log("To home clicked")
        router.push("/home")
    };
    return (
        <View style={styles.container}>

            {/* Back Button */}
            <TouchableOpacity
                onPress={handleGoBackToSplash}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.title}>Let's Sign you in.</Text>
            <Text style={styles.subtitle}>Welcome Back {"\n"}You've been missed!</Text>

            {/* Inputs */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username or Email</Text>
                <TextInput
                    placeholder="Enter Username or Email"
                    style={styles.input}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordBox}>
                    <TextInput
                        placeholder="Enter Password"
                        secureTextEntry
                        style={{ flex: 1 }}
                    />
                    <Ionicons name="eye-off-outline" size={20} color="gray" />
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={{ marginHorizontal: 10, color: "gray" }}>or</Text>
                <View style={styles.line} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                    <AntDesign name="google" size={22} color="#DB4437" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialBtn}>
                    <FontAwesome name="linkedin" size={22} color="#0077B5" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialBtn}>
                    <FontAwesome name="facebook" size={22} color="#1877F2" />
                </TouchableOpacity>
            </View>

            {/* Register */}
             <Text style={styles.registerText}>
                Don’t have an account?{" "}
                <TouchableOpacity onPress={goToRegister}>
                <Text style={{ fontWeight: "bold", color: "blue" }}>
                    Register
                </Text>
                </TouchableOpacity>
            </Text>

            {/* Login Button */}
            <TouchableOpacity 
                style={styles.loginBtn}
                onPress={goToHome}
            >
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },

    backButton: {
        marginTop: 40,
        marginBottom: 10,
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 10,
    },

    subtitle: {
        color: "gray",
        marginTop: 5,
        marginBottom: 30,
    },

    inputContainer: {
        marginBottom: 15,
    },

    label: {
        marginBottom: 5,
        fontWeight: "500",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
    },

    passwordBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 12,
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ddd",
    },

    socialRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },

    socialBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 10,
        width: 60,
        alignItems: "center",
    },

    registerText: {
        textAlign: "center",
        marginBottom: 20,
        color: "gray",
    },

    loginBtn: {
        backgroundColor: "#170556",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
    },

    loginText: {
        color: "white",
        fontWeight: "bold",
    },
});