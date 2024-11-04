import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addClass } from '../config/firebase'; // Adjust the import path as needed

const CreateClass = ({ navigation }) => {
  const [className, setClassName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const saveClass = async () => {
    if (className && ageGroup) {
      const newClass = {
        name: className,
        ageGroup: ageGroup,
        startDate: startDate.toISOString(), // Include the start date
      };

      try {
        await addClass(newClass); // Call the Firestore function to save the class
        navigation.navigate('Home');
      } catch (error) {
        console.error("Error adding class: ", error);
        alert('Error saving class. Please try again.');
      }
    } else {
      alert('Please fill in all fields'); // Added alert for validation
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Class Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter class name"
        value={className}
        onChangeText={setClassName}
      />

      <Text style={styles.label}>Age Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter age group (e.g. 5-7 years)"
        value={ageGroup}
        onChangeText={setAgeGroup}
      />

      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{startDate.toDateString()}</Text>
          <Text style={styles.dateButtonText}>{startDate.toLocaleTimeString()}</Text>
        </View>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Button title="Save Class" onPress={saveClass} />
    </SafeAreaView>
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
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#e6e6e6',
    marginBottom: 20,
  },
  dateButtonText: { fontSize: 16 },
});

export default CreateClass;
