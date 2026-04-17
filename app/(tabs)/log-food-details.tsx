import { Colors } from '@/constants/Colors';
import { useDate } from '@/context/DateContext';
import { addLog } from '@/services/logService';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft02Icon,
    FireIcon,
    DropletIcon,
    Plant01Icon,
    KitchenUtensilsIcon
} from 'hugeicons-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LogFoodDetailsScreen() {
    const { user } = useUser();
    const router = useRouter();
    const { selectedDate } = useDate();
    const params = useLocalSearchParams();

    // Initialize state from params
    const [name] = useState(params.food_name as string);
    const [servingSize, setServingSize] = useState(params.serving_size as string);
    const [calories, setCalories] = useState(params.calories as string);
    const [protein, setProtein] = useState(params.protein as string);
    const [fat, setFat] = useState(params.fat as string);
    const [carbs, setCarbs] = useState(params.carbs as string);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogFood = async () => {
        if (!user) return;
        
        setIsSubmitting(true);
        try {
            await addLog({
                userId: user.id,
                date: selectedDate,
                type: 'food',
                name: name,
                calories: parseFloat(calories) || 0,
                protein: parseFloat(protein) || 0,
                fat: parseFloat(fat) || 0,
                carbs: parseFloat(carbs) || 0,
                quantity: 1, // Default quantity
            });

            Alert.alert("Success", "Food logged successfully!");
            router.replace('/(tabs)');
        } catch (error) {
            console.error("Error logging food:", error);
            Alert.alert("Error", "Failed to log food. Please try again.");
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
                        onPress={() => router.back()} 
                        style={styles.iconButton}
                    >
                        <ArrowLeft02Icon size={24} color={Colors.text} variant="stroke" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Log Food</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.duration(600)}>
                        <Text style={styles.foodName}>{name}</Text>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Serving Size</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={servingSize}
                                    onChangeText={setServingSize}
                                    placeholder="e.g. 1 slice"
                                    placeholderTextColor={Colors.textPlaceholder}
                                />
                            </View>
                        </View>

                        <View style={styles.caloriesCard}>
                            <View style={styles.cardHeader}>
                                <FireIcon size={24} color={Colors.primary} variant="stroke" />
                                <Text style={styles.cardTitle}>Calories</Text>
                            </View>
                            <TextInput
                                style={styles.caloriesInput}
                                value={calories}
                                onChangeText={setCalories}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={Colors.textPlaceholder}
                            />
                            <Text style={styles.unit}>kcal</Text>
                        </View>

                        <View style={styles.macrosContainer}>
                            <MacroItem 
                                label="Protein" 
                                value={protein} 
                                onChange={setProtein}
                                icon={<Plant01Icon size={20} color="#4ADE80" variant="stroke" />}
                                color="#4ADE80"
                            />
                            <MacroItem 
                                label="Carbs" 
                                value={carbs} 
                                onChange={setCarbs}
                                icon={<KitchenUtensilsIcon size={20} color="#FACC15" variant="stroke" />}
                                color="#FACC15"
                            />
                            <MacroItem 
                                label="Fats" 
                                value={fat} 
                                onChange={setFat}
                                icon={<DropletIcon size={20} color="#FB923C" variant="stroke" />}
                                color="#FB923C"
                            />
                        </View>
                    </Animated.View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={[styles.logButton, isSubmitting && styles.disabledButton]}
                        onPress={handleLogFood}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={Colors.textDark} />
                        ) : (
                            <Text style={styles.logButtonText}>Log Food</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

interface MacroItemProps {
    label: string;
    value: string;
    onChange: (text: string) => void;
    icon: React.ReactNode;
    color: string;
}

const MacroItem = ({ label, value, onChange, icon, color }: MacroItemProps) => (
    <View style={styles.macroCard}>
        <View style={styles.macroHeader}>
            {icon}
            <Text style={styles.macroLabel}>{label}</Text>
        </View>
        <View style={styles.macroInputWrapper}>
            <TextInput
                style={styles.macroInput}
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.textPlaceholder}
            />
            <Text style={styles.macroUnit}>g</Text>
        </View>
        <View style={[styles.macroIndicator, { backgroundColor: color }]} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    scrollContent: {
        padding: 24,
    },
    foodName: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 32,
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 12,
        marginLeft: 4,
    },
    inputWrapper: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    input: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    caloriesCard: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
        position: 'relative',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    caloriesInput: {
        fontSize: 48,
        fontWeight: '900',
        color: Colors.text,
        textAlign: 'center',
        padding: 0,
        minWidth: 100,
    },
    unit: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textMuted,
        marginTop: 4,
    },
    macrosContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
    },
    macroCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        position: 'relative',
        overflow: 'hidden',
    },
    macroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    macroLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    macroInputWrapper: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    macroInput: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
        padding: 0,
        marginRight: 2,
    },
    macroUnit: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textMuted,
    },
    macroIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        opacity: 0.6,
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    logButton: {
        backgroundColor: Colors.primary,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    logButtonText: {
        color: Colors.textDark,
        fontSize: 18,
        fontWeight: '800',
    },
    disabledButton: {
        opacity: 0.7,
    },
});
