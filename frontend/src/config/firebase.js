// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7tnx-pFwo75icLdZXY0sKfMUNjGPkF4A",
  authDomain: "rollcall-7a79f.firebaseapp.com",
  projectId: "rollcall-7a79f",
  storageBucket: "rollcall-7a79f.appspot.com",
  messagingSenderId: "666843817191",
  appId: "1:666843817191:web:72eea69d79dda144ecee42",
  measurementId: "G-F3LZ47XL02"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const FB_AUTH = getAuth(app);
export const FB_DB = getFirestore(app);

// Conditionally initialize Firebase Analytics (only if supported)
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
  }
});