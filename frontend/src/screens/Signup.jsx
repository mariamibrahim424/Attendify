import React, {useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {FB_AUTH} from '../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';

// Pass in in navigation so we can move around screens
const Signup = ({navigation}) => {
  // State to keep track of what the user types in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // To show if we're waiting on something
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // This function runs when the user clicks the Signup button
  const handleSignup = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    setLoading(true); // Set loading to true so we can show that we're busy
    createUserWithEmailAndPassword(FB_AUTH, email, password) // Try to log the user in
      .then((userCredential) => {
        // If Signup is successful
        const user = userCredential.user;
        navigation.navigate('Login');
      })
      .catch((error) => {
        // If something goes wrong
        if (error.code == 'auth/email-already-in-use') {
          Alert.alert('Error', 'Email already in use.'); // Show an error message
        }
        if (error.code == 'auth/weak-password') {
          Alert.alert('Error', 'Password has to be at least six characters.'); // Show an error message
        }
        if (error.code == 'auth/invalid-email') {
          Alert.alert('Error', 'Invalid email'); // Show an error message
        } else {
          Alert.alert('Error', 'Invalid credentials.'); // Show an error message
        }
      })
      .finally(() => setLoading(false)); // No matter what, set loading back to false
  };

  // render UI
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View>
          {/* Input for the email */}
          <Input
            label='Email'
            placeholder='email@address.com'
            leftIcon={<Icon name='user' size={20} color='#bebebe' />}
            value={email}
            onChangeText={setEmail}
          />
          {/* Input for the password */}
          <Input
            label='Password'
            placeholder='Password'
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
          {/* Input for password confirmation */}
          <Input
            label='Confirm Password'
            placeholder='Confirm Password'
            leftIcon={<Icon name='lock' size={20} color='#bebebe' />}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color='#bebebe'
                />
              </TouchableOpacity>
            }
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              style={styles.button}
            >
              <Text style={{color: 'white'}}>
                {loading ? 'Signing up...' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    backgroundColor: '#f2f2f2',
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
    paddingHorizontal: 35,
    marginTop: 30,
    paddingTop: 50,
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

export default Signup;
