import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; // for icons
import {useNavigation} from '@react-navigation/native'; // Import navigation hook
import {fetchClassesForUser} from '../config/firebase'; // Import the fetchClassesForUser function from your firebase config
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler'; // Import from the updated library
import {deleteClass} from '../config/firebase';

const Home = () => {
  const [classes, setClasses] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const date = new Date();
    setCurrentDate(
      date.toLocaleString('en-GB', {dateStyle: 'long', timeStyle: 'short'}),
    );
  }, []);

  useEffect(() => {
    const loadClasses = async () => {
      const classList = await fetchClassesForUser();
      setClasses(classList);
    };
    loadClasses();
    // setClasses((prevClasses) => [...prevClasses, {...newClass, id: classId}]);
  }, []);

  const goToAddClass = () => {
    navigation.navigate('CreateClass');
  };

  const handleDelete = (id) => {
    try {
      deleteClass(id);
      setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== id)); // Update the state
    } catch (error) {
      console.error('Error deleting class: ', error);
      alert('Error deleting class. Please try again.');
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Text style={{color: 'white'}}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* <Ionicons name='person-circle-outline' size={24} color='black' /> */}
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Stats</Text>
          <View style={styles.statsBox}>
            <View style={styles.statItem}>
              <Ionicons name='star' size={32} color='black' />
              <Text>Top Student</Text>
              <Text style={styles.statValue}>Mariam</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name='arrow-up-circle' size={32} color='black' />
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
          renderItem={({item}) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity
                style={styles.classItem}
                onPress={() =>
                  navigation.navigate('ClassDetails', {
                    classId: item.id,
                    className: item.name,
                  })
                }
              >
                <View style={styles.classIcon}>
                  <Text style={styles.classIconText}>C{item.id}</Text>
                </View>
                <Text style={styles.classText}>{item.name}</Text>
              </TouchableOpacity>
            </Swipeable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No classes available</Text>
          }
        />

        {/* Add Class Button */}
        <TouchableOpacity style={styles.addButton} onPress={goToAddClass}>
          <Ionicons name='add' size={30} color='white' />
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 10},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  statsTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {alignItems: 'center'},
  statValue: {fontSize: 16, fontWeight: 'bold', marginTop: 5},
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 70,
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
  classIconText: {fontWeight: 'bold'},
  classText: {fontSize: 16},
  emptyText: {color: 'black', textAlign: 'center', marginTop: 20},
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
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 70, // Make sure this matches the classItem height
    borderRadius: 8,
  },
});

export default Home;
