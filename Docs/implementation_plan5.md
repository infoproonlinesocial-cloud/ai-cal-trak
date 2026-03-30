# Goals

Integrate Gemini AI to generate personalized daily calorie, protein, carb, fat, and water intake goals based on user profile data from the onboarding process. Display these results on a new page with a loading state and save them to Firebase Firestore.

## Proposed Changes

### [Backend Services]
- [NEW] [geminiService.ts](file:///d:/0-ViebCodingProjects/ai-cal-tarck/services/geminiService.ts)
    - Implement a service to interact with Gemini API (`@google/generative-ai`).
    - Define a function `generateNutritionPlan(profile: UserProfile)` that constructs a prompt and returns parsed nutrition data.
- [MODIFY] [userService.ts](file:///d:/0-ViebCodingProjects/ai-cal-tarck/services/userService.ts)
    - Add fields to [UserProfile](file:///d:/0-ViebCodingProjects/ai-cal-tarck/services/userService.ts#4-18) for storing AI-generated nutritional data.

### [App Navigation & Screens]
- [NEW] [results.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/results.tsx)
    - Create a new screen to display nutritional goals.
    - Implement a loading state with informative text (e.g., "Calculating your macros...", "Optimizing your plan...").
    - Display generated data with modern UI components.
    - Save results to Firestore if they aren't already saved.
- [MODIFY] [onboarding.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/onboarding.tsx)
    - Update the "Finish" button handler to navigate to the new results page instead of `/(tabs)`.

## Verification Plan

### Automated Tests
- Mock Gemini API response and verify it parses correctly.
- Verify that Firestore is updated with the generated data.

### Manual Verification
1. Complete the onboarding flow.
2. Observe the loading state on the results page.
3. Confirm the nutritional goals are displayed correctly.
4. Check Firestore to ensure the data was saved under the correct user ID.
