import React, { useContext } from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from 'react-native-progress-circle';
import shortid from 'shortid';
import styles from './projectCardStyle';
import appTheme from '../../../constants/colors';
import {navigateToNestedRoute} from '../../../navigators/RootNavigation';
import {getScreenParent} from '../../../utils/NavigationHelper';
import {AuthContext} from '../../../context';
import MIcons from 'react-native-vector-icons/MaterialIcons'

export function ProjectCard({project, index, navigation, percentage, deleteProject}) {
  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };

  const {state, dispatch} = useContext(AuthContext);

  const handleBottomModal = (bottomModal, project, index) => {
    console.log("PROJECTS", index)
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal, data: project, index: index}
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleNavigation('Project', {project, index})}>
      <Text style={styles.projectTitle}>{project?.title}</Text>
      <View style={styles.projectTeamAndProgress}>
        <View style={{width: '60%'}}>
          <Text style={styles.projectDescription}>{project?.description}</Text>
          <Text style={styles.projectTeamTitle}>Team</Text>
          <View style={styles.projectTeamWrapper}>
            {project?.team?.map(member => (
              <Image
                key={shortid.generate()}
                style={styles.projectMemberPhoto}
                source={{uri: member?.image}}
              />
            ))}
            <TouchableOpacity 
            style={styles.plusBtnContainer}
            onPress={() => {
              console.log("Add members section")
              handleBottomModal('AddMembers', project, index)
            }}
            >
              <MaterialCommunityIcons name="plus" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{position: 'absolute', right: 25, top: -30,}}
        onPress={() => {
          deleteProject()
        }}
        >
          <MIcons name='delete-outline' size={30} />
        </TouchableOpacity>
        <View style={{width: '25%', marginTop: 30}}>
          <ProgressCircle
            percent={percentage}
            radius={40}
            borderWidth={8}
            color="#6AC67E"
            shadowColor="#f4f4f4"
            bgColor="#fff">
            <Text style={styles.projectProgress}>{isNaN(percentage) ? 0 + '%' : percentage + '%'} </Text>
          </ProgressCircle>
        </View>
      </View>
      <View style={styles.rowJustifyBetween}>
        {/* <View style={styles.flexRow}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />

          <Text style={styles.projectBottomText}>
            {project?.createdAt.toDate().toLocaleTimeString('en-US')}
          </Text>
        </View> */}
        {/* <View style={styles.flexRow}>
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.projectBottomText}>{project?.tasks} Tasks</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
}
