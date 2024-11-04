// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'; // Import Firestore functions
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

// Function to add a new class to Firestore
export const addClass = async (classData) => {
  try {
    // Include the current user's ID in the class data
    const currentUser = FB_AUTH.currentUser;
    if (currentUser) {
      classData.userId = currentUser.uid; // Add user ID to class data
    }
    const docRef = await addDoc(collection(FB_DB, 'classes'), classData);
    console.log("Class added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding class: ", error);
  }
};

// Function to fetch classes for the current user
export const fetchClassesForUser = async () => {
  try {
    const currentUser = FB_AUTH.currentUser;
    if (!currentUser) return []; // Return empty if no user is logged in

    const classesCollection = collection(FB_DB, 'classes');
    const classSnapshot = await getDocs(classesCollection);
    const classList = classSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(classItem => classItem.userId === currentUser.uid); // Filter by user ID

    return classList;
  } catch (error) {
    console.error("Error fetching classes: ", error);
    return [];
  }
};

// Function to fetch users from Firestore
export const fetchUsers = async () => {
  try {
    const usersCollection = collection(FB_DB, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return userList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};
