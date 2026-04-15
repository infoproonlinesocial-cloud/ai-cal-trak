import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Notification01Icon } from "hugeicons-react-native";
import { Colors } from "@/constants/Colors";

export default function HomeHeader() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>{user?.firstName || "User"}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
        <Notification01Icon size={24} color={Colors.text} variant="stroke" />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  textContainer: {
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
  },
});
