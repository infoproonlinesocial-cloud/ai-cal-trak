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
  const [currentStep, setCurrentStep] = useState(0);
  const [isAIComplete, setIsAIComplete] = useState(false);
  const [plan, setPlan] = useState<NutritionPlan | null>(null);

  const steps = [
    "Gathering your profile...",
    "Analyzing body metrics...",
    "Calculating daily calorie needs...",
    "Optimizing macronutrients...",
    "Finalizing your personalized plan...",
  ];

  useEffect(() => {
    if (user) {
      fetchAndGeneratePlan();
    }
  }, [user]);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        // Stop at the second to last step if AI isn't ready
        if (prev === steps.length - 2 && !isAIComplete) {
          return prev;
        }
        // If we reach the last step and AI is ready, finish loading after a brief delay
        if (prev === steps.length - 1) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [loading, isAIComplete]);

  const fetchAndGeneratePlan = async () => {
    try {
      const profile = await getUserProfile(user!.id);
      
      if (!profile) {
        setLoading(false); // Handle error case
        router.replace("/onboarding");
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
        setIsAIComplete(true);
        return;
      }

      // Otherwise generate new plan
      const generatedPlan = await generateNutritionPlan(profile);
      setPlan(generatedPlan);

      await updateOnboardingData(user!.id, {
        ...generatedPlan,
        isOnboardingComplete: true,
      });

      setIsAIComplete(true);
    } catch (error) {
      console.error("Error in results screen:", error);
      // In case of error, we might want to show an error state
      setIsAIComplete(true); // Still allow timer to finish or show error
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingHeader}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingTitle}>Generating your plan</Text>
          </View>
          
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              
              return (
                <Animated.View 
                  key={index} 
                  entering={FadeInDown.delay(index * 100)}
                  style={[
                    styles.stepItem,
                    isCompleted && styles.stepItemCompleted,
                    isActive && styles.stepItemActive
                  ]}
                >
                  <View style={[
                    styles.stepIcon,
                    isCompleted && styles.stepIconCompleted
                  ]}>
                    {isCompleted ? (
                      <Tick01Icon size={16} color={Colors.textDark} />
                    ) : isActive ? (
                      <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                      <View style={styles.stepDot} />
                    )}
                  </View>
                  <Text style={[
                    styles.stepText,
                    isCompleted && styles.stepTextCompleted,
                    isActive && styles.stepTextActive
                  ]}>
                    {step}
                  </Text>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
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
    justifyContent: "center",
    padding: 24,
  },
  loadingContent: {
    backgroundColor: Colors.surface,
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  stepsContainer: {
    gap: 20,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    opacity: 0.4,
  },
  stepItemActive: {
    opacity: 1,
  },
  stepItemCompleted: {
    opacity: 0.8,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
  },
  stepText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  stepTextActive: {
    color: Colors.text,
    fontWeight: "600",
  },
  stepTextCompleted: {
    color: Colors.text,
    textDecorationLine: "none", // Could use 'line-through' if preferred, but usually 'none' is cleaner
  },
});
