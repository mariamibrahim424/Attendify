// Import React and some stuff from React Native
import React, { useState } from 'react';
import { Text, TextInput, Button, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth"; // Get the function to handle login from Firebase
import { FB_AUTH } from '../config/firebase'; // This is where we get our Firebase Auth instance

// This is the Home component, where users land after logging in
const Home = () => (
  <SafeAreaView>
    {/* A friendly welcome message for users :) */}
    <Text>THE HOME PAGE IS GUNNA BE ANNOYING AND HARD</Text>
  </SafeAreaView>
);

export default Home;