import { Colors } from "@/constants/Colors";
import { useDate } from "@/context/DateContext";
import { addLog } from "@/services/logService";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ArrowLeft01Icon, FireIcon } from "hugeicons-react-native";
import React, { useState } from "react";
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
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";

export default function ManualCaloriesScreen() {
    const { user } = useUser();
    const router = useRouter();
    const { selectedDate } = useDate();
    const [calories, setCalories] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [caloriesError, setCaloriesError] = useState("");

    const validate = () => {
        if (!calories.trim()) {
            setCaloriesError("Calories are required");
            return false;
        } else if (isNaN(parseInt(calories))) {
            setCaloriesError("Please enter a valid number");
            return false;
        }
        setCaloriesError("");
        return true;
    };

    const handleLogCalories = async () => {
        // if (!validate()) return;
        if (!user) return;

        try {
            setIsSubmitting(true);
            const logData = {
                userId: user.id,
                date: selectedDate,
                type: "exercise" as const,
                name: "Manual Calorie Entry",
                calories: parseInt(calories),
                protein: 0,
                carbs: 0,
                fat: 0,
            };

            await addLog(logData);
            setShowSuccess(true);
            // Automatically redirect after 2 seconds
            setTimeout(() => {
                //router.replace("/(tabs)");
            }, 4000);




        } catch (error) {
            console.error("Error logging calories:", error);
            Alert.alert("Error", "Failed to log calories");
        } finally {
            setShowSuccess(false);
            setCalories("");
            setIsSubmitting(false);
            router.replace("/(tabs)");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft01Icon size={28} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Manual Entry</Text>
                    <View style={{ width: 44 }} />
                </View>

                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.form}>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconWrapper}>
                            <FireIcon size={48} color={Colors.primary} variant="stroke" />
                        </View>
                    </View>

                    <Text style={styles.label}>Enter Calories Count</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, caloriesError ? styles.inputError : null]}
                            placeholder="0"
                            placeholderTextColor={Colors.textSecondary}
                            keyboardType="numeric"
                            value={calories}
                            onChangeText={(text) => {
                                setCalories(text.replace(/[^0-9]/g, ''));
                                if (caloriesError) setCaloriesError("");
                            }}
                            autoFocus
                        />
                        <Text style={styles.unitText}>kcal</Text>
                    </View>

                    {caloriesError ? <Text style={styles.errorText}>{caloriesError}</Text> : null}

                    <View style={styles.spacer} />

                    <TouchableOpacity
                        style={[styles.logButton, isSubmitting && styles.disabledButton]}
                        onPress={handleLogCalories}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={Colors.textDark} />
                        ) : (
                            <Text style={styles.logButtonText}>Log Calories</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>

            {/* Success Overlay */}
            {showSuccess && (
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.successOverlay}
                >
                    <Animated.View
                        entering={FadeInDown.springify()}
                        style={styles.successCard}
                    >
                        <View style={styles.successIconContainer}>
                            <FireIcon size={40} color={Colors.textDark} variant="stroke" />
                        </View>
                        <Text style={styles.successTitle}>Successfully Added!</Text>
                        <Text style={styles.successSubtitle}>Your manual calorie entry has been logged.</Text>

                        <TouchableOpacity
                            style={styles.successBtn}
                            onPress={() => router.replace("/(tabs)")}
                        >
                            <Text style={styles.successBtnText}>Done</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 100,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primaryTransparent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    input: {
        fontSize: 48,
        fontWeight: '800',
        color: Colors.primary,
        textAlign: 'center',
        minWidth: 100,
        paddingVertical: 10,
    },
    unitText: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 16,
    },
    inputError: {
        color: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    spacer: {
        flex: 1,
    },
    logButton: {
        backgroundColor: Colors.primary,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 24,
    },
    disabledButton: {
        opacity: 0.6,
    },
    logButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textDark,
    },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    successCard: {
        backgroundColor: Colors.surface,
        padding: 32,
        borderRadius: 32,
        alignItems: "center",
        width: "85%",
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
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 50,
    },
    successBtnText: {
        color: Colors.textDark,
        fontSize: 16,
        fontWeight: "700",
    },
});
