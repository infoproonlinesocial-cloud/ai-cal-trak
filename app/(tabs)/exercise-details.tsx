import { Colors } from '@/constants/Colors';
import { useDate } from '@/context/DateContext';
import { addLog } from '@/services/logService';
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft01Icon,
    FireIcon,
    Task01Icon
} from 'hugeicons-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const INTENSITY_LEVELS = ['Low', 'Medium', 'High'];
const DURATION_OPTIONS = [15, 30, 60, 90];

export default function ExerciseDetailsScreen() {
    const { user } = useUser();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { selectedDate } = useDate();
    const { type, title, description } = params;

    const [intensity, setIntensity] = useState(1); // 0: Low, 1: Medium, 2: High
    const [duration, setDuration] = useState('30');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDurationSelect = (val: number) => {
        setDuration(val.toString());
    };

    const calculateCalories = () => {
        const mins = parseInt(duration) || 0;
        const baseKcal = type === 'cardio' ? 10 : 6;
        const multiplier = intensity === 0 ? 0.7 : intensity === 1 ? 1 : 1.4;
        return Math.round(mins * baseKcal * multiplier);
    };

    const handleContinue = async () => {
        if (!user) return;
        const kcal = calculateCalories();
        
        try {
            setIsSubmitting(true);
            await addLog({
                userId: user.id,
                date: selectedDate,
                type: 'exercise',
                name: `${title} (${INTENSITY_LEVELS[intensity]})`,
                calories: kcal,
                protein: 0,
                carbs: 0,
                fat: 0
            });
            
            router.replace("/(tabs)");
        } catch (error) {
            console.error("Error saving exercise:", error);
            Alert.alert("Error", "Failed to save exercise. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft01Icon size={28} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Exercise Details</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.duration(600)}>
                        <View style={styles.infoCard}>
                            <Text style={styles.optionTitle}>{title}</Text>
                            <Text style={styles.optionDescription}>{description}</Text>
                        </View>
                    </Animated.View>

                    {type === 'cardio' && (
                        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <FireIcon size={20} color={Colors.primary} />
                                <Text style={styles.sectionLabel}>Intensity of Workout</Text>
                            </View>
                            
                            <View style={styles.sliderContainer}>
                                <View style={styles.sliderTrack}>
                                    <View style={[styles.sliderActiveTrack, { width: `${(intensity / 2) * 100}%` }]} />
                                </View>
                                <View style={styles.sliderPoints}>
                                    {INTENSITY_LEVELS.map((level, index) => (
                                        <TouchableOpacity
                                            key={level}
                                            style={styles.sliderPointWrapper}
                                            onPress={() => setIntensity(index)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={[
                                                styles.sliderThumb,
                                                intensity === index && styles.sliderThumbActive
                                            ]} />
                                            <Text style={[
                                                styles.sliderLabel,
                                                intensity === index && styles.sliderLabelActive
                                            ]}>
                                                {level}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </Animated.View>
                    )}

                    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Task01Icon size={20} color={Colors.primary} />
                            <Text style={styles.sectionLabel}>Duration (Minutes)</Text>
                        </View>

                        <View style={styles.chipContainer}>
                            {DURATION_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.chip,
                                        duration === opt.toString() && styles.chipActive
                                    ]}
                                    onPress={() => handleDurationSelect(opt)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        duration === opt.toString() && styles.chipTextActive
                                    ]}>
                                        {opt} min
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.manualInputContainer}>
                            <Text style={styles.inputLabel}>Enter manually</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="e.g. 45"
                                placeholderTextColor={Colors.textPlaceholder}
                                keyboardType="numeric"
                                value={duration}
                                onChangeText={(text) => setDuration(text.replace(/[^0-9]/g, ''))}
                            />
                        </View>
                    </Animated.View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]}
                        activeOpacity={0.8}
                        onPress={handleContinue}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={Colors.textDark} />
                        ) : (
                            <Text style={styles.continueButtonText}>Continue</Text>
                        )}
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10,
        gap: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 150,
    },
    infoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 32,
    },
    optionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 8,
    },
    optionDescription: {
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    sliderContainer: {
        height: 80,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        position: 'absolute',
        left: 20,
        right: 20,
    },
    sliderActiveTrack: {
        height: 4,
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    sliderPoints: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sliderPointWrapper: {
        alignItems: 'center',
        width: 60,
    },
    sliderThumb: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.background,
        borderWidth: 3,
        borderColor: Colors.border,
        marginBottom: 8,
    },
    sliderThumbActive: {
        borderColor: Colors.primary,
        transform: [{ scale: 1.2 }],
    },
    sliderLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    sliderLabelActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipActive: {
        backgroundColor: Colors.primaryTransparent,
        borderColor: Colors.primary,
    },
    chipText: {
        fontSize: 15,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    chipTextActive: {
        color: Colors.primary,
    },
    manualInputContainer: {
        gap: 12,
    },
    inputLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        marginLeft: 4,
    },
    textInput: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: Colors.background,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    continueButton: {
        backgroundColor: Colors.primary,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonDisabled: {
        opacity: 0.6,
        backgroundColor: Colors.textSecondary,
    },
    continueButtonText: {
        color: Colors.textDark,
        fontSize: 18,
        fontWeight: '700',
    },
});
