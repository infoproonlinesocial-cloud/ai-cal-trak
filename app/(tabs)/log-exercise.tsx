import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import {
    ArrowLeft01Icon,
    Cursor01Icon,
    Dumbbell02Icon,
    FireIcon
} from 'hugeicons-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

interface ExerciseOptionProps {
    title: string;
    description: string;
    icon: any;
    onPress: () => void;
    index: number;
}

const ExerciseOption = ({ title, description, icon: Icon, onPress, index }: ExerciseOptionProps) => (
    <Animated.View entering={FadeInRight.delay(200 + index * 100).duration(500)}>
        <TouchableOpacity style={styles.optionCard} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
                <Icon size={28} color={Colors.primary} variant="stroke" />
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Text style={styles.optionDescription}>{description}</Text>
            </View>
        </TouchableOpacity>
    </Animated.View>
);

export default function LogExerciseScreen() {
    const router = useRouter();

    const options = [
        {
            title: "Run",
            description: "Running, Walking, Cycling etc",
            icon: FireIcon,
            onPress: () => router.push({
                pathname: "/(tabs)/exercise-details",
                params: { 
                    type: 'cardio',
                    title: 'Run',
                    description: 'Running, Walking, Cycling etc'
                }
            }),
        },
        {
            title: "Weight Lifting",
            description: "Gym, Machine etc",
            icon: Dumbbell02Icon,
            onPress: () => router.push({
                pathname: "/(tabs)/exercise-details",
                params: { 
                    type: 'strength',
                    title: 'Weight Lifting',
                    description: 'Gym, Machine etc'
                }
            }),
        },
        {
            title: "Manual",
            description: "Enter calories Burn Manually",
            icon: Cursor01Icon,
            onPress: () => router.push("/(tabs)/manual-calories"),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft01Icon size={28} color={Colors.text} />
                </TouchableOpacity>

                <Animated.Text entering={FadeInDown.duration(600)} style={styles.title}>
                    Log Exercise
                </Animated.Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <ExerciseOption
                            key={option.title}
                            index={index}
                            {...option}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
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
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text,
    },
    scrollContent: {
        padding: 24,
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 16,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primaryTransparent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWrapper: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});
