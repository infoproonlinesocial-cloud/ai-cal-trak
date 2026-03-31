# Floating Tab Navigation Implementation

Implement a modern, floating tab navigation with three main sections and a dedicated rounded action button for quick entries.

## Proposed Changes

### [NEW] Analytics and Profile Screens

#### [NEW] [analytics.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(tabs)/analytics.tsx)
- Placeholder screen for nutrition and fitness analytics.
- Modern UI following the app's dark theme.

#### [NEW] [profile.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(tabs)/profile.tsx)
- User profile screen with settings and body metrics overview.

### Tab Navigation Layout

#### [MODIFY] [_layout.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(tabs)/_layout.tsx)
- **Floating Tab Bar Styling**:
  - Detach from bottom using `absolute` positioning, `bottom: 24`, and `horizontal` margins.
  - Transparent blur background or solid `Colors.surface` with high border radius.
- **Tabs**:
  - `index` (Home): `Home01Icon`
  - `analytics`: `ChartBar01Icon`
  - `profile`: `UserIcon`
- **Floating Action Button (FAB)**:
  - Add a custom button for the "+" action.
  - Position it on the right side within the floating bar or as a standalone FAB.
  - User requested: "rounded" and "after 3 option". I will place it as the fourth element in the tab container, highlighted with `Colors.primary`.

### Authentication and Redirection

#### [MODIFY] [index.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/index.tsx)
- Add logic to check `isOnboardingComplete` before redirecting to `/(tabs)`.
- If signed in but onboarding not complete, redirect to `/onboarding`.

#### [MODIFY] [results.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/results.tsx)
- Ensure the "Go to Dashboard" button correctly leads to the new tab structure.

## Verification Plan

### Manual Verification
- Test app launch as a new user: should lead to Sign In -> Onboarding -> Tab Home.
- Test app launch as an existing user (onboarded): should lead directly to Tab Home.
- Verify the floating tab bar's appearance and responsiveness.
- Verify the "+" button opens a placeholder action or screen.
