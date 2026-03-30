import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  Tick01Icon,
  FireIcon,
  DropletIcon,
  Dumbbell02Icon,
  EnergyIcon,
  Bread01Icon,
  Home01Icon,
} from "hugeicons-react-native";
import { Colors } from "@/constants/Colors";
import { getUserProfile, updateOnboardingData, UserProfile } from "@/services/userService";
import { generateNutritionPlan, NutritionPlan } from "@/services/geminiService";

export default function ResultsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState("Gathering your profile...");
  const [plan, setPlan] = useState<NutritionPlan | null>(null);

  useEffect(() => {
    if (user) {
      fetchAndGeneratePlan();
    }
  }, [user]);

  const fetchAndGeneratePlan = async () => {
    try {
      setLoading(true);
      setLoadingInfo("Fetching your data...");
      
      const profile = await getUserProfile(user!.id);
      
      if (!profile) {
        setLoadingInfo("Profile not found. Please complete onboarding.");
        return;
      }

      // If plan already exists in profile, use it
      if (profile.dailyCalories && profile.proteins) {
        setPlan({
          dailyCalories: profile.dailyCalories,
          proteins: profile.proteins,
          carbs: profile.carbs || 0,
          fats: profile.fats || 0,
          waterIntake: profile.waterIntake || 0,
          fitnessResponse: profile.fitnessResponse || "",
        });
        setLoading(false);
        return;
      }

      // Otherwise generate new plan
      setLoadingInfo("AI is calculating your daily needs...");
      const generatedPlan = await generateNutritionPlan(profile);
      
      setLoadingInfo("Optimizing your macro distribution...");
      setPlan(generatedPlan);

      setLoadingInfo("Saving your personalized plan...");
      await updateOnboardingData(user!.id, {
        ...generatedPlan,
        isOnboardingComplete: true,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error in results screen:", error);
      setLoadingInfo("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{loadingInfo}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.title}>Your Personalized Plan</Text>
          <Text style={styles.subtitle}>Based on your goals and body metrics</Text>
        </Animated.View>

        <View style={styles.grid}>
          <Card
            icon={<FireIcon size={24} color={Colors.primary} />}
            label="Daily Calories"
            value={`${plan?.dailyCalories} kcal`}
            delay={100}
          />
          <Card
            icon={<DropletIcon size={24} color="#3B82F6" />}
            label="Water Intake"
            value={`${plan?.waterIntake} Liters`}
            delay={200}
          />
          <Card
            icon={<EnergyIcon size={24} color="#F59E0B" />}
            label="Proteins"
            value={`${plan?.proteins}g`}
            delay={300}
          />
          <Card
            icon={<Bread01Icon size={24} color="#8B4513" />}
            label="Carbs"
            value={`${plan?.carbs}g`}
            delay={400}
          />
           <Card
            icon={<Dumbbell02Icon size={24} color="#EC4899" />}
            label="Fats"
            value={`${plan?.fats}g`}
            delay={500}
          />
        </View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.aiBrief}>
          <View style={styles.aiHeader}>
            <Tick01Icon size={20} color={Colors.primary} />
            <Text style={styles.aiTitle}>AI Fitness Insight</Text>
          </View>
          <Text style={styles.aiText}>{plan?.fitnessResponse}</Text>
        </Animated.View>

        <TouchableOpacity 
          style={styles.finishButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Home01Icon size={20} color={Colors.textDark} />
          <Text style={styles.finishButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ icon, label, value, delay }: { icon: any; label: string; value: string; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.card}>
      <View style={styles.cardIcon}>{icon}</View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  card: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },
  aiBrief: {
    backgroundColor: Colors.primaryTransparent,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
    marginBottom: 32,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  aiText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
    opacity: 0.9,
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    height: 56,
    gap: 8,
  },
  finishButtonText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
