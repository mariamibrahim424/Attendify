import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchAttendanceRecords } from '../config/firebase'; // A function to fetch attendance records
import { Picker } from '@react-native-picker/picker'; // Make sure this is the correct import

const AttendanceSheet = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to track fetching status
  const route = useRoute();
  const { classId, className } = route.params; // Getting class details from route params

  useEffect(() => {
    const loadAttendanceRecords = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const records = await fetchAttendanceRecords(classId);
        setAttendanceRecords(records);
        setFilteredRecords(records); // Initialize filtered records with all attendance records
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    loadAttendanceRecords();
  }, [classId]);

  // Function to filter attendance by date
  const filterByDate = (date) => {
    setSelectedDate(date);
    if (date) {
      // Filter records by the selected date
      const filtered = attendanceRecords.filter((record) => record.date === date);
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(attendanceRecords); // If no date is selected, show all records
    }
  };

  // Function to tally attendance for each student in the current week
  const tallyWeeklyAttendance = () => {
    const tallyMap = new Map();

    // Loop through each attendance record and tally it
    attendanceRecords.forEach((record) => {
      if (!tallyMap.has(record.studentId)) {
        tallyMap.set(record.studentId, { count: 0, name: record.studentName });
      }
      if (record.present) {
        const tallyItem = tallyMap.get(record.studentId);
        tallyItem.count += 1;
        tallyMap.set(record.studentId, tallyItem);
      }
    });

    // Convert Map to Array for rendering and sort by attendance count (most to least)
    const sortedTally = Array.from(tallyMap.values()).sort((a, b) => b.count - a.count);

    return sortedTally;
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.className}>{className} - Attendance Sheet</Text>
      </View>

      {/* Loading indicator while data is being fetched */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00bfae" />
          <Text style={styles.loadingText}>Loading Attendance...</Text>
        </View>
      ) : (
        <>
          {/* Date Picker */}
          <View style={styles.dateFilter}>
            <Text style={styles.dateFilterText}>Filter by Date:</Text>
            <Picker
              selectedValue={selectedDate}
              style={styles.picker}
              onValueChange={(itemValue) => filterByDate(itemValue)}
            >
              <Picker.Item label="All Dates" value={null} />
              {attendanceRecords.map((record) => (
                <Picker.Item
                  key={record.date} // Use the date as the key
                  label={new Date(record.date).toLocaleDateString()}
                  value={record.date}
                />
              ))}
            </Picker>
          </View>
          {/* Attendance Tally */}
          <FlatList
            data={tallyWeeklyAttendance()} // Display the attendance tally
            keyExtractor={(item) => item.name} // Use the student name as a key
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.studentItem}>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.attendanceCount}>Days Present: {item.count}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Attendance Records Available</Text>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7fa',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#00bfae',
    marginBottom: 30,
  },
  className: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#00bfae',
    letterSpacing: 1,
    textShadowColor: '#1e6b67',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    justifyContent: 'space-between',
  },
  dateFilterText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#00bfae',
    textTransform: 'uppercase',
  },
  picker: {
    height: 50,
    width: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  studentItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    transform: [{ translateX: 5 }],
    overflow: 'hidden',
    borderLeftWidth: 5,
    borderLeftColor: '#00bfae',
    transition: '0.3s',
  },
  studentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  attendanceCount: {
    fontSize: 16,
    color: '#00796b',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#00bfae',
    marginTop: 10,
  },
});

export default AttendanceSheet;
