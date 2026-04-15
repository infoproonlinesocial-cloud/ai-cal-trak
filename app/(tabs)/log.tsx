import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import {
    ViewIcon as AiScannerIcon,
    Search01Icon as DatabaseIcon,
    DropletIcon,
    Dumbbell02Icon,
    StarIcon
} from 'hugeicons-react-native';
import React from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 16) / 2; // (width - padding*2 - gap) / 2

interface OptionCardProps {
    title: string;
    icon: any;
    isPremium?: boolean;
    onPress: () => void;
}

const OptionCard = ({ title, icon: Icon, isPremium, onPress }: OptionCardProps) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
            <Icon size={32} color={Colors.primary} variant="stroke" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        {isPremium && (
            <View style={styles.premiumBadge}>
                <StarIcon size={10} color={Colors.white} />
                <Text style={styles.premiumText}>PRO</Text>
            </View>
        )}
    </TouchableOpacity>
);

export default function LogScreen() {
    const router = useRouter();
    const isPaidUser = false; // Mock for paid user

    const handleOptionPress = (option: string, isPremium?: boolean) => {
        if (isPremium && !isPaidUser) {
            Alert.alert(
                "Premium Feature",
                "Scan Food is only available for paid users. Upgrade to Pro to unlock this feature!",
                [{ text: "OK" }]
            );
            return;
        }

        if (option === "Log Exercise") {
            router.push('/(tabs)/log-exercise');
            return;
        }
        
        console.log(`Pressed: ${option}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                    <Text style={styles.title}>LOG</Text>
                    <Text style={styles.subtitle}>Track your nutritional progress</Text>
                </Animated.View>

                <View style={styles.grid}>
                    <OptionCard
                        title="Log Exercise"
                        icon={Dumbbell02Icon}
                        onPress={() => handleOptionPress("Log Exercise")}
                    />
                    <OptionCard
                        title="Add Drink Water"
                        icon={DropletIcon}
                        onPress={() => handleOptionPress("Add Drink Water")}
                    />
                    <OptionCard
                        title="Food Database"
                        icon={DatabaseIcon}
                        onPress={() => handleOptionPress("Food Database")}
                    />
                    <OptionCard
                        title="Scan Food"
                        icon={AiScannerIcon}
                        isPremium
                        onPress={() => handleOptionPress("Scan Food", true)}
                    />
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
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        minHeight: 140,
        position: 'relative',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primaryTransparent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: Colors.warning,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    premiumText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '900',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surfaceDark,
        borderRadius: 32,
        padding: 40,
        gap: 12,
    },
    placeholderText: {
        color: Colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
});
