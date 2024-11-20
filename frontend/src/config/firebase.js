// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch, getDoc, query, where } from 'firebase/firestore'; // <-- Add query and where here
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from '@env';


// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const FB_AUTH = getAuth(app);
export const FB_DB = getFirestore(app);
export const FB_S = getStorage(app);

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

// Function to delete a class from Firestore
export const deleteClass = async (classId) => {
  try {
    const docRef = doc(FB_DB, 'classes', classId); // Reference the class document
    await deleteDoc(docRef); // Delete the class document
    console.log("Class deleted with ID: ", classId);
  } catch (error) {
    console.error("Error deleting class: ", error);
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

// Function to delete a student from Firestore
export const deleteStudent = async (classId, studentId) => {
  try {
    const docRef = doc(FB_DB, `classes/${classId}/students`, studentId); // Reference to the student document
    await deleteDoc(docRef);
    console.log("Student deleted with ID: ", studentId);
  } catch (error) {
    console.error("Error deleting student: ", error);
  }
};

// Function to update student details
export const updateStudent = async (classId, studentId, updatedData) => {
  try {
    const studentDocRef = doc(FB_DB, `classes/${classId}/students`, studentId); // Reference to the student document
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

// Function to take attendance for students in a class
export const takeAttendance = async (attendanceDataArray) => {
  try {
    const batch = writeBatch(FB_DB); // Initialize batch to write multiple documents

    for (const attendanceData of attendanceDataArray) {
      // Fetch student name by studentId
      const studentDocRef = doc(FB_DB, 'classes', attendanceData.classId, 'students', attendanceData.studentId);
      const studentDoc = await getDoc(studentDocRef);
      const studentName = studentDoc.exists() ? studentDoc.data().name : 'Unknown'; // Default to 'Unknown' if name not found

      // Fetch the current attendance count for the student
      const attendanceRef = collection(FB_DB, 'classes', attendanceData.classId, 'attendance');
      const studentAttendanceSnapshot = await getDocs(attendanceRef);
      let attendanceCount = 0;

      // Loop through the student's previous attendance records to count them
      studentAttendanceSnapshot.docs.forEach(doc => {
        const record = doc.data();
        if (record.studentId === attendanceData.studentId) {
          attendanceCount += 1; // Increment count for each record found
        }
      });

      // Add student name and attendance count to attendance data
      const updatedAttendanceData = {
        ...attendanceData,
        studentName,
        attendanceCount: attendanceCount + 1, // Increment attendance count by 1
      };

      // Add the updated attendance data to the Firestore batch operation
      const attendanceDocRef = doc(collection(FB_DB, 'classes', attendanceData.classId, 'attendance'));
      batch.set(attendanceDocRef, updatedAttendanceData); // Add the student attendance data to batch

    }

    await batch.commit(); // Commit the batch operation
    console.log('Attendance records added successfully');
  } catch (error) {
    console.error('Error taking attendance: ', error);
    throw error; // Throw error so it can be caught in the component
  }
};

// Function to fetch attendance records for a class
export const fetchAttendanceRecords = async (classId) => {
  const attendanceRef = collection(FB_DB, 'classes', classId, 'attendance');
  const snapshot = await getDocs(attendanceRef);
  const records = [];
  
  // Step 1: Collect all unique studentIds from the attendance records
  const studentIds = [...new Set(snapshot.docs.map(doc => doc.data().studentId))];
  
  // Step 2: Fetch student data in parallel using Promise.all
  const studentPromises = studentIds.map(studentId => 
    getDoc(doc(FB_DB, 'classes', classId, 'students', studentId))
  );
  
  const studentSnapshots = await Promise.all(studentPromises);
  
  // Step 3: Map student IDs to student names
  const studentNames = studentSnapshots.reduce((acc, snapshot) => {
    if (snapshot.exists()) {
      acc[snapshot.id] = snapshot.data().name;
    } else {
      acc[snapshot.id] = 'Unknown';  // Default value if student is not found
    }
    return acc;
  }, {});
  
  // Step 4: Process attendance records
  for (let docSnap of snapshot.docs) {
    const data = docSnap.data();
    records.push({
      ...data,
      studentName: studentNames[data.studentId],  // Use pre-fetched student name
      attendanceCount: data.attendanceCount || 0,
    });
  }
  // console.log("records"+ JSON.stringify(records, null, 2));
  return records;
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
