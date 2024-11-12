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

const Home = ({route}) => {
  const classId = route.params?.classId;
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
      console.log('setting classes');
      setClasses(classList);
    };
    loadClasses();
  }, [classId]);

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
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}></View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Stats</Text>
          <View style={styles.statsBox}>
            <View style={styles.statItem}>
              <Ionicons name='star' size={32} color='#fbc02d' />
              <Text style={styles.statLabel}>Top Student</Text>
              <Text style={styles.statValue}>Mariam</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name='arrow-up-circle' size={32} color='#f57c00' />
              <Text style={styles.statLabel}>Top Class</Text>
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
          contentContainerStyle={styles.listContent}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    margin: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00796b',
    marginBottom: 15,
  },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#e0f2f1', // Light teal background for each stat item
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 120, // Width of each stat item
  },
  statLabel: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    marginTop: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 12,
    color: '#616161',
  },
  listContent: {
    paddingHorizontal: 15, // Added padding on the sides of the list
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 70,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  classIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00796b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  classIconText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  classText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    color: '#616161',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#00796b',
    borderRadius: 50,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  deleteButton: {
    backgroundColor: '#e57373',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 70, // Match classItem height
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Home;
