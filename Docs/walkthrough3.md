# Global Colors Refactor Walkthrough

I have centralized the application's color palette into a global constants file and updated all screens to use the new primary color `#298f50`.

## Changes Made

### 1. Global Colors File
- Created [Colors.ts](file:///d:/0-ViebCodingProjects/ai-cal-tarck/constants/Colors.ts) containing the primary color `#298f50` and a comprehensive palette (background, surface, text styles, etc.).

### 2. Screen Refactoring
- **Sign-In Screen**: Updated [sign-in.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(auth)/sign-in.tsx) to use `Colors` for all styles, including the new primary green.
- **Sign-Up Screen**: Updated [sign-up.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(auth)/sign-up.tsx) to use `Colors` throughout the form and verification steps.
- **Home Screen**: Updated [index.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(tabs)/index.tsx) to use `Colors` for icons and buttons.

### 3. Layout Refactoring
- **Root Layout**: Updated [app/_layout.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/_layout.tsx) to use `Colors` for the initial loading state.
- **Tabs Layout**: Updated [app/(tabs)/_layout.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(tabs)/_layout.tsx) to use `Colors` for the tab bar and active icons.

## Verification Results

- **Color Consistency**: Checked the entire `app` directory for old hardcoded colors (`#4ADE80`, `#0A0E1A`). No instances remain.
- **Visuals**: The app now uses the darker, more professional green `#298f50` as requested.

> [!NOTE]
> There are some pre-existing TypeScript lint errors in the auth screens related to Clerk's `SignInResource` and `SignUpResource` types. These were not introduced by this refactor and appear to be part of the ongoing authentication implementation.
