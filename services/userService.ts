import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  gender?: "male" | "female" | "other";
  goal?: "gain" | "lose" | "maintain";
  workoutFrequency?: "2-3-days" | "3-4-days" | "6-7-days";
  birthdate?: { month: string; year: string };
  weight?: string; // in Kg
  height?: string; // in Feet
  isOnboardingComplete?: boolean;
  dailyCalories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  waterIntake?: number;
  fitnessResponse?: string;
}

/**
 * Creates or merges a user document in Firestore under `users/{uid}`.
 * Safe to call on every sign-in — existing users won't have data overwritten.
 */
export async function saveUserToFirestore(user: UserProfile): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.provider,
      updatedAt: serverTimestamp(),
    },
    { merge: true } // won't overwrite createdAt on subsequent sign-ins
  );
}

/**
 * Fetches user profile from Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
}

/**
 * Updates onboarding related data for a user.
 */
export async function updateOnboardingData(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
