import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Home from './src/screens/Home';
import CreateClass from './src/screens/CreateClass';
import ClassDetails from './src/screens/ClassDetails';
import AddStudent from './src/screens/AddStudent';
import EditStudent from './src/screens/EditStudent';
import TakeAttendance from './src/screens/TakeAttendance';
import AttendanceSheets from './src/screens/AttendanceSheets';

// Create a stack navigator for handling screen transitions
const Stack = createNativeStackNavigator();

// Main app component
const App = () => {
  return (
    // Wrap everything in NavigationContainer so we can navigate between screens
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        {/* Setting stack navigator(Helps with screen management) */}
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen name='Signup' component={Signup} />
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='CreateClass' component={CreateClass} />
          <Stack.Screen name='ClassDetails' component={ClassDetails} />
          <Stack.Screen name='AddStudent' component={AddStudent} />
          <Stack.Screen name='EditStudent' component={EditStudent} />
          <Stack.Screen name='TakeAttendance' component={TakeAttendance} />
          <Stack.Screen name='AttendanceSheets' component={AttendanceSheets} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

// Don't forget to export the App component so it can be used elsewhere!
export default App;
