import { ClerkProvider, ClerkLoaded, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/tokenCache";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { saveUserToFirestore, getUserProfile } from "@/services/userService";
import { Colors } from "@/constants/Colors";
import { useState } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function InitialLayout() {
  const { isLoaded, isSignedIn, user } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  // Profile and Navigation Logic
  useEffect(() => {
    async function checkProfile() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setProfileLoading(false);
        const inAuthGroup = segments[0] === "(auth)";
        if (!inAuthGroup) {
          router.replace("/(auth)/sign-in");
        }
        return;
      }

      // User is signed in, check profile
      try {
        const profile = await getUserProfile(user.id);
        const completed = profile?.isOnboardingComplete ?? false;
        setIsOnboardingComplete(completed);
        setProfileLoading(false);

        const inAuthGroup = segments[0] === "(auth)";
        const inOnboarding = segments[0] === "onboarding";

        if (completed) {
          if (inAuthGroup || inOnboarding) {
            router.replace("/(tabs)");
          }
        } else {
          if (!inOnboarding) {
            router.replace("/onboarding");
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        setProfileLoading(false);
      }
    }

    checkProfile();
  }, [isLoaded, isSignedIn, segments, user?.id]);

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

  if (!isLoaded || profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="results" options={{ headerShown: false }} />
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
