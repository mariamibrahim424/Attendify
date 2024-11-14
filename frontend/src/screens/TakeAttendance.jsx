import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {fetchStudentsForClass} from '../config/firebase'; // Assuming a function to fetch students
import {takeAttendance} from '../config/firebase'; // Adjust the import path as needed

const TakeAttendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set()); // To store selected students
  const route = useRoute();
  const navigation = useNavigation();
  const {classId, className} = route.params; // Get class details from route params

  useEffect(() => {
    const loadStudents = async () => {
      const studentList = await fetchStudentsForClass(classId); // Fetch students for this class
      setStudents(studentList);
    };
    loadStudents();
  }, []);

  // Function to toggle student selection
  const toggleSelection = (studentId) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(studentId)) {
        newSelected.delete(studentId); // Deselect if already selected
      } else {
        newSelected.add(studentId); // Select if not selected
      }
      return newSelected;
    });
  };

  // Handle Submit Attendance
  const handleSubmitAttendance = async () => {
    const timeStamp = new Date();
    const allStudentsIds = new Set(students.map((item) => item.id));
    const attendanceData = [];
    for (let id of allStudentsIds) {
      const present = selectedStudents.has(id);

      attendanceData.push({
        classId: classId,
        timeStamp: timeStamp,
        studentId: id,
        present: present,
      });
    }
    try {
      // Call the Firestore function to save the attendance
      await takeAttendance(attendanceData);
      Alert.alert(
        'Attendance Submitted',
        `${selectedStudents.size} students marked as present.`,
      );
      navigation.navigate('ClassDetails', {classId});
    } catch (error) {
      console.error('Error submitting attendance: ', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.className}>{className}</Text>
      </View>

      {/* Top Students Section */}
      <View style={styles.topSection}>
        <Text style={styles.topTitle}>Top Student</Text>
        <Text style={styles.topStudent}>Mariam (Sample)</Text>
      </View>
      {/* Student List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.studentItem}>
            <View style={styles.studentInfoContainer}>
              {/* Student Icon */}
              <View style={styles.studentIcon}>
                <Text style={styles.studentIconText}>C{item.id}</Text>
              </View>

              {/* Student Name and Details */}
              <View style={styles.studentDetailsContainer}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentDetails}>
                  Birthday: {item.birthday}
                </Text>
              </View>

              {/* Checkbox (Right side of each student) */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleSelection(item.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedStudents.has(item.id) && styles.checkboxSelected,
                  ]}
                >
                  {selectedStudents.has(item.id) && (
                    <Ionicons name='checkmark' size={15} color='white' />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Students Added Yet</Text>
        }
      />

      {/* Submit Attendance Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitAttendance}
      >
        <Text style={styles.submitButtonText}>Submit Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    textTransform: 'uppercase',
  },
  topSection: {
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
  },
  topStudent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
    marginTop: 5,
  },
  studentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  studentInfoContainer: {
    flexDirection: 'row', // Align icon and name horizontally
    alignItems: 'center', // Vertically align items
    justifyContent: 'space-between', // Ensure checkbox is on the right side
  },
  studentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00796b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15, // Add space between the icon and name
  },
  studentIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetailsContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetails: {
    fontSize: 14,
    color: '#757575',
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
    marginTop: 30,
  },
  checkboxContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00796b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00796b',
  },
  submitButton: {
    backgroundColor: '#00796b',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TakeAttendance;
