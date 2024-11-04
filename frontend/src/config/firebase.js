// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore'; // Import Firestore functions
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
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

// Utility function to get the current user
const getCurrentUser = () => {
  const currentUser = FB_AUTH.currentUser;
  if (!currentUser) {
    console.error("No user is currently logged in");
  }
  return currentUser;
};

// Function to add a new class to Firestore
export const addClass = async (classData) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      classData.userId = currentUser.uid; // Add user ID to class data
    }
    const docRef = await addDoc(collection(FB_DB, 'classes'), classData);
    console.log("Class added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding class: ", error);
  }
};

// Function to add a new class to Firestore
export const deleteClass = async (classId) => {
  try {
    // No need for userId in delete operation
    const docRef = await deleteDoc(doc(collection(FB_DB, 'classes'), classId)); // Reference the specific document
    console.log("Class deleted with ID: ", classId); // Log the deleted class ID
  } catch (error) {
    console.error("Error deleting class: ", error); // Update error message
  }
};


// Function to fetch classes for the current user
export const fetchClassesForUser = async () => {
  try {
    const currentUser = getCurrentUser();
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

// Function to add a student to a specific class
export const addStudent = async (classId, studentData) => {
  try {
    const docRef = await addDoc(collection(FB_DB, `classes/${classId}/students`), studentData);
    console.log("Student added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding student: ", error);
  }
};

//Function to update students
export const updateStudent = async (studentId, updatedData) => {
  try {
    const studentDocRef = doc(FB_DB, `students/${studentId}`);
    await updateDoc(studentDocRef, updatedData);
    console.log("Student updated successfully!");
  } catch (error) {
    console.error("Error updating student: ", error);
  }
};

// Function to fetch students for a specific class
export const fetchStudentsForClass = async (classId) => {
  try {
    const studentsCollection = collection(FB_DB, `classes/${classId}/students`);
    const studentSnapshot = await getDocs(studentsCollection);
    const studentList = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return studentList;
  } catch (error) {
    console.error("Error fetching students: ", error);
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
