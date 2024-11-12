import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {addStudent} from '../config/firebase'; // You'll create this function in firebase.js
import ImagePickerExample from '../components/ImagePicker';

const AddStudent = ({route, navigation}) => {
  const {classId} = route.params;
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [profilePic, setProfilePic] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddStudent = async () => {
    const studentData = {name, birthday: birthday.toISOString(), profilePic};
    console.log(studentData);
    await addStudent(classId, studentData); // Function to add a student to Firestore
    navigation.navigate('ClassDetails', {
      classId: classId,
      studentData: studentData,
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setBirthday(currentDate); // Update the birthday with the selected date
    setShowDatePicker(false); // Close the picker after selection
  };

  const showDatePickerDialog = () => {
    setShowDatePicker(true); // Open the date picker
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Student</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter student's name"
      />

      <Text style={styles.label}>Birthday</Text>
      <TouchableOpacity onPress={showDatePickerDialog}>
        <View style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {birthday.toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode='date' // Use date mode
          display='default' // Use default display (could also be "spinner" or "calendar")
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Profile Pic</Text>
      {profilePic && <Image source={{uri: profilePic}} style={styles.image} />}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => {
          ImagePickerExample(setProfilePic); // Pass function to handle selected image
        }}
      >
        <Text style={styles.uploadButtonText}>Upload Profile Pic</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleAddStudent}>
        <Text style={styles.saveButtonText}>Save Student</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#00796b', // Teal border color
    padding: 12,
    marginVertical: 12,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#fff', // White background color
  },
  dateButton: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#00796b',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginVertical: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#00796b',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
    alignSelf: 'center',
  },
  uploadButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default AddStudent;
