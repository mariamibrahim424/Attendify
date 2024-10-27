import {useState} from 'react';
import {Text, SafeAreaView} from 'react-native';
import {FB_AUTH} from '../config/firebase.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FB_AUTH;
  return (
    <SafeAreaView>
      <Text>Login</Text>
    </SafeAreaView>
  );
};

export default Login;
