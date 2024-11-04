import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateStudent } from '../config/firebase'; // Import the function to update student details

const EditStudent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentId, initialName, initialBirthday } = route.params;

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
      console.error("Error updating student: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Birthday</Text>
      <TextInput
        style={styles.input}
        value={birthday}
        onChangeText={setBirthday}
      />
      <Text style={styles.label}>Attendance</Text>
      <TextInput
        style={styles.input}
        value={attendance}
        onChangeText={setAttendance}
      />
      <Text style={styles.label}>Participation</Text>
      <TextInput
        style={styles.input}
        value={participation}
        onChangeText={setParticipation}
      />
      <Button title="Update Student" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default EditStudent;
