// Import React and some stuff from React Native
import React, { useState } from 'react';
import { Text, TextInput, Button, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth"; // Get the function to handle login from Firebase
import { FB_AUTH } from '../config/firebase'; // This is where we get our Firebase Auth instance

// Here's our Login component, and we're passing in navigation so we can move around screens
const Login = ({ navigation }) => {
  // State to keep track of what the user types in
  const [email, setEmail] = useState(''); // Email input
  const [password, setPassword] = useState(''); // Password input
  const [loading, setLoading] = useState(false); // To show if we're waiting on something

  // This function runs when the user clicks the login button
  const handleLogin = () => {
    setLoading(true); // Set loading to true so we can show that we're busy
    signInWithEmailAndPassword(FB_AUTH, email, password) // Try to log the user in
      .then((userCredential) => {
        // If login is successful
        Alert.alert("Success", "Logged in successfully!"); // Show a success message
        navigation.navigate("Home"); // Move to the Home screen
      })
      .catch((error) => {
        // If something goes wrong
        Alert.alert("Error", error.message); // Show an error message
      })
      .finally(() => setLoading(false)); // No matter what, set loading back to false
  };

  // Now, let's render our UI
  return (
    <SafeAreaView style={styles.container}>
      {/* Big title at the top */}
      <Text style={styles.title}>RollCall</Text>
      {/* A little message telling users to log in */}
      <Text style={styles.subtitle}>Log in down there</Text>
      {/* Input for the email */}
      <TextInput
        style={styles.input}
        placeholder="Email" // What to show when nothing's typed
        value={email} // What's currently in the email input
        onChangeText={setEmail} // Update the email state when the user types
      />
      {/* Input for the password */}
      <TextInput
        style={styles.input}
        placeholder="Password" // Placeholder for the password input
        value={password} // What's in the password input
        onChangeText={setPassword} // Update the password state as they type
        secureTextEntry // This makes sure the password is hidden
      />
      {/* The login button */}
      <Button
        title={loading ? "Logging in..." : "Login"} // Change the button text based on loading state
        onPress={handleLogin} // Call handleLogin when the button is pressed
        disabled={loading} // Disable the button if we're currently logging in
      />
    </SafeAreaView>
  );
};

// Styles for our components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center' // Center everything vertically
  },
  title: {
    fontSize: 48, // Make the title nice and big
    fontWeight: 'bold', // Bold for emphasis
    textAlign: 'center', // Center the title
    marginBottom: 10, // Space below the title
    color: '#3E3E3E' // A nice dark gray color for the title
  },
  subtitle: {
    fontSize: 18, // Size for the subtitle
    textAlign: 'center', // Center it too
    marginBottom: 20, // Space below the subtitle
    color: '#666666' // Lighter gray for the subtitle
  },
  input: {
    height: 40,
    borderColor: 'gray', // Border color for the input fields
    borderWidth: 1, // Thickness of the border
    marginBottom: 10, // Space below each input
    padding: 10 // Some padding inside the input fields
  }
});

// Don't forget to export the Login component!
export default Login;