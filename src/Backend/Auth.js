import {auth} from './firebaseConfig';
// import { saveData, uriToBlob, downloadImage } from './utility';
import Toast from 'react-native-simple-toast';

const userSignUp = async (email, password) => {
  let userData = null;

  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(async user => {
      Toast.show(
        'Sign Up Successful! we send a message to the email...To verify your email address, click the link and sign',
      );
      let actions = [user.user.sendEmailVerification()];
      await Promise.all(actions)
        .then(async () => {
          console.log('User', user, 'emailVerified', user.user.emailVerified);
        })
        .catch(error => {
          alert(error.message);
        });
      userData = user;
    })
    .catch(error => {
      Toast.show(error.code);
    });
  return userData;
};
const signInWithEmail = async (email, password) => {
  let data = null;
  await auth
    .signInWithEmailAndPassword(email, password)
    .then(userData => {
      data = userData;
    })
    .catch(function (error) {
      data = false;
      Toast.show(error.code);
      // alert(error.code + ': ' + error.message);
    });
  return data;
};
export async function signInWithPhoneNumber(phoneNo, password) {
  let success = true;
  await auth
    .signInWithEmailAndPassword(phoneNo, password)
    .catch(function (error) {
      success = false;
      alert(error.code + ': ' + error.message);
    });
  return success;
}
export const getCurrentUserId = async () => {
  var user = auth.currentUser;
  if (user != null) {
    return user.uid;
  }
};
export const getCurrentUser = async () => {
  var user = auth.currentUser;
  if (user != null) {
    return user;
  }
};
const logout = async () => {
  await auth.signOut().catch(error => alert(error.code, ' ', error.message));
};

module.exports = {
  userSignUp,
  signInWithEmail,
  // getCurrentUser,
  // getCurrentUserId,
  logout,
};
