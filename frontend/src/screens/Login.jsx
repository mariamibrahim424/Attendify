import React, {useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {FB_AUTH} from '../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';

// Pass in in navigation so we can move around screens
const Login = ({navigation}) => {
  // State to keep track of what the user types in
  const [email, setEmail] = useState(''); // Email input
  const [password, setPassword] = useState(''); // Password input
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false); // To show if we're waiting on something

  // This function runs when the user clicks the login button
  const handleLogin = () => {
    setLoading(true); // Set loading to true so we can show that we're busy
    signInWithEmailAndPassword(FB_AUTH, email, password) // Try to log the user in
      .then((userCredential) => {
        // If login is successful
        navigation.navigate('Home'); // Move to the Home screen
      })
      .catch((error) => {
        // If something goes wrong
        Alert.alert('Error', error.message); // Show an error message
      })
      .finally(() => setLoading(false)); // No matter what, set loading back to false
  };

  // render UI
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={require('../images/teal_bg.jpg')} // Use require to specify the image path
        style={{height: Dimensions.get('window').height / 2.85}}
      >
        <View style={styles.brand}>
          {/* Big title at the top */}
          <Text style={styles.brandText}>Attendify</Text>
        </View>
      </ImageBackground>

      {/* Input for the email */}
      <View style={styles.container}>
        <View>
          <Input
            label='Email'
            placeholder='email@address.com'
            leftIcon={<Icon name='user' size={20} color='#bebebe' />}
            value={email}
            onChangeText={setEmail}
          />

          <Input
            placeholder='Password'
            label='Password'
            leftIcon={<Icon name='lock' size={20} color='#bebebe' />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color='#bebebe'
                />
              </TouchableOpacity>
            }
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={styles.button}
            >
              <Text style={{color: 'white'}}>
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              disabled={loading}
              style={[
                styles.button,
                {
                  backgroundColor: 'transparent',
                  borderColor: '#006666',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={{color: '#006666'}}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles for our components
const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    backgroundColor: '#f2f2f2',
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
    paddingHorizontal: 35,
    paddingTop: 50,
  },
  brand: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  brandText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textTransform: 'uppercase',
  },
  button: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    width: Dimensions.get('screen').width * 0.7,
    backgroundColor: '#006666',
    margin: 10,
  },
});

export default Login;
