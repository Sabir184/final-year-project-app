import React, { useContext } from 'react';
import { View, SafeAreaView, TouchableOpacity, Modal, Text } from 'react-native';
import { CreateProject } from '../Project';
import { CreateTask, TaskView } from '../Task';
import styles from './bottomModalContainerStyle';
import Close from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../context';
import { AddMember } from '../../screens/AddMembers/AddMembers';
import { EditProfile } from '../../screens/EditProfile';

export function BottomModalContainer() {
  const { state, dispatch } = useContext(AuthContext);
  const { bottomModal, data } = state;

  const handleBottomModal = bottomModal => {
    dispatch({
      type: 'toggleBottomModal',
      payload: { bottomModal },
    });
  };

  return (
    <Modal animationType="slide" transparent={true}>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
          onPress={() => {
            handleBottomModal(null)
          }}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleBottomModal(null)}>
            <Close color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={ bottomModal === 'AddMembers' ?
        styles.setModalDimensions('50%', '100%')
        :
        styles.setModalDimensions('70%', '100%')
      }>
          {bottomModal === 'CreateProject' ? (
            <CreateProject />
          ) : bottomModal === 'CreateTask' ? (
            <CreateTask />
          ) : bottomModal === 'TaskView' ? (
            <TaskView />
          ) : bottomModal === 'AddMembers' ? 
          <AddMember />
          : bottomModal === 'EditProfile' ?
           <EditProfile />
           : null}
        </View>
      </View>
    </Modal>
  );
}
