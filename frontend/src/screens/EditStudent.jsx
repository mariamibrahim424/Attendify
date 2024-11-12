import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {updateStudent} from '../config/firebase'; // Import the function to update student details

const EditStudent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {studentId, initialName, initialBirthday} = route.params;

  // State to hold student details
  const [name, setName] = useState(initialName);
  const [birthday, setBirthday] = useState(initialBirthday);
  const [attendance, setAttendance] = useState(''); // Example for attendance
  const [participation, setParticipation] = useState(''); // Example for participation

  // Function to handle updating the student
  const handleUpdate = async () => {
    try {
      const updatedData = {
        name,
        birthday,
        attendance, // Add more fields as needed
        participation, // Add more fields as needed
      };
      await updateStudent(studentId, updatedData);
      navigation.goBack(); // Return to the previous screen
    } catch (error) {
      console.error('Error updating student: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Student</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder='Enter student name'
      />

      <Text style={styles.label}>Birthday</Text>
      <TextInput
        style={styles.input}
        value={birthday}
        onChangeText={setBirthday}
        placeholder="Enter student's birthday"
      />

      <Text style={styles.label}>Attendance</Text>
      <TextInput
        style={styles.input}
        value={attendance}
        onChangeText={setAttendance}
        placeholder='Enter attendance'
      />

      <Text style={styles.label}>Participation</Text>
      <TextInput
        style={styles.input}
        value={participation}
        onChangeText={setParticipation}
        placeholder='Enter participation'
      />

      {/* Custom Save Button with styling */}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Update Student</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00796b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditStudent;
