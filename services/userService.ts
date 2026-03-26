import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
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
