import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {deleteStudent, fetchStudentsForClass} from '../config/firebase'; // Assuming a function to fetch students
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler'; // Import from the updated library

const ClassDetails = () => {
  const [students, setStudents] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const {classId, className, studentData} = route.params; // Get class details from route params

  useEffect(() => {
    const loadStudents = async () => {
      const studentList = await fetchStudentsForClass(classId); // Fetch students for this class
      setStudents(studentList);
    };
    loadStudents();
  }, [studentData]);

  // Navigate to Take Attendance page
  const goToTakeAttendance = () => {
    navigation.navigate('TakeAttendance', {classId, className});
  };

  // Navigate to Attendance Sheets page
  const goToAttendanceSheets = () => {
    navigation.navigate('AttendanceSheets', {classId, className});
  };

  const handleDelete = (classId, studentId) => {
    try {
      deleteStudent(classId, studentId);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId),
      ); // Update the state
    } catch (error) {
      console.error('Error deleting student: ', error);
      alert('Error deleting student. Please try again.');
    }
  };

  const renderRightActions = (classId, studentId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(classId, studentId)}
    >
      <Text style={{color: 'white', fontWeight: 'bold'}}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.className}>{className}</Text>
      </View>

      {/* Top Student Section */}
      <View style={styles.topSection}>
        <Text style={styles.topTitle}>Top Student</Text>
        <Text style={styles.topStudent}>Mariam (Sample)</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonTakeAttendance]} // Emphasized style
          onPress={goToTakeAttendance}
        >
          <Ionicons name='checkmark-circle-outline' size={18} color='white' />
          <Text style={styles.buttonText}>Take Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonAttendanceSheets]} // Lighter style
          onPress={goToAttendanceSheets}
        >
          <Ionicons name='document-text-outline' size={18} color='white' />
          <Text style={styles.buttonText}>Attendance Sheets</Text>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <Swipeable
            renderRightActions={() => renderRightActions(classId, item.id)}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditStudent', {
                  studentId: item.id,
                  initialName: item.name,
                  initialBirthday: new Date(item.birthday),
                  // Pass other fields to edit, like attendance and participation
                })
              }
            >
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
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Students Added Yet</Text>
        }
      />

      {/* Add Student Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddStudent', {classId})}
      >
        <Ionicons name='add' size={30} color='white' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 40,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '48%', // Adjust width to fit buttons side by side
    justifyContent: 'center',
    elevation: 5,
  },
  buttonTakeAttendance: {
    backgroundColor: '#00796b', // Green for emphasis
  },
  buttonAttendanceSheets: {
    backgroundColor: '#4caf50', // Lighter green for second option
    opacity: 0.85,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00796b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetailsContainer: {
    flex: 1,
    marginLeft: 15,
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
  addButton: {
    backgroundColor: '#00796b',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 70,
    borderRadius: 10,
    elevation: 5,
  },
});

export default ClassDetails;
