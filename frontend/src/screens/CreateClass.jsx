import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {addClass} from '../config/firebase'; // Adjust the import path as needed

const CreateClass = ({navigation}) => {
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
        const classId = await addClass(newClass); // Call the Firestore function to save the class
        navigation.navigate('Home', {classId});
      } catch (error) {
        console.error('Error adding class: ', error);
        alert('Error saving class. Please try again.');
      }
    } else {
      alert('Please fill in all fields'); // Added alert for validation
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create New Class</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Class Name</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter class name'
          value={className}
          onChangeText={setClassName}
        />

        <Text style={styles.label}>Age Group</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter age group (e.g. 5-7 years)'
          value={ageGroup}
          onChangeText={setAgeGroup}
        />

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {startDate.toDateString()}
            </Text>
            <Text style={styles.dateButtonText}>
              {startDate.toLocaleTimeString()}
            </Text>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode='datetime'
            display='default'
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveClass}>
          <Text style={styles.saveButtonText}>Save Class</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#00796b',
  },
  saveButton: {
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateClass;
