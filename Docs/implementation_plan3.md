# Global Colors Refactor

The goal is to centralize color definitions in a global colors file and update the app to use `#298f50` as the primary color, along with a matching palette.

## Proposed Changes

### Constants
#### [NEW] [Colors.ts](file:///d:/0-ViebCodingProjects/ai-cal-tarck/constants/Colors.ts)
- Define a `Colors` object with:
  - `primary`: `#298f50`
  - `primaryLight`: `#4ADE80` (adapted to match the new primary)
  - `primaryDark`: `#1a5d34`
  - `background`: `#0A0E1A`
  - `surface`: `rgba(255,255,255,0.05)`
  - `border`: `rgba(255,255,255,0.1)`
  - `text`: `#F8FAFC`
  - `textSecondary`: `#64748B`
  - `textMuted`: `#94A3B8`

### Components/Screens
#### [MODIFY] [sign-in.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(auth)/sign-in.tsx)
- Import `Colors` from `@/constants/Colors`
- Replace hardcoded color strings with `Colors` properties.

#### [MODIFY] [sign-up.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(auth)/sign-up.tsx)
- Import `Colors` from `@/constants/Colors`
- Replace hardcoded color strings with `Colors` properties.

#### [MODIFY] [index.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(tabs)/index.tsx)
- Import `Colors` from `@/constants/Colors`
- Replace hardcoded color strings with `Colors` properties.

## Verification Plan

### Manual Verification
- Run the app and check Sign-In, Sign-Up, and Home screens to ensure colors are applied correctly.
- Verify that the primary green color is now `#298f50`.
