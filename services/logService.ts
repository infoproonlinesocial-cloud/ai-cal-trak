import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  deleteDoc, 
  updateDoc,
  doc 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface ActivityLog {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  type: "food" | "exercise" | "water";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity?: number; // ml for water
  timestamp?: any;
}

const LOGS_COLLECTION = "logs";

/**
 * Adds a new activity log to Firestore.
 */
export async function addLog(log: Omit<ActivityLog, "id" | "timestamp">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, LOGS_COLLECTION), {
      ...log,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding log:", error);
    throw error;
  }
}

/**
 * Fetches logs for a specific user and date.
 */
export async function getLogsByDate(userId: string, date: string): Promise<ActivityLog[]> {
  try {
    const q = query(
      collection(db, LOGS_COLLECTION),
      where("userId", "==", userId),
      where("date", "==", date)
    );
    const querySnapshot = await getDocs(q);
    const logs: ActivityLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
    });
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

/**
 * Updates an existing activity log.
 */
export async function updateLog(logId: string, data: Partial<ActivityLog>): Promise<void> {
  try {
    const logRef = doc(db, LOGS_COLLECTION, logId);
    await updateDoc(logRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error updating log:", error);
    throw error;
  }
}

/**
 * Deletes a log entry.
 */
export async function deleteLog(logId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, LOGS_COLLECTION, logId));
  } catch (error) {
    console.error("Error deleting log:", error);
    throw error;
  }
}
