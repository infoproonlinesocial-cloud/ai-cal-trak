# Auth Implementation - AI Calories Tracker

Add Clerk authentication (email/password + Google OAuth) and Firebase Firestore user storage to the Expo Router app, with a premium Dribbble-style mobile UI.

## User Review Required

> [!IMPORTANT]
> **You need to supply the following credentials** before the app can run:
> - **Clerk Publishable Key** — from [dashboard.clerk.com](https://dashboard.clerk.com) → Your App → API Keys
> - **Google OAuth Client IDs** — create via [console.cloud.google.com](https://console.cloud.google.com) (Web + Android + iOS client IDs for Clerk's Google provider)
> - **Firebase Config** — from [console.firebase.google.com](https://console.firebase.google.com) → Project Settings → Your apps (Web app config)
>
> I will scaffold [.env](file:///d:/0-ViebCodingProjects/ai-cal-tarck/.env) with placeholder keys so the app compiles; you replace the values.

> [!WARNING]
> **Google Sign-In on Expo Go** requires the `expo-auth-session` + Clerk OAuth flow rather than native Google Sign-In SDK. This works seamlessly in Expo Go via a browser redirect. On production standalone builds, native Google Sign-In can be wired in later.

---

## Proposed Changes

### Dependencies

Install via `npx expo install`:
- `@clerk/clerk-expo` — Clerk Expo SDK
- `expo-secure-store` — token cache for Clerk
- `firebase` — Firebase JS SDK (Firestore)
- `expo-auth-session` + `expo-crypto` — Google OAuth via browser for Expo Go

---

### Configuration Files

#### [MODIFY] [app.json](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app.json)
Add Clerk OAuth scheme redirect plugin and ensure `scheme: "aicaltrack"` is present (already set).

#### [MODIFY] [.env](file:///d:/0-ViebCodingProjects/ai-cal-tarck/.env)
Populate with placeholder keys (Clerk, Firebase, Google Client IDs).

---

### Services Layer

#### [NEW] services/firebaseConfig.ts
Initialize Firebase app + Firestore instance from env vars.

#### [NEW] services/userService.ts
`saveUserToFirestore(user)` — writes/merges a user doc to `users/{uid}` with `{ uid, email, displayName, photoURL, provider, createdAt }`.

---

### App Structure & Routing

#### [MODIFY] [app/_layout.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/_layout.tsx)
Wrap app in `<ClerkProvider>` with `tokenCache` using `expo-secure-store`. Add `<ClerkLoaded>` gate.

#### [MODIFY] [app/index.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/index.tsx)
Redirect logic: if signed in → `/(tabs)`, else → `/(auth)/sign-in`.

#### [NEW] app/(auth)/_layout.tsx
Stack layout for the auth flow (sign-in, sign-up) with `headerShown: false`.

#### [NEW] app/(auth)/sign-in.tsx
Professional sign-in screen.

#### [NEW] app/(auth)/sign-up.tsx
Professional sign-up screen.

#### [NEW] app/(tabs)/_layout.tsx
Minimal protected tab layout (home placeholder) — just enough so navigation works after sign-in.

#### [NEW] app/(tabs)/index.tsx
Home placeholder screen with a "Signed in!" message and sign-out button.

---

### UI Design — Dribbble Style

Both screens follow this visual system:
- **Background**: Deep dark gradient `#0A0E1A → #1A1F35` (full bleed)  
- **Card**: Frosted glass card `rgba(255,255,255,0.06)` with `border: rgba(255,255,255,0.12)` and `borderRadius: 24`
- **Accent color**: Vibrant green `#4ADE80` / `#22C55E` (calorie/health brand)
- **Typography**: System font, white headings, muted `#94A3B8` subtext
- **Inputs**: Dark `rgba(255,255,255,0.08)` bg, subtle border, white text, accent focus border
- **Primary Button**: Green gradient `#4ADE80 → #22C55E`, bold, rounded-full, shadow glow
- **Google Button**: Dark outline button with Google "G" icon SVG
- **Logo**: [assets/images/icon.png](file:///d:/0-ViebCodingProjects/ai-cal-tarck/assets/images/icon.png) displayed at top of card with glow effect
- **Animations**: Fade-in on mount using `Animated.Value`

---

## Verification Plan

### Manual Verification (Expo Go)

1. Run `npx expo start` from the project root
2. Scan the QR code with **Expo Go** on your phone
3. **Sign-Up flow**: Enter a name, email, and password → tap **Create Account** → you should reach the home tab. Check Firebase Firestore console → `users` collection should have a document for this user.
4. **Sign-In flow**: Sign out → tap **Sign In** → enter the same credentials → should reach home tab.
5. **Google Sign-In**: Tap **Continue with Google** → browser OAuth → should return to app and reach home tab. Firestore `users` doc should be created.
6. **Navigation**: On Sign-In screen tap **Create account** link → goes to Sign-Up. On Sign-Up tap **Sign In** link → goes back.

> [!NOTE]
> Google OAuth will open a browser tab in Expo Go — this is expected behaviour. After auth it redirects back to the app via the `aicaltrack://` scheme.
