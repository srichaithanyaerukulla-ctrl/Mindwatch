import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  // Using the project ID you provided
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER_API_KEY",
  authDomain: "gen-lang-client-0822606148.firebaseapp.com",
  projectId: "gen-lang-client-0822606148",
  storageBucket: "gen-lang-client-0822606148.appspot.com",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const saveSession = async (sessionData) => {
  try {
    const docRef = await addDoc(collection(db, "sessions"), {
      ...sessionData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getSessions = async () => {
  try {
    const q = query(collection(db, "sessions"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    return sessions;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};
