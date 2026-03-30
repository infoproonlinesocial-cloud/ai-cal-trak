import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="nutrition" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.greeting}>
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! 👋
        </Text>
        <Text style={styles.sub}>Your AI Calorie Tracker is ready.</Text>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={20} color={Colors.textDark} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryGlow,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  sub: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: "center",
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
  },
  signOutText: { fontSize: 16, fontWeight: "700", color: Colors.textDark },
});
