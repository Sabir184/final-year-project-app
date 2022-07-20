import React, {useState, useContext} from 'react';
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
import styles from './loginStyle';
import {navigateToNestedRoute} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
import appTheme from '../../constants/colors';
import {AuthContext} from '../../context';
import {getData} from '../../Backend/utility';
import Auth from '../../Backend/Auth';
import { _storeData } from '../../Backend/AsyncFuncs';
export function Login({navigation}) {
  const {state, dispatch} = useContext(AuthContext);

  const handleBackButton = () => {
    navigation?.goBack();
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };

  const Userlogin = () => {
    if (email && password) {
      setLoading(true);

      Auth.signInWithEmail(email, password)
        .then(async userAuthData => {
          if (userAuthData) {
            console.log('>>>', userAuthData.user.uid);
            const userProfile = await getData(
              'users',
              userAuthData.user.uid,
            );
            dispatch({
              type: 'login',
              payload: {
                id: userAuthData.user.uid,
                name: userProfile.fullName,
                photo: userProfile.image,
                designation: 'Lead Designer',
              },
            });
            _storeData("loggedIn", "true").then(() => {
              navigation.reset({
                routes: [{ name: 'BottomStack' }]
              })
            })
            .catch((error) => {
              console.log("Some error occured", error)
            })
            // navigation.navigate('BottomStack', {route: 'Projects'});
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          alert(error.message);
        });
    }
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
            placeholder="email"
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
          style={styles.loginBtnWrapper}
          onPress={() => Userlogin()}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.loginBtnText}>LOGIN</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpBtnWrapper}
          onPress={() => handleNavigation('SignUp')}>
          <Text style={styles.signUpBtnText}>
            Don't have an account? SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
