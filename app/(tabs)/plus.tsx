import { Colors } from "@/constants/Colors";
import { useDate } from "@/context/DateContext";
import { addLog, updateLog } from "@/services/logService";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddLogScreen() {
  const { user } = useUser();
  const router = useRouter();
  const params = useLocalSearchParams();
  const logId = params.logId as string;

  const { selectedDate } = useDate();
  const [foodName, setFoodName] = useState((params.name as string) || "");
  const [calories, setCalories] = useState((params.calories as string) || "");
  const [protein, setProtein] = useState((params.protein as string) || "");
  const [carbs, setCarbs] = useState((params.carbs as string) || "");
  const [fat, setFat] = useState((params.fat as string) || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (logId) {
      setFoodName((params.name as string) || "");
      setCalories((params.calories as string) || "");
      setProtein((params.protein as string) || "");
      setCarbs((params.carbs as string) || "");
      setFat((params.fat as string) || "");
    } else {
      setFoodName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
    }
  }, [logId]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [nameError, setNameError] = useState("");
  const [caloriesError, setCaloriesError] = useState("");

  const validate = () => {
    let isValid = true;
    if (!foodName.trim()) {
      setNameError("Food name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!calories.trim()) {
      setCaloriesError("Calories are required");
      isValid = false;
    } else if (isNaN(parseInt(calories))) {
      setCaloriesError("Please enter a valid number");
      isValid = false;
    } else {
      setCaloriesError("");
    }

    return isValid;
  };

  const handleAddLog = async () => {
    if (!validate()) return;
    if (!user) return;

    try {
      setIsSubmitting(true);
      const logData = {
        userId: user.id,
        date: selectedDate,
        type: "food" as "food",
        name: foodName,
        calories: parseInt(calories),
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
      };

      if (logId) {
        await updateLog(logId, logData);
      } else {
        await addLog(logData);
      }

      setShowSuccess(true);
      // Automatically redirect after 2 seconds or on button press
      setTimeout(() => {
        handleFinish();
      }, 2000);

    } catch (error) {
      Alert.alert("Error", logId ? "Failed to update log" : "Failed to add log");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");

    setShowSuccess(false);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{logId ? "Edit Activity" : "Add Activity"}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>What did you eat?</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="e.g. Chicken Salad"
              placeholderTextColor={Colors.textMuted}
              value={foodName}
              onChangeText={(text) => {
                setFoodName(text);
                if (nameError) setNameError("");
              }}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          <View>
            <Text style={styles.label}>Calories (kcal)</Text>
            <TextInput
              style={[styles.input, caloriesError ? styles.inputError : null]}
              placeholder="e.g. 350"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={calories}
              onChangeText={(text) => {
                setCalories(text);
                if (caloriesError) setCaloriesError("");
              }}
            />
            {caloriesError ? <Text style={styles.errorText}>{caloriesError}</Text> : null}
          </View>

          <View style={styles.macrosRow}>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={protein}
                onChangeText={setProtein}
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={fat}
                onChangeText={setFat}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
            onPress={handleAddLog}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.textDark} />
            ) : (
              <Text style={styles.submitBtnText}>{logId ? "Update Log" : "Save Log"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color={Colors.textDark} />
            </View>
            <Text style={styles.successTitle}>{logId ? "Successfully Updated!" : "Successfully Added!"}</Text>
            <Text style={styles.successSubtitle}>Your activity has been {logId ? "updated" : "logged"}.</Text>

            <TouchableOpacity style={styles.successBtn} onPress={handleFinish}>
              <Text style={styles.successBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  form: { gap: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
  },
  macrosRow: {
    flexDirection: "row",
    gap: 12,
  },
  macroInput: {
    flex: 1,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: { opacity: 0.6 },
  submitBtnText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: "700",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    backgroundColor: Colors.surface,
    padding: 32,
    borderRadius: 32,
    alignItems: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  successBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
  },
  successBtnText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: "700",
  },
  inputError: {
    borderColor: "rgba(255, 59, 48, 0.5)",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
});
