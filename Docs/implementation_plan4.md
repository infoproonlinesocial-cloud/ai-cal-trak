# Onboarding Step Form Implementation Plan

Implement a professional multi-step form to collect user data (gender, goal, workout frequency, birthdate, weight/height) after authentication.

## Proposed Changes

### [Component Name] Onboarding Flow

#### [MODIFY] [userService.ts](file:///d:/0-ViebCodingProjects/ai-cal-tarck/services/userService.ts)
- Update [UserProfile](file:///d:/0-ViebCodingProjects/ai-cal-tarck/services/userService.ts#4-11) interface with onboarding fields.
- Add `getUserProfile` function to fetch user data.

#### [NEW] [onboarding.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/onboarding.tsx)
- Create a multi-step form screen.
- Use `react-native-reanimated` for smooth transitions between steps.
- Integrate `hugeicons-react-native` for icons.
- Implement a custom progress bar.
- Save progress to `AsyncStorage` and final data to Firestore.

#### [MODIFY] [_layout.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/_layout.tsx)
- Update [InitialLayout](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/_layout.tsx#11-60) to fetch user profile.
- Redirect to `/onboarding` if `isOnboardingComplete` is false.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
1. Sign up as a new user.
2. Verify redirection to onboarding screen.
3. Complete each step of the form.
4. Verify data is saved to `AsyncStorage` and Firestore.
5. Verify redirection to [(tabs)](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/_layout.tsx#61-70) after completion.
6. Log in again and verify it skips onboarding.
