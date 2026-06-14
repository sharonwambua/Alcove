// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_Lc9DeDLxZAutYecn0GivKyDL_grjgd0",
  authDomain: "alcove-31681.firebaseapp.com",
  projectId: "alcove-31681",
  storageBucket: "alcove-31681.firebasestorage.app",
  messagingSenderId: "1034132045044",
  appId: "1:1034132045044:web:f626d773af20b3b89072a1",
  measurementId: "G-KXRZW8X91P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);