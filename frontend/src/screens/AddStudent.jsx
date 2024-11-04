import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addUser } from '../config/firebase'; // Adjust the import path as needed

const AddUser = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  const saveUser = async () => {
    if (userName) {
      try {
        await addUser({ name: userName }); // Call the Firestore function to save the user
        alert('User added successfully!');
        navigation.goBack(); // Navigate back to the previous screen
      } catch (error) {
        console.error("Error adding user: ", error);
        alert('Error saving user. Please try again.');
      }
    } else {
      alert('Please enter a user name');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>User Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter user name"
        value={userName}
        onChangeText={setUserName}
      />
      <Button title="Add User" onPress={saveUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default AddUser;
