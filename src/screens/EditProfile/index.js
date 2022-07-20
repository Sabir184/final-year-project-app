import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import styles from './editProfileStyle';
import {TabScreenHeader} from '../../components';
import {AuthContext} from '../../context';
import {db} from '../../Backend/firebaseConfig';

export function EditProfile() {
  const {state, dispatch} = useContext(AuthContext);
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [loading, setLoading] = useState(false)
  console.log("State is", state.user)

  const updateProfile = async () => {
    setLoading(true)
    try {
      await db
      .collection('users')
      .doc(state.user.id)
      .set(
        { fullName: name, designation: designation },
        { merge: true }
      )
      dispatch({
        type: 'editprofile',
        payload: {
          id: state.user.id,
          name: name,
          photo: state.user.photo,
          designation: designation,
        },
      })
      setLoading(false)
    } catch (error) {
      console.log("Some error occured", error)
      setLoading(false)
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => <Text style={styles.headerTitle}>Edit Profile</Text>}
        isSearchBtnVisible={false}
        isMoreBtnVisible={true}
      />
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
        <TextInput
        placeholder="Name"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => {
          setName(text)
        }}
      />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
        <TextInput
        placeholder="Designation"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => {
          setDesignation(text)
        }}
      />
        </View>
        </ScrollView>
        <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => updateProfile()}>
        {loading ?
          <ActivityIndicator color={'#fff'} />
        : 
        <Text style={styles.btnText}>Save</Text>}
      </TouchableOpacity>

    </SafeAreaView>
  );
}
