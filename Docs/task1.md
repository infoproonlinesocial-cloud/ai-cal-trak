# AI Cal Tracker - Auth Implementation Task

## Planning
- [x] Review existing project structure
- [x] Create implementation plan

## Package Installation
- [ ] Install Clerk Expo SDK
- [ ] Install Firebase SDK
- [ ] Install expo-secure-store
- [ ] Install @react-native-google-signin/google-signin or expo-auth-session for Google OAuth

## Configuration
- [ ] Update .env with Clerk publishable key, Firebase config, Google OAuth client IDs
- [ ] Update app.json with Clerk scheme / OAuth redirect
- [ ] Set up Firebase project config file (firebaseConfig.ts)
- [ ] Set up Clerk provider in _layout.tsx

## App Structure / Routing
- [ ] Update app/_layout.tsx with ClerkProvider, token cache, and auth routing logic
- [ ] Create app/(auth)/_layout.tsx for auth stack
- [ ] Create app/(auth)/sign-in.tsx - SignIn screen
- [ ] Create app/(auth)/sign-up.tsx - SignUp screen
- [ ] Create app/(tabs)/_layout.tsx for protected tabs (home placeholder)
- [ ] Update app/index.tsx to redirect based on auth state

## Services
- [ ] Create services/firebaseConfig.ts
- [ ] Create services/userService.ts (save user to Firestore)

## UI Components
- [ ] Design/build SignIn screen: logo, email/password, Google SSO, link to SignUp
- [ ] Design/build SignUp screen: logo, name, email, password, Google SSO, link to SignIn
- [ ] Apply Dribbble-style gradients, cards, typography

## Verification
- [ ] Start dev server, scan Expo Go QR code
- [ ] Test email sign-up flow → Firestore user document created
- [ ] Test email sign-in flow → navigates to home tab
- [ ] Test Google sign-in flow
- [ ] Test navigation between SignIn ↔ SignUp

## Walkthrough
- [ ] Create walkthrough.md
