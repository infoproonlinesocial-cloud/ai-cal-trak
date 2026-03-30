import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeft01Icon as LeftArrowIcon,
  ArrowRight01Icon as RightArrowIcon,
  UserIcon,
  BodyWeightIcon as WeightIcon,
  RulerIcon,
  Calendar01Icon,
  Dumbbell02Icon,
  Task01Icon,
  Tick01Icon,
} from "hugeicons-react-native";
import { Colors } from "@/constants/Colors";
import { updateOnboardingData, UserProfile } from "@/services/userService";

const { width } = Dimensions.get("window");

const STEPS = [
  { id: "gender", title: "Select Gender", subtitle: "Help us customize your experience" },
  { id: "goal", title: "What's your goal?", subtitle: "Choose what you want to achieve" },
  { id: "workout", title: "Workout Frequency", subtitle: "How active are you?" },
  { id: "birthdate", title: "Birth Date", subtitle: "Tell us when you were born" },
  { id: "stats", title: "Body Stats", subtitle: "Your weight and height" },
];

export default function OnboardingScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: undefined,
    goal: undefined,
    workoutFrequency: undefined,
    birthdate: { month: "", year: "" },
    weight: "",
    height: "",
  });

  useEffect(() => {
    // Load saved progress if any
    const loadProgress = async () => {
      try {
        const savedData = await AsyncStorage.getItem("onboarding_data");
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      } catch (e) {
        console.error("Failed to load onboarding progress", e);
      }
    };
    loadProgress();
  }, []);

  const saveProgress = async (data: Partial<UserProfile>) => {
    try {
      await AsyncStorage.setItem("onboarding_data", JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save onboarding progress", e);
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      saveProgress(formData);
    } else {
      // Finish onboarding
      if (user) {
        await updateOnboardingData(user.id, {
          ...formData,
          isOnboardingComplete: true,
        });
        await AsyncStorage.removeItem("onboarding_data");
        router.replace("/results");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (key: keyof UserProfile | string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    const step = STEPS[currentStep];
    switch (step.id) {
      case "gender":
        return (
          <View style={styles.stepContainer}>
            <View style={styles.optionsGrid}>
              {[
                { label: "Male", value: "male", icon: UserIcon },
                { label: "Female", value: "female", icon: UserIcon },
                { label: "Other", value: "other", icon: UserIcon },
              ].map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionCard,
                    formData.gender === item.value && styles.optionCardSelected,
                  ]}
                  onPress={() => updateFormData("gender", item.value)}
                >
                  <item.icon size={32} color={formData.gender === item.value ? Colors.white : Colors.textSecondary} />
                  <Text style={[styles.optionLabel, formData.gender === item.value && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case "goal":
        return (
          <View style={styles.stepContainer}>
             <View style={styles.listOptions}>
              {[
                { label: "Gain Weight", value: "gain", icon: Task01Icon },
                { label: "Lose Weight", value: "lose", icon: Task01Icon },
                { label: "Maintain", value: "maintain", icon: Tick01Icon },
              ].map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.listOptionCard,
                    formData.goal === item.value && styles.optionCardSelected,
                  ]}
                  onPress={() => updateFormData("goal", item.value)}
                >
                  <View style={styles.iconCircle}>
                    <item.icon size={24} color={formData.goal === item.value ? Colors.white : Colors.primary} />
                  </View>
                  <Text style={[styles.listOptionLabel, formData.goal === item.value && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case "workout":
        return (
          <View style={styles.stepContainer}>
            <View style={styles.listOptions}>
              {[
                { label: "2-3 Days / Week", value: "2-3-days", icon: Dumbbell02Icon },
                { label: "3-4 Days / Week", value: "3-4-days", icon: Dumbbell02Icon },
                { label: "6-7 Days / Week", value: "6-7-days", icon: Dumbbell02Icon },
              ].map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.listOptionCard,
                    formData.workoutFrequency === item.value && styles.optionCardSelected,
                  ]}
                  onPress={() => updateFormData("workoutFrequency", item.value)}
                >
                   <View style={styles.iconCircle}>
                    <item.icon size={24} color={formData.workoutFrequency === item.value ? Colors.white : Colors.primary} />
                  </View>
                  <Text style={[styles.listOptionLabel, formData.workoutFrequency === item.value && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case "birthdate":
        return (
          <View style={styles.stepContainer}>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Month</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM"
                  placeholderTextColor={Colors.textPlaceholder}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={formData.birthdate?.month}
                  onChangeText={(text) => updateFormData("birthdate", { ...formData.birthdate, month: text })}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Year</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY"
                  placeholderTextColor={Colors.textPlaceholder}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={formData.birthdate?.year}
                  onChangeText={(text) => updateFormData("birthdate", { ...formData.birthdate, year: text })}
                />
              </View>
            </View>
          </View>
        );
      case "stats":
        return (
          <View style={styles.stepContainer}>
            <View style={styles.statInputs}>
               <View style={styles.inputWrapperFull}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <View style={styles.inputWithIcon}>
                  <WeightIcon size={20} color={Colors.textSecondary} style={styles.innerIcon} />
                  <TextInput
                    style={styles.textInputFull}
                    placeholder="e.g. 70"
                    placeholderTextColor={Colors.textPlaceholder}
                    keyboardType="numeric"
                    value={formData.weight}
                    onChangeText={(text) => updateFormData("weight", text)}
                  />
                </View>
              </View>
               <View style={styles.inputWrapperFull}>
                <Text style={styles.inputLabel}>Height (feet)</Text>
                <View style={styles.inputWithIcon}>
                  <RulerIcon size={20} color={Colors.textSecondary} style={styles.innerIcon} />
                  <TextInput
                    style={styles.textInputFull}
                    placeholder="e.g. 5.9"
                    placeholderTextColor={Colors.textPlaceholder}
                    keyboardType="numeric"
                    value={formData.height}
                    onChangeText={(text) => updateFormData("height", text)}
                  />
                </View>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    const step = STEPS[currentStep];
    switch (step.id) {
      case "gender": return !!formData.gender;
      case "goal": return !!formData.goal;
      case "workout": return !!formData.workoutFrequency;
      case "birthdate": return !!formData.birthdate?.month && !!formData.birthdate?.year;
      case "stats": return !!formData.weight && !!formData.height;
      default: return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} disabled={currentStep === 0} style={styles.backButton}>
            <LeftArrowIcon size={24} color={currentStep === 0 ? "transparent" : Colors.text} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / STEPS.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>Step {currentStep + 1} of {STEPS.length}</Text>
          </View>
          <View style={styles.backButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View 
            key={currentStep} 
            entering={SlideInRight.duration(400)} 
            exiting={SlideOutLeft.duration(400)}
            style={styles.content}
          >
            <Text style={styles.title}>{STEPS[currentStep].title}</Text>
            <Text style={styles.subtitle}>{STEPS[currentStep].subtitle}</Text>
            {renderStep()}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, !isStepValid() && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isStepValid()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === STEPS.length - 1 ? "Finish" : "Next"}
            </Text>
            <RightArrowIcon size={20} color={Colors.textDark} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
  },
  progressBackground: {
    height: 6,
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
    alignItems: "center",
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
    marginBottom: 40,
  },
  stepContainer: {
    width: "100%",
  },
  optionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  optionCard: {
    width: (width - 64) / 3,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  optionLabel: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  optionLabelSelected: {
    color: Colors.white,
  },
  listOptions: {
    width: "100%",
    gap: 16,
  },
  listOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryGlow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  listOptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statInputs: {
    gap: 20,
  },
  inputWrapperFull: {
    width: "100%",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  innerIcon: {
    marginRight: 12,
  },
  textInputFull: {
    flex: 1,
    paddingVertical: 16,
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    height: 56,
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: "700",
  },
});
