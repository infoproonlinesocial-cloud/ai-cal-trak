# Implementation Plan - Auth Navigation and Firebase Sync

Ensure users are correctly navigated to Auth screens when unauthenticated, sessions are persisted locally, and user profile data is synchronized to Firebase Firestore.

## Proposed Changes

### [Authentication & Navigation]

#### [MODIFY] [app/_layout.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/_layout.tsx)
- Add a background effect to synchronize the Clerk user profile with Firebase Firestore whenever the user is signed in.
- This ensures that even if a user returns via a persisted session, their Firestore record is checked/updated.
- Use `useUser` from `@clerk/clerk-expo` to get comprehensive user details (fullName, primaryEmailAddress, etc.).

#### [MODIFY] [app/(auth)/sign-in.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(auth)/sign-in.tsx)
- Refine the [saveUserToFirestore](file:///d:/0-ViebCodingProjects/ai-cal-tarck/services/userService.ts#12-31) call to use the most accurate data available during the sign-in flow.

#### [MODIFY] [app/(auth)/sign-up.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/(auth)/sign-up.tsx)
- Refine the [saveUserToFirestore](file:///d:/0-ViebCodingProjects/ai-cal-tarck/services/userService.ts#12-31) call to use the correct user name and email after verification.

## Verification Plan

### Manual Verification
1. **Redirection**: Open the app while signed out and verify you are redirected to the Sign-In screen.
2. **Persistence**: Sign in, then close and reopen the app. Verify you remain signed in and are taken to the Home (tabs) screen.
3. **Firebase Sync**:
    - Sign in with a new account.
    - Check the Firebase Console `users` collection to confirm a document with the matching UID exists.
    - Confirm `email`, `displayName`, and `provider` fields are correctly populated.
4. **Google Sign-In**: Verify Google sign-in also triggers the Firebase synchronization.
