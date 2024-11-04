import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchStudentsForClass } from '../config/firebase'; // Assuming a function to fetch students

const ClassDetails = () => {
  const [students, setStudents] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { classId, className } = route.params; // Get class details from route params

  useEffect(() => {
    const loadStudents = async () => {
      const studentList = await fetchStudentsForClass(classId); // Fetch students for this class
      setStudents(studentList);
    };
    loadStudents();
  }, [classId]);

  // Function to navigate to AddStudent screen
  const goToAddStudent = () => {
    navigation.navigate('AddStudent', { classId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{className}</Text>
        <Ionicons name="person-circle-outline" size={24} color="black" />
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
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EditStudent', {
            studentId: item.id,
            initialName: item.name,
            initialBirthday: item.birthday,
            // Pass other fields to edit, like attendance and participation
          })}>
            <View style={styles.studentItem}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentDetails}>Birthday: {item.birthday}</Text>
            </View>
          </TouchableOpacity>
        )}

        ListEmptyComponent={<Text style={styles.emptyText}>No Students Added Yet</Text>}
      />

      {/* Add Student Button */}
      <TouchableOpacity style={styles.addButton} onPress={goToAddStudent}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  topSection: {
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  topTitle: { fontSize: 18, fontWeight: 'bold' },
  topStudent: { fontSize: 16, fontWeight: 'bold', color: '#00796b', marginTop: 5 },
  studentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  studentName: { fontSize: 16, fontWeight: 'bold' },
  studentDetails: { fontSize: 14, color: '#757575' },
  emptyText: { textAlign: 'center', color: '#757575', marginTop: 20 },
  addButton: {
    backgroundColor: '#00796b',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 5,
  },
});

export default ClassDetails;
