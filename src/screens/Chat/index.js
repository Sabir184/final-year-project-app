import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ToastAndroid,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import shortid from 'shortid';
import styles from './chatStyle';
import {TabScreenHeader, EmptyListComponent} from '../../components';
import {AuthContext} from '../../context';
import {auth, db, storage} from '../../Backend/firebaseConfig';
import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-picker';

export function Chat({navigation, route}) {
  const selectedMember = route.params;
  console.log('================================', selectedMember);
  const {state, dispatch} = useContext(AuthContext);
  const [image, setImage] = useState('');
  const sender = auth.currentUser.uid;
  const receiver = selectedMember.id;
  console.log('================================');
  console.log(sender, receiver);
  console.log('================================');

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    realTimeChat();
  }, []);

  const pickImageAndUpload = () => {
    launchImageLibrary(
      {
        quality: 0.5,
      },
      fileObj => {
        if (fileObj.assets) {
          console.log(JSON.stringify(fileObj));
          setUploading(true);
          const uploadTask = storage
            .ref()
            .child(`/userprofile/${Date.now()}`)
            .putFile(fileObj.assets[0].uri);
          uploadTask.on(
            'state_changed',
            snapshot => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              if (progress === 100) {
                ToastAndroid.LONG('Image uploaded');
              }
            },
            error => {
              // Handle unsuccessful uploads
              alert('error in uploading image', error);
              setUploading(false);
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                console.log('File available at', downloadURL);
                setImage(downloadURL);
                setUploading(false);
              });
            },
          );
        } else if (fileObj.didCancel) {
          console.log(fileObj.errorCode);
        }
      },
    );
  };
  const realTimeChat = async () => {
    const docId =
      sender > receiver ? receiver + '-' + sender : sender + '-' + receiver;
    const messageRef = db
      .collection('chatrooms')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'asc');

    messageRef.onSnapshot(querySnap => {
      const allMessages = querySnap.docs.map(docSnap => {
        return {
          ...docSnap.data(),
          createdAt:
            docSnap.data().createdAt !== null
              ? docSnap.data().createdAt.toDate()
              : new Date(),
        };
      });
      setMessages(allMessages);
    });
  };

  const onSend = async () => {
    if (messageText.trim().length) {
      let myMessage = {
        receiver,
        sender,
        createdAt: new Date(),
        message: messageText,
      };
      if (image) {
        myMessage['image'] = image;
      }
      const docId =
        sender > receiver ? receiver + '-' + sender : sender + '-' + receiver;
      await db
        .collection('chatrooms')
        .doc(docId)
        .collection('messages')
        .add(myMessage);
      setMessageText('');
      let tempMessages = [...messages];
      tempMessages.push(myMessage);
      setMessages(tempMessages);
    }
  };
  const handleBackButton = () => {
    navigation?.goBack();
  };

  const ChatHeader = () => {
    return (
      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => handleBackButton('Members')}
          style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={25} color="#000" />
        </TouchableOpacity>
        <Image
          style={styles.selectedMemberPhoto}
          source={{
            uri: selectedMember?.image,
          }}
        />
        <View style={styles.selectedMemberInfo}>
          <Text style={styles.selectedMemberName}>
            {selectedMember?.fullName}
          </Text>
          <Text style={styles.selectedMemberLastSeen}>
            Last seen {selectedMember?.lastSeen}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => <ChatHeader />}
        isSearchBtnVisible={false}
        isMoreBtnVisible={true}
      />
      <View style={styles.chatWrapper}>
        {messages?.length ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.messagesSection} key={shortid.generate()}>
              {messages.map(message => (
                <View
                  key={shortid.generate()}
                  style={[
                    styles.singleMessage,
                    message.sender === sender
                      ? styles.singleMessageRight
                      : styles.singleMessageLeft,
                  ]}>
                  {message?.message ? (
                    <Text
                      style={[
                        styles.singleMessageText,
                        message.sender === sender
                          ? styles.singleMessageTextRight
                          : styles.singleMessageTextLeft,
                      ]}>
                      {message.message}
                    </Text>
                  ) : null}
                  {message?.image ? (
                    <Image
                      style={styles.singleMessageImage}
                      source={{
                        uri: message.image,
                      }}
                    />
                  ) : null}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <EmptyListComponent />
        )}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.attachmentIconWrapper}
            onPress={() => pickImageAndUpload()}>
            <Entypo name="attachment" size={17} color="gray" />
          </TouchableOpacity>
          <TextInput
            placeholder="Type message"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={val => setMessageText(val)}
            value={messageText}
          />
          <TouchableOpacity
            disabled={uploading}
            style={styles.sendIconWrapper}
            onPress={() => {
              onSend();
            }}>
            <Feather name="send" size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
