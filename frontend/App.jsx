// Import the stuff we need from React Native and React Navigation
import { Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login'; // Grab the Login screen
import Home from './src/screens/Home'; // Grab the Home screen

// Create a stack navigator for handling screen transitions
const Stack = createNativeStackNavigator();

// Main app component
const App = () => {
  return (
    // Wrap everything in NavigationContainer so we can navigate between screens
    <NavigationContainer>
      {/* Setting stack navigator(Helps with screen management) */}
      <Stack.Navigator initialRouteName='Login'>
        {/* Login screen */}
        <Stack.Screen name='Login' component={Login} />
        {/* Temporary Home screen for after they login */}
        <Stack.Screen name='Home' component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Don't forget to export the App component so it can be used elsewhere!
export default App;