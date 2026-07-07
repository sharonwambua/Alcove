import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_Lc9DeDLxZAutYecn0GivKyDL_grjgd0", // The full valid key!
  authDomain: "alcove-31681.firebaseapp.com",
  projectId: "alcove-31681",
  storageBucket: "alcove-31681.firebasestorage.app",
  messagingSenderId: "1034132045044",
  appId: "1:1034132045044:web:f626d73af20b3b89072a1",
  measurementId: "G-KXRZW8X91P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances for the login component
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken };
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};