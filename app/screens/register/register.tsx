import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {

    return (
        <View style={styles.container}>

            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.title}>Let's get you started.</Text>
            <Text style={styles.subtitle}>Start your journey with us.</Text>

            {/* Social Login */}
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

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={{ marginHorizontal: 10, color: "gray" }}>OR</Text>
                <View style={styles.line} />
            </View>

            {/* Work Email */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Work Email</Text>
                <TextInput placeholder="Enter Email" style={styles.input} />
            </View>

            {/* Username */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <TextInput placeholder="Enter Username" style={styles.input} />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordBox}>
                    <TextInput placeholder="Enter Password" secureTextEntry style={{ flex: 1 }} />
                    <Ionicons name="eye-off-outline" size={20} color="gray" />
                </View>
            </View>

            {/* Re-Password */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Re-Password</Text>
                <View style={styles.passwordBox}>
                    <TextInput placeholder="Re-enter Password" secureTextEntry style={{ flex: 1 }} />
                    <Ionicons name="eye-off-outline" size={20} color="gray" />
                </View>
            </View>

            {/* Switch to Login */}
            <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.switchText}>
                    Have an account? <Text style={{ fontWeight: "bold" }}>Login</Text>
                </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity style={styles.registerBtn}>
                <Text style={styles.registerText}>Register</Text>
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

    backBtn: {
        marginTop: 40,
        marginBottom: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
    },

    subtitle: {
        color: "gray",
        marginTop: 5,
        marginBottom: 20,
    },

    socialRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },

    socialBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 10,
        width: 60,
        alignItems: "center",
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ddd",
    },

    inputGroup: {
        marginBottom: 12,
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

    switchText: {
        textAlign: "center",
        marginVertical: 15,
        color: "gray",
    },

    registerBtn: {
        backgroundColor: "#170556",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
    },

    registerText: {
        color: "white",
        fontWeight: "bold",
    },
});