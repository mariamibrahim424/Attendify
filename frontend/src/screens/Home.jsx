import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // for icons
import { useNavigation, useRoute } from '@react-navigation/native'; // Import navigation hook and route

const Home = () => {
  const [classes, setClasses] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const navigation = useNavigation(); // Initialize navigation
  const route = useRoute(); // Initialize route to access params

  useEffect(() => {
    // Set the current date and time
    const date = new Date();
    setCurrentDate(date.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }));
  }, []);

  useEffect(() => {
    // Check for new class data when component mounts or updates
    if (route.params?.newClass) {
      setClasses((prevClasses) => [...prevClasses, route.params.newClass]); // Update classes state with new class
    }
  }, [route.params]);

  // Function to navigate to the CreateClass screen
  const goToAddClass = () => {
    navigation.navigate('CreateClass'); // Updated to navigate to CreateClass
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerText}>HOME</Text>
        <Ionicons name="person-circle-outline" size={24} color="black" />
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Stats</Text>
        <View style={styles.statsBox}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={32} color="black" />
            <Text>Top Student</Text>
            <Text style={styles.statValue}>Mariam</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up-circle" size={32} color="black" />
            <Text>Top Class</Text>
            <Text style={styles.statValue}>Class 3</Text>
          </View>
        </View>
      </View>

      {/* Date and Time */}
      <Text style={styles.dateText}>{currentDate}</Text>

      {/* Class List */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.classItem}
            onPress={() => navigation.navigate('ClassDetails', { classId: item.id, className: item.name })} // Updated to navigate to ClassDetails
          >
            <View style={styles.classIcon}>
              <Text style={styles.classIconText}>C{item.id}</Text>
            </View>
            <Text style={styles.classText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No Classes Available</Text>}
      />

      {/* Add Class Button */}
      <TouchableOpacity style={styles.addButton} onPress={goToAddClass}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
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
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  dateText: { fontSize: 16, fontWeight: '500', textAlign: 'center', marginVertical: 10 },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  classIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcdcdc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  classIconText: { fontWeight: 'bold' },
  classText: { fontSize: 16 },
  emptyText: { color: 'black', textAlign: 'center', marginTop: 20 },
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

export default Home;
