import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile } from "./userService";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface NutritionPlan {
  dailyCalories: number;
  proteins: number;
  carbs: number;
  fats: number;
  waterIntake: number;
  fitnessResponse: string;
}

export async function generateNutritionPlan(profile: UserProfile): Promise<NutritionPlan> {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });


  const prompt = `
    Based on the following user profile, generate a daily nutrition and fitness plan:
    - Gender: ${profile.gender}
    - Goal: ${profile.goal}
    - Workout Frequency: ${profile.workoutFrequency}
    - Birth Date: ${profile.birthdate?.month}/${profile.birthdate?.year}
    - Weight: ${profile.weight} kg
    - Height: ${profile.height} feet

    Please provide the following information in JSON format:
    {
      "dailyCalories": number,
      "proteins": number (in grams),
      "carbs": number (in grams),
      "fats": number (in grams),
      "waterIntake": number (in liters),
      "fitnessResponse": "A short motivational fitness advice or tip based on their goal"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as NutritionPlan;
    } else {
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    throw error;
  }
}
