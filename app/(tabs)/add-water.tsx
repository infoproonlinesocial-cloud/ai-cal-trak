import { Colors } from "@/constants/Colors";
import { useDate } from "@/context/DateContext";
import { addLog } from "@/services/logService";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GLASS_ML = 500;
const HALF_GLASS_ML = 250;
const MAX_ML = GLASS_ML * 4;

export default function AddWaterScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { selectedDate } = useDate();
  
  const [ml, setMl] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleIncrement = () => {
    if (ml < MAX_ML) {
      setMl(prev => prev + HALF_GLASS_ML);
    }
  };

  const handleDecrement = () => {
    if (ml > 0) {
      setMl(prev => prev - HALF_GLASS_ML);
    }
  };

  const handleSave = async () => {
    if (ml === 0) {
      Alert.alert("Wait", "Please add some water intake first.");
      return;
    }
    if (!user) return;

    try {
      setIsSubmitting(true);
      await addLog({
        userId: user.id,
        date: selectedDate,
        type: "water",
        name: "Water Intake",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        quantity: ml,
      });

      setShowSuccess(true);
      setTimeout(() => {
        handleFinish();
      }, 1500);
    } catch (error) {
      Alert.alert("Error", "Failed to log water intake.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setShowSuccess(false);
    router.replace("/(tabs)");
  };

  const renderGlasses = () => {
    if (ml === 0) {
      return (
        <Image
          source={require("@/assets/images/empty_glass.png")}
          style={styles.bigGlass}
          resizeMode="contain"
        />
      );
    }

    const fullGlasses = Math.floor(ml / GLASS_ML);
    const hasHalf = (ml % GLASS_ML) === HALF_GLASS_ML;
    const glasses = [];

    for (let i = 0; i < fullGlasses; i++) {
        glasses.push(
            <Image
                key={`full-${i}`}
                source={require("@/assets/images/full_glass.png")}
                style={fullGlasses > 1 ? styles.smallGlass : styles.bigGlass}
                resizeMode="contain"
            />
        );
    }

    if (hasHalf) {
        glasses.push(
            <Image
                key="half"
                source={require("@/assets/images/half_glass.png")}
                style={fullGlasses >= 1 ? styles.smallGlass : styles.bigGlass}
                resizeMode="contain"
            />
        );
    }

    return (
        <View style={styles.glassesContainer}>
            {glasses}
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Water Intake</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.glassDisplay}>
          {renderGlasses()}
        </View>

        <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.counterBtn} onPress={handleDecrement}>
                <Ionicons name="remove" size={32} color={Colors.primary} />
            </TouchableOpacity>
            
            <View style={styles.mlDisplay}>
                <Text style={styles.mlText}>{ml}</Text>
                <Text style={styles.mlUnit}>ml</Text>
            </View>

            <TouchableOpacity style={styles.counterBtn} onPress={handleIncrement}>
                <Ionicons name="add" size={32} color={Colors.primary} />
            </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logBtn, isSubmitting && styles.disabledBtn]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.textDark} />
          ) : (
            <Text style={styles.logBtnText}>Log Water</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color={Colors.textDark} />
            </View>
            <Text style={styles.successTitle}>Logged!</Text>
            <Text style={styles.successSubtitle}>Water intake has been saved.</Text>
          </View>
        </View>
      )}
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
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
  glassDisplay: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  glassesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  bigGlass: {
    width: 200,
    height: 300,
  },
  smallGlass: {
    width: 100,
    height: 150,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
  counterBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mlDisplay: {
    alignItems: "center",
  },
  mlText: {
    fontSize: 48,
    fontWeight: "900",
    color: Colors.text,
  },
  mlUnit: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  logBtn: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: 56,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logBtnText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: "700",
  },
  disabledBtn: {
    opacity: 0.6,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
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
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
