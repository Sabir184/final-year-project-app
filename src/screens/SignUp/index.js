import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './signUpStyle';
import {navigateToNestedRoute} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
import appTheme from '../../constants/colors';
import Auth from '../../Backend/Auth';
import { saveData } from '../../Backend/utility';
import {avatar} from '../../assets/constants';

export function SignUp({navigation}) {
  const handleBackButton = () => {
    navigation?.goBack();
  };

  const [fName, setFname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false) 
  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };

  const registerUser = () => {
    setLoading(true);
    Auth.userSignUp(email, password)
      .then(async data => {
        console.log({data: data.user});

        setLoading(true);
        try {
          await saveData('users', data.user.uid, {
            email: data.user.email,
            fullName: fName,
            image: avatar,
            id: data.user.uid,
          });
  
          setLoading(false);
          navigation.navigate('Login');

          console.log("Document writtern success")
          
        } catch (error) {
          console.log("Some error occured", error)
        }
        // await FB.saveData('users', data.user.uid, {
        //   email: data.user.email,
        //   fullName: fName,
        //   image: avatar,
        //   id: data.user.uid,
        // });

        // setLoading(false);
        // navigation.navigate('Login');

      })
      .catch(error => {
        setLoading(false);

        console.log('>>>', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBackButton()}>
          <MaterialIcons name="keyboard-arrow-left" size={25} color="gray" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContent}>
        <Text style={styles.largeText}>Welcome Back!</Text>
        <Text style={styles.smallText}>
          Log into your account &amp; manage {'\n'}your tasks
        </Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="gray"
            style={styles.textInput}
            value={fName}
            onChangeText={val => setFname(val)}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={val => setEmail(val)}
            value={email}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={showPassword ? false : true}
            style={styles.textInput}
            onChangeText={val => setPassword(val)}
            value={password}
          />
          <TouchableOpacity onPress={() => {
            setShowPassword(!showPassword)
          }}>
          {showPassword ?  
          <Octicons name="eye" size={20} color="gray" />
          :
          <Octicons name="eye-closed" size={20} color="gray" />
          }
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.signUpBtnWrapper}
          onPress={() => registerUser()}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.signUpBtnText}>SIGN UP</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtnWrapper}
          onPress={() => handleNavigation('Login')}>
          <Text style={styles.loginBtnText}>
            Already have an account? LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
