import { Colors } from '@/constants/Colors';
import { searchFoods, FoodItem } from '@/services/fatsecretService';
import { useRouter } from 'expo-router';
import {
    ArrowLeft02Icon,
    Search01Icon,
    Add01Icon,
    Cancel01Icon
} from 'hugeicons-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard,
    Dimensions
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const FoodCard = ({ item, index, onPress }: { item: FoodItem; index: number; onPress: (item: FoodItem) => void }) => (
    <Animated.View 
        entering={FadeInRight.delay(index * 100).duration(500)}
    >
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => onPress(item)}
        >
            <View style={styles.cardInfo}>
                <Text style={styles.foodName} numberOfLines={1}>{item.food_name}</Text>
                <Text style={styles.foodDetails}>
                    {item.serving_size} • {item.calories} kcal
                </Text>
            </View>
            <View style={styles.addButton}>
                <Add01Icon size={20} color={Colors.white} variant="stroke" />
            </View>
        </TouchableOpacity>
    </Animated.View>
);

export default function FoodDatabaseScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        Keyboard.dismiss();
        setIsLoading(true);
        setHasSearched(true);
        
        try {
            const results = await searchFoods(searchQuery);
            setFoods(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setFoods([]);
        setHasSearched(false);
    };

    const handleFoodSelect = (item: FoodItem) => {
        router.push({
            pathname: '/(tabs)/log-food-details',
            params: {
                food_id: item.food_id,
                food_name: item.food_name,
                serving_size: item.serving_size,
                calories: item.calories,
                protein: item.protein,
                fat: item.fat,
                carbs: item.carbs,
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.iconButton}
                >
                    <ArrowLeft02Icon size={24} color={Colors.text} variant="stroke" />
                </TouchableOpacity>
                <Text style={styles.title}>Search Food</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search01Icon size={20} color={Colors.textSecondary} variant="stroke" />
                        <TextInput
                            style={styles.input}
                            placeholder="Search in food database..."
                            placeholderTextColor={Colors.textPlaceholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={clearSearch}>
                                <Cancel01Icon size={20} color={Colors.textSecondary} variant="stroke" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {isLoading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Searching foods...</Text>
                    </View>
                ) : foods.length > 0 ? (
                    <FlatList
                        data={foods}
                        keyExtractor={(item) => item.food_id}
                        renderItem={({ item, index }) => (
                            <FoodCard 
                                item={item} 
                                index={index} 
                                onPress={handleFoodSelect}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : hasSearched ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.noResultsText}>No foods found for "{searchQuery}"</Text>
                    </View>
                ) : (
                    <View style={styles.centerContainer}>
                        <Animated.View entering={FadeInDown.duration(800)} style={styles.placeholderContainer}>
                            <Search01Icon size={64} color={Colors.surface} variant="stroke" />
                            <Text style={styles.placeholderText}>Start typing to search for nutrition info</Text>
                        </Animated.View>
                    </View>
                )}
            </View>
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
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchContainer: {
        marginTop: 12,
        marginBottom: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceDark,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    input: {
        flex: 1,
        color: Colors.text,
        fontSize: 16,
        marginLeft: 12,
        marginRight: 8,
    },
    listContent: {
        paddingBottom: 40,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardInfo: {
        flex: 1,
        marginRight: 12,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    foodDetails: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    loadingText: {
        marginTop: 16,
        color: Colors.textSecondary,
        fontSize: 16,
    },
    placeholderContainer: {
        alignItems: 'center',
        gap: 16,
    },
    placeholderText: {
        color: Colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        width: width * 0.6,
    },
    noResultsText: {
        color: Colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
    },
});
