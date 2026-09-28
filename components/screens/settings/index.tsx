import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function SettingsScreen() {
  /* SECURITY SETTINGS */
  const [multiTLS, setMultiTLS] = useState(true);
  const [certPinning, setCertPinning] =
    useState(true);
  const [encryption, setEncryption] =
    useState(true);

  /* STEGANOGRAPHY SETTINGS (MOCK) */
  const [stegoEnabled, setStegoEnabled] =
    useState(false);
  const [level, setLevel] = useState("Medium");

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
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

        <Text style={styles.headerTitle}>
          Settings
        </Text>

        <View style={styles.iconButton}>
          <Ionicons
            name="settings"
            size={22}
            color="#1B1D4D"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* SECURITY SECTION */}
        <Text style={styles.sectionTitle}>
          Security
        </Text>

        <SettingItem
          title="Multi-TLS Mode"
          subtitle="Use multiple secure transport layers"
          value={multiTLS}
          onChange={setMultiTLS}
        />

        <SettingItem
          title="Certificate Pinning"
          subtitle="Prevent unauthorized server access"
          value={certPinning}
          onChange={setCertPinning}
        />

        <SettingItem
          title="Encryption Layer"
          subtitle="Enable data encryption for transfers"
          value={encryption}
          onChange={setEncryption}
        />

        {/* STEGANOGRAPHY SECTION */}
        <Text style={styles.sectionTitle}>
          Steganography
        </Text>

        <SettingItem
          title="Enable Stego Mode"
          subtitle="Hide metadata inside media files"
          value={stegoEnabled}
          onChange={setStegoEnabled}
        />

        <View style={styles.levelBox}>
          <Text style={styles.levelTitle}>
            Stego Level
          </Text>

          <View style={styles.levelRow}>
            {["Low", "Medium", "High"].map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.levelBtn,
                    level === item &&
                      styles.levelActive,
                  ]}
                  onPress={() => setLevel(item)}
                >
                  <Text
                    style={
                      level === item
                        ? styles.levelTextActive
                        : styles.levelText
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* ADVANCED */}
        <Text style={styles.sectionTitle}>
          Advanced
        </Text>

        <TouchableOpacity
          style={styles.actionItem}
        >
          <Text style={styles.actionText}>
            Clear Cache
          </Text>
          <Ionicons
            name="trash"
            size={18}
            color="#FF5E8A"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
        >
          <Text style={styles.actionText}>
            Reset Settings
          </Text>
          <Ionicons
            name="refresh"
            size={18}
            color="#FF914D"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionItem,
            { marginBottom: 40 },
          ]}
        >
          <Text style={styles.actionText}>
            App Version 1.0.0
          </Text>
          <Ionicons
            name="information-circle"
            size={18}
            color="#5B7CFA"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* TOGGLE ITEM */
function SettingItem({
  title,
  subtitle,
  value,
  onChange,
}: any) {
  return (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>
          {title}
        </Text>
        <Text style={styles.itemSub}>
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: "#D0D5E5",
          true: "#22C7B8",
        }}
      />
    </View>
  );
}

/* STYLES */
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
    marginBottom: 20,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#1B1D4D",
  },

  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  itemSub: {
    fontSize: 12,
    color: "#8F96B3",
    marginTop: 3,
  },

  levelBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
  },

  levelTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  levelBtn: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: "#F5F7FB",
    alignItems: "center",
  },

  levelActive: {
    backgroundColor: "#22C7B8",
  },

  levelText: {
    color: "#1B1D4D",
  },

  levelTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  actionItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },

  actionText: {
    fontWeight: "600",
  },
});