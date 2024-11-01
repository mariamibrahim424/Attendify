import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native';

const ClassDetails = ({ route }) => {
  const { classId, className, ageGroup } = route.params;

  // You can fetch the students for this class based on classId
  const students = []; // Replace with your logic to fetch students

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.classTitle}>{className}</Text>
      <Text style={styles.ageGroup}>Age Group: {ageGroup}</Text>

      {/* List of Students */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text style={styles.studentText}>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  classTitle: { fontSize: 24, fontWeight: 'bold' },
  ageGroup: { fontSize: 18, marginVertical: 10 },
  studentItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  studentText: { fontSize: 16 },
});

export default ClassDetails;
