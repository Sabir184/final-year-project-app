


import firebase from '@react-native-firebase/app';
import Rnauth from '@react-native-firebase/auth';
import Rnfirestore from '@react-native-firebase/firestore';
import Rnstorage from '@react-native-firebase/storage';

export const db = Rnfirestore(); 
export const storage = Rnstorage();
export const auth =Rnauth();

