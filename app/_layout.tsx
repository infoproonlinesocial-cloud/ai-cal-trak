import { ClerkProvider, ClerkLoaded, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/tokenCache";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { saveUserToFirestore } from "@/services/userService";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function InitialLayout() {
  const { isLoaded, isSignedIn, user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  // Navigation Logic
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    }
  }, [isLoaded, isSignedIn, segments]);

  // Firebase Sync Logic
  useEffect(() => {
    if (isSignedIn && user) {
      console.log("🔄 Syncing user to Firestore:", user.id);
      saveUserToFirestore({
        uid: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        displayName: user.fullName,
        photoURL: user.imageUrl,
        provider: user.externalAccounts?.[0]?.provider ?? "email",
      })
      .then(() => console.log("✅ User synced to Firestore successfully"))
      .catch((err) => console.error("❌ Firebase Sync Error:", err));
    }
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0A0E1A" }}>
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
