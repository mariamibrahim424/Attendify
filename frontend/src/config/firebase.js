// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const FB_AUTH = getAuth(app);
export const FB_DB = getFirestore();