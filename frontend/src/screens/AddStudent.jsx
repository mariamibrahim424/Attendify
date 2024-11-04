import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { addStudent } from '../config/firebase'; // You'll create this function in firebase.js

const AddStudent = ({ route, navigation }) => {
  const { classId } = route.params;
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleAddStudent = async () => {
    const studentData = { name, birthday, profilePic };
    await addStudent(classId, studentData); // Function to add a student to Firestore
    navigation.goBack(); // Return to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter name" />

      <Text style={styles.label}>Birthday</Text>
      <TextInput style={styles.input} value={birthday} onChangeText={setBirthday} placeholder="Enter birthday" />

      <Text style={styles.label}>Profile Pic</Text>
      {profilePic && <Image source={{ uri: profilePic }} style={styles.image} />}
      <Button title="Upload Profile Pic" onPress={() => {/* Handle image upload */}} />

      <TouchableOpacity style={styles.saveButton} onPress={handleAddStudent}>
        <Text style={styles.saveButtonText}>Save Student</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderBottomWidth: 1, padding: 8, marginVertical: 10 },
  image: { width: 100, height: 100, marginVertical: 10 },
  saveButton: { backgroundColor: '#00796b', padding: 10, alignItems: 'center', borderRadius: 5 },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
});

export default AddStudent;
