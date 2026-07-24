import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getUsers, UserRecord } from "@/app/api/clients/user";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function PeopleScreen() {
  const [people, setPeople] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async (pageToLoad: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError("");

    const result = await getUsers(pageToLoad);

    if (result.status === "success" && result.data) {
      const data = result.data;

      setPeople((prev) => (append ? [...prev, ...data.results] : data.results));
      setHasNext(Boolean(data.next));
      setPage(pageToLoad);
    } else {
      setError(result.message || "Could not load people.");
    }

    if (append) {
      setIsLoadingMore(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(1, false);
  }, [loadUsers]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasNext) return;
    loadUsers(page + 1, true);
  };

  const removePerson = (id: number) => {
    Alert.alert("Remove Person", "Remove this contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setPeople((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  };

  const filteredPeople = useMemo(() => {
    const q = search.toLowerCase();
    return people.filter((p) => {
      const name = displayName(p).toLowerCase();
      return name.includes(q) || p.email.toLowerCase().includes(q);
    });
  }, [people, search]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1B1D4D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>People</Text>

        <View style={styles.iconButtonPlaceholder} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8F96B3" />
        <TextInput
          placeholder="Search people..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color="#D64545" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.emptyBox}>
            <ActivityIndicator size="large" color="#22C7B8" />
          </View>
        ) : filteredPeople.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={60} color="#D0D5E5" />
            <Text style={styles.emptyTitle}>No People Found</Text>
            <Text style={styles.emptySub}>Try a different search</Text>
          </View>
        ) : (
          <>
            <View style={styles.menuContainer}>
              {filteredPeople.map((item) => (
                <PeopleItem
                  key={item.id}
                  item={item}
                  onDelete={() => removePerson(item.id)}
                />
              ))}
            </View>

            {hasNext && !search ? (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <ActivityIndicator size="small" color="#5B7CFA" />
                ) : (
                  <Text style={styles.loadMoreText}>Load More</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function displayName(user: UserRecord) {
  const full = `${user.first_name} ${user.last_name}`.trim();
  return full || user.username;
}

/* PEOPLE ITEM */
function PeopleItem({
  item,
  onDelete,
}: {
  item: UserRecord;
  onDelete: () => void;
}) {
  const name = displayName(item);
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        {/* Avatar */}
        <View style={styles.avatar}>
          {item.profile_picture ? (
            <Image
              source={{ uri: item.profile_picture }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>

        <View>
          <Text style={styles.menuText}>{name}</Text>
          <Text style={styles.statusText}>{item.email}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash" size={18} color="#FF5E5E" />
        </TouchableOpacity>

        <Ionicons name="chevron-forward" size={20} color="#9AA3C7" />
      </View>
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

  iconButtonPlaceholder: {
    width: 50,
    height: 50,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B1D4D",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
    height: 50,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
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

  menuContainer: {
    marginBottom: 15,
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

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5B7CFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
    overflow: "hidden",
  },

  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1D4D",
  },

  statusText: {
    fontSize: 12,
    color: "#8F96B3",
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteBtn: {
    padding: 6,
    backgroundColor: "#FFECEC",
    borderRadius: 10,
    marginRight: 10,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyTitle: {
    fontWeight: "700",
    marginTop: 10,
  },

  emptySub: {
    color: "#8F96B3",
  },

  loadMoreBtn: {
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 30,
  },

  loadMoreText: {
    color: "#5B7CFA",
    fontWeight: "700",
  },
});
