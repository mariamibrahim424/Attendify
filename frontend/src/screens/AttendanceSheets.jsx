import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {fetchAttendanceRecords} from '../config/firebase'; // A function to fetch attendance records
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker

const AttendanceSheet = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to track fetching status
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [open, setOpen] = useState(false); // Controlled open state for DropDownPicker
  const route = useRoute();
  const {classId, className} = route.params; // Getting class details from route params

  useEffect(() => {
    const loadAttendanceRecords = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const records = await fetchAttendanceRecords(classId);

        setAttendanceRecords(records);
        setFilteredRecords(records); // Initialize filtered records with all attendance records

        // Extract unique dates
        const dates = [...new Set(records.map((record) => record.timeStamp))];
        setUniqueDates(dates);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    loadAttendanceRecords();
  }, [classId]);

  // Function to filter attendance by date
  const filterByDate = (timeStamp) => {
    setSelectedDate(timeStamp); // Set the selected date
  };

  // useEffect to react to selectedDate changes and filter records accordingly
  useEffect(() => {
    if (selectedDate) {
      // Filter records by the selected date
      const filtered = attendanceRecords.filter(
        (record) => record.timeStamp === selectedDate,
      );
      setFilteredRecords(filtered);
      // console.log('filtered ' + JSON.stringify(filtered, null, 2));
    } else {
      // If no date is selected, show all records
      setFilteredRecords(attendanceRecords);
      // console.log('unfiltered ' + JSON.stringify(attendanceRecords, null, 2));
    }

    // Close the modal after selection
    setModalVisible(false);
  }, [selectedDate, attendanceRecords]); // Re-run this effect when `selectedDate` or `attendanceRecords` change

  // Function to tally attendance for each student in the current week
  const tallyWeeklyAttendance = () => {
    const tallyMap = new Map();

    // Loop through each attendance record and tally it
    attendanceRecords.forEach((record) => {
      if (!tallyMap.has(record.studentId)) {
        tallyMap.set(record.studentId, {
          count: 0,
          name: record.studentName,
          present: record.present,
        });
      }
      if (record.present) {
        const tallyItem = tallyMap.get(record.studentId);
        tallyItem.count += 1;
        tallyMap.set(record.studentId, tallyItem, record.present);
      }
    });

    // Convert Map to Array for rendering and sort by attendance count (most to least)
    const sortedTally = Array.from(tallyMap.values()).sort(
      (a, b) => b.count - a.count,
    );
    // console.log(sortedTally);
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
          <ActivityIndicator size='large' color='#00bfae' />
          <Text style={styles.loadingText}>Loading Attendance...</Text>
        </View>
      ) : (
        <>
          {/* Date Filter button to open the modal */}
          <View style={styles.dateFilter}>
            <Text style={styles.dateFilterText}>Filter by Date:</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setModalVisible(true)} // Open modal on press
            >
              <Text style={styles.pickerText}>
                {selectedDate ? selectedDate : 'All Dates'}{' '}
                {/* Show 'All Dates' if no date is selected */}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Modal for selecting a date */}
          <Modal
            visible={modalVisible}
            animationType='slide'
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Select a Date</Text>
                  <DropDownPicker
                    open={open} // Controlled open state for DropDownPicker
                    value={selectedDate}
                    items={[
                      {label: 'All Dates', value: null},
                      ...uniqueDates.map((date) => ({
                        label: date,
                        value: date,
                      })),
                    ]}
                    setOpen={setOpen}
                    setValue={filterByDate} // Directly pass `filterByDate` function
                    containerStyle={styles.pickerContainer}
                    style={styles.picker}
                    dropDownStyle={styles.dropDownStyle}
                    placeholder='Select a Date'
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)} // Close modal
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Attendance Tally */}
          <FlatList
            data={tallyWeeklyAttendance()} // Display the attendance tally
            keyExtractor={(item) => item.name} // Use the student name as a key
            renderItem={({item}) => (
              <TouchableOpacity style={styles.studentItem}>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text
                    style={[
                      styles.attendanceCount,
                      selectedDate && !item.present // If there's a selected date and the student is absent
                        ? {color: '#800020'} // Red for Absent
                        : selectedDate && item.present // If there's a selected date and the student is present
                        ? {color: '#008000'} // Green for Present
                        : null, // Keep the default color for "Days Present"
                    ]}
                  >
                    {selectedDate
                      ? item.present
                        ? 'Present'
                        : 'Absent'
                      : `Days Present: ${item.count}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No Attendance Records Available
              </Text>
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
    textShadowOffset: {width: 1, height: 1},
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
    color: '#00796b',
    textTransform: 'uppercase',
  },
  picker: {
    height: 50, // Ensure height to show one item
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  dropDownStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  pickerContainer: {
    width: 250, // Set a reasonable width
    height: 50,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
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
    shadowOffset: {width: 0, height: 3},
    transform: [{translateX: 5}],
    overflow: 'hidden',
    borderLeftWidth: 5,
    borderLeftColor: '#00796b',
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
