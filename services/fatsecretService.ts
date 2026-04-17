import { Platform } from 'react-native';

const CLIENT_ID = process.env.EXPO_PUBLIC_FATSECRET_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_FATSECRET_CLIENT_SECRET;

export interface FoodItem {
    food_id: string;
    food_name: string;
    brand_name?: string;
    food_description: string;
    serving_size: string;
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
}

const MOCK_FOODS: Record<string, FoodItem[]> = {
    "pizza": [
        { food_id: "1", food_name: "Pizza", food_description: "Per 1 slice - Calories: 285kcal | Fat: 10.00g | Carbs: 35.00g | Protein: 12.00g", serving_size: "1 slice", calories: "285", fat: "10.00", carbs: "35.00", protein: "12.00" },
        { food_id: "2", food_name: "Pepperoni Pizza", food_description: "Per 1 slice - Calories: 313kcal | Fat: 13.00g | Carbs: 34.00g | Protein: 13.00g", serving_size: "1 slice", calories: "313", fat: "13.00", carbs: "34.00", protein: "13.00" },
        { food_id: "3", food_name: "Cheese Pizza", food_description: "Per 1 slice - Calories: 250kcal | Fat: 9.00g | Carbs: 30.00g | Protein: 11.00g", serving_size: "1 slice", calories: "250", fat: "9.00", carbs: "30.00", protein: "11.00" },
        { food_id: "4", food_name: "Veggie Pizza", food_description: "Per 1 slice - Calories: 240kcal | Fat: 8.00g | Carbs: 38.00g | Protein: 8.00g", serving_size: "1 slice", calories: "240", fat: "8.00", carbs: "38.00", protein: "8.00" },
        { food_id: "5", food_name: "Meat Lovers Pizza", food_description: "Per 1 slice - Calories: 350kcal | Fat: 18.00g | Carbs: 32.00g | Protein: 16.00g", serving_size: "1 slice", calories: "350", fat: "18.00", carbs: "32.00", protein: "16.00" },
    ],
    "apple": [
        { food_id: "6", food_name: "Apple", food_description: "Per 1 medium - Calories: 95kcal | Fat: 0.3g | Carbs: 25g | Protein: 0.5g", serving_size: "1 medium", calories: "95", fat: "0.3", carbs: "25", protein: "0.5" },
        { food_id: "7", food_name: "Green Apple", food_description: "Per 1 medium - Calories: 90kcal | Fat: 0.3g | Carbs: 22g | Protein: 0.5g", serving_size: "1 medium", calories: "90", fat: "0.3", carbs: "22", protein: "0.5" },
    ],
    "banana": [
        { food_id: "8", food_name: "Banana", food_description: "Per 1 medium - Calories: 105kcal | Fat: 0.4g | Carbs: 27g | Protein: 1.3g", serving_size: "1 medium", calories: "105", fat: "0.4", carbs: "27", protein: "1.3" },
    ]
};

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Simple base64 encoder for client_id:client_secret
const base64Encode = (str: string) => {
    try {
        // @ts-ignore
        if (typeof btoa !== 'undefined') return btoa(str);
        
        // Fallback for environments without btoa
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';
        for (let block = 0, charCode, i = 0, map = chars;
            str.charAt(i | 0) || (map = '=', i % 1);
            output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
            charCode = str.charCodeAt(i += 3 / 4);
            if (charCode > 0xFF) {
                throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
            }
            block = block << 8 | charCode;
        }
        return output;
    } catch (e) {
        console.error('Base64 encoding error:', e);
        return '';
    }
};

export const getAccessToken = async (): Promise<string> => {
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('FatSecret credentials missing in .env');
    }

    const auth = base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`);
    
    try {
        const response = await fetch('https://oauth.fatsecret.com/connect/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials&scope=basic',
        });

        const data: TokenResponse = await response.json();
        
        if (data.access_token) {
            cachedToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in - 3600) * 1000;
            return cachedToken;
        } else {
            console.error('Token error response:', data);
            throw new Error('Failed to get access token');
        }
    } catch (error) {
        console.error('Error fetching FatSecret token:', error);
        throw error;
    }
};

export const searchFoods = async (query: string): Promise<FoodItem[]> => {
    // Check if we have mock data for this query (case-insensitive)
    const normalizedQuery = query.toLowerCase().trim();
    
    // For Web development, we often hit CORS issues. 
    // We'll prioritize mock data on Web to allow testing the UI.
    if (Platform.OS === 'web' && MOCK_FOODS[normalizedQuery]) {
        console.log(`Using mock data for web search: ${query}`);
        return MOCK_FOODS[normalizedQuery];
    }

    try {
        const token = await getAccessToken();
        const url = `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(query)}&max_results=5&format=json`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('FatSecret API Search Results:', JSON.stringify(data));
        
        if (data.error) {
            console.error('FatSecret API Error:', data.error);
            // Fallback to mock if API returns error (e.g. rate limit)
            if (MOCK_FOODS[normalizedQuery]) return MOCK_FOODS[normalizedQuery];
            return [];
        }

        if (!data.foods || !data.foods.food) {
            // Fallback to mock if no results found
            if (MOCK_FOODS[normalizedQuery]) return MOCK_FOODS[normalizedQuery];
            return [];
        }

        const apiFoods = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];

        return apiFoods.map((item: any) => {
            const { serving_size, calories, protein, fat, carbs } = parseDescription(item.food_description);
            return {
                food_id: item.food_id,
                food_name: item.food_name,
                brand_name: item.brand_name,
                food_description: item.food_description,
                serving_size,
                calories,
                protein,
                fat,
                carbs,
            };
        });
    } catch (error) {
        console.error('Error searching foods (likely CORS or Network error):', error);
        
        // Final fallback to mock data on ANY error if we have a match
        if (MOCK_FOODS[normalizedQuery]) {
            console.log(`Fallback to mock data for: ${query}`);
            return MOCK_FOODS[normalizedQuery];
        }
        throw error;
    }
};

/**
 * Parses the food_description string from FatSecret API.
 * Example: "Per 100g - Calories: 52kcal | Fat: 0.17g | Carbs: 13.81g | Protein: 0.26g"
 */
const parseDescription = (desc: string): { serving_size: string; calories: string; protein: string; fat: string; carbs: string } => {
    let serving_size = 'N/A';
    let calories = '0';
    let protein = '0';
    let fat = '0';
    let carbs = '0';

    try {
        // Extract serving size (between "Per " and " -")
        const servingMatch = desc.match(/Per\s+(.*?)\s+-/);
        if (servingMatch && servingMatch[1]) {
            serving_size = servingMatch[1];
        }

        // Extract calories (between "Calories: " and "kcal")
        const calorieMatch = desc.match(/Calories:\s+(\d+)kcal/);
        if (calorieMatch && calorieMatch[1]) {
            calories = calorieMatch[1];
        }

        // Extract protein (between "Protein: " and "g")
        const proteinMatch = desc.match(/Protein:\s+([\d.]+)g/);
        if (proteinMatch && proteinMatch[1]) {
            protein = proteinMatch[1];
        }

        // Extract fat (between "Fat: " and "g")
        const fatMatch = desc.match(/Fat:\s+([\d.]+)g/);
        if (fatMatch && fatMatch[1]) {
            fat = fatMatch[1];
        }

        // Extract carbs (between "Carbs: " and "g")
        const carbsMatch = desc.match(/Carbs:\s+([\d.]+)g/);
        if (carbsMatch && carbsMatch[1]) {
            carbs = carbsMatch[1];
        }
    } catch (e) {
        console.error('Error parsing description:', desc, e);
    }

    return { serving_size, calories, protein, fat, carbs };
};
