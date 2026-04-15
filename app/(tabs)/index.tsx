import HomeHeader from "@/components/HomeHeader";
import RemainingCaloriesCard from "@/components/RemainingCaloriesCard";
import WeekCalendar from "@/components/WeekCalendar";
import { Colors } from "@/constants/Colors";
import { useDate } from "@/context/DateContext";
import { ActivityLog, deleteLog, getLogsByDate } from "@/services/logService";
import { getUserProfile, UserProfile } from "@/services/userService";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { selectedDate, setSelectedDate } = useDate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      console.log("Fetching data for date:", selectedDate);
      const [profile, dailyLogs] = await Promise.all([
        getUserProfile(user.id),
        getLogsByDate(user.id, selectedDate),
      ]);
      setUserProfile(profile);
      setLogs(dailyLogs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleDeleteLog = (logId: string) => {
    console.log("handleDeleteLog called for:", logId);
    setLogToDelete(logId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!logToDelete) return;
    try {
      console.log("Confirmed delete for logId:", logToDelete);
      await deleteLog(logToDelete);
      console.log("Delete successful. Refreshing...");
      setIsDeleteModalVisible(false);
      setLogToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      Alert.alert("Error", "Failed to delete log");
    }
  };

  const handleEditLog = (log: ActivityLog) => {
    router.push({
      pathname: "/(tabs)/plus",
      params: {
        logId: log.id,
        name: log.name,
        calories: log.calories?.toString(),
        protein: log.protein?.toString(),
        carbs: log.carbs?.toString(),
        fat: log.fat?.toString(),
      }
    });
  };

  const totals = logs.reduce(
    (acc, log) => {
      if (log.type === "exercise") {
        acc.exerciseCalories += log.calories || 0;
      } else {
        acc.foodCalories += log.calories || 0;
        acc.protein += log.protein || 0;
        acc.carbs += log.carbs || 0;
        acc.fat += log.fat || 0;
      }
      return acc;
    },
    { foodCalories: 0, exerciseCalories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const goals = {
    calories: userProfile?.dailyCalories || 2000,
    protein: userProfile?.proteins || 150,
    carbs: userProfile?.carbs || 250,
    fat: userProfile?.fats || 70,
  };

  const consumed = totals.foodCalories;
  const burned = totals.exerciseCalories;
  const netCalories = consumed - burned;
  const remainingCalories = Math.max(0, goals.calories + burned - consumed);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RemainingCaloriesCard
          key={`rem-cal-${goals.calories}-${consumed}-${burned}`}
          total={goals.calories + burned}
          consumed={consumed}
          remaining={remainingCalories}
          protein={totals.protein}
          carbs={totals.carbs}
          fat={totals.fat}
        />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>

          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
          ) : logs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="nutrition-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyStateText}>No logs for this day yet.</Text>
            </View>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.logName}>{log.name}</Text>
                  <Text style={styles.logType}>{log.type}</Text>
                </View>

                <View style={styles.logActions}>
                  <Text style={styles.logCalories}>{log.calories} kcal</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => handleEditLog(log)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="pencil" size={18} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Delete button pressed for log:", log.id);
                        handleDeleteLog(log.id!);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={20} color={Colors.textDark} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconContainer}>
              <Ionicons name="trash-outline" size={32} color="#FF3B30" />
            </View>
            <Text style={styles.deleteTitle}>Delete Activity?</Text>
            <Text style={styles.deleteSubtitle}>Are you sure you want to remove this log? This action cannot be undone.</Text>

            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmDeleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    paddingBottom: 110, // Space for tab bar
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
    marginTop: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  emptyStateText: {
    color: Colors.textMuted,
    marginTop: 12,
    fontSize: 14,
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  logType: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "capitalize",
    marginTop: 2,
  },
  logCalories: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  logActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginTop: 40,
  },
  signOutText: { fontSize: 16, fontWeight: "700", color: Colors.textDark },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalContent: {
    backgroundColor: Colors.surface,
    width: "85%",
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  deleteSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  deleteActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceDark,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmDeleteBtn: {
    flex: 1,
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmDeleteBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
