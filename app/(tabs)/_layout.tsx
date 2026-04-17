import { Colors } from "@/constants/Colors";
import { Tabs, useRouter } from "expo-router";
import {
  Add01Icon,
  ChartBarLineIcon,
  Home01Icon,
  Task01Icon,
  UserIcon
} from "hugeicons-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home01Icon size={24} color={color} variant="stroke" />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => (
            <ChartBarLineIcon size={24} color={color} variant="stroke" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <UserIcon size={24} color={color} variant="stroke" />
          ),
        }}
      />

      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color }) => (
            <Task01Icon size={24} color={color} variant="stroke" />
          ),
        }}
      />

      <Tabs.Screen
        name="log-exercise"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="manual-calories"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Tabs.Screen
        name="exercise-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Tabs.Screen
        name="add-water"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Tabs.Screen
        name="food-database"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Tabs.Screen
        name="log-food-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />


      <Tabs.Screen
        name="plus"
        options={{
          title: "Add",
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/plus")}
              style={styles.fabButton}
            >
              <View style={styles.fabInner}>
                <Add01Icon size={24} color={Colors.textDark} variant="stroke" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 0,
    elevation: 0,
    paddingBottom: 0, // Remove default padding
    paddingTop: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  fabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 70, // Match tab bar height
  },
  fabInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Glow effect
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});
