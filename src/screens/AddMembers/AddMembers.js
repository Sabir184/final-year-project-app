import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet
} from 'react-native';
import shortid from 'shortid';
import {combineData} from '../../utils/DataHelper';
import {AuthContext} from '../../context';
import appTheme from '../../constants/colors';
import {db, auth} from '../../Backend/firebaseConfig';

import {docIdGenerator} from '../../../Backend/utility';
export function AddMember() {
  const {state, dispatch} = useContext(AuthContext);
  console.log("STATE ======>>>>>>>>>>>>>>", state.projects)
  const {members} = state;
  const [data, setData] = useState({
    newProject: {title: '', description: '', selectedMembers:  state?.data.team ? state?.data.team : []},
  });
  const [saving, setSaving] = useState(false);
  const handleBottomModal = bottomModal => {
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal: null},
    });
  };

  const handleSetValue = (field, value) => {
    let {newProject} = data;
    if (field === 'selectedMembers') {
      let {selectedMembers} = newProject;
      const foundIndex = selectedMembers?.findIndex(a => a?.id === value?.id);
      console.log({foundIndex});
      if (foundIndex === -1) {
        selectedMembers.push(value);
      } else {
        selectedMembers = selectedMembers.filter(a => a?.id !== value?.id);
      }
      newProject['selectedMembers'] = selectedMembers;
    } else {
      newProject[field] = value;
    }

    setData(
      combineData(data, {
        newProject,
      }),
    );

    //
  };

  const isSelectedMember = member => {
    let value;
    let {selectedMembers} = data?.newProject;
    const foundIndex = selectedMembers?.findIndex(
      a => a?.id?.toLowerCase() == member?.id?.toLowerCase(),
    );
    if (foundIndex > -1) {
      value = true;
    }
    return value;
  };

  const updateMembers = async () => {
    setSaving(true);
    try {
      await db
      .collection('projects')
      .doc(state.data.id)
      .set(
        { team: data.newProject.selectedMembers},
        { merge: true }
      )
      const updatedData = state.projects
      updatedData[state.index].team = data.newProject.selectedMembers
      console.log("UPDATED DATA IS", updatedData[state.index])
    //   state.projects[state.index].team = data.newProject.selectedMembers
      dispatch({
        type: 'projects',
        payload: {
          projects: [...updatedData],
        },
    })
      setSaving(false);
    } catch (error) {
      console.log("Some error occured", error)
      setSaving(false);
    }
  }



  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>Add Members</Text>
      <View style={styles.teamTextWrapper}>
        <Text style={styles.teamText}>Select Members</Text>
      </View>
      <View style={styles.teamSection}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.teamWrapper}>
            {members?.map(member => (
              <TouchableOpacity
                key={shortid.generate()}
                style={[
                  styles.memberWrapper,
                  isSelectedMember(member) ? styles.activeTeamWrapper : null,
                ]}
                onPress={() => handleSetValue('selectedMembers', member)}>
                <Image
                  style={styles.memberPhoto}
                  source={{uri: member?.image}}
                />
                <Text
                  style={[
                    styles.memberName,
                    isSelectedMember(member) ? styles.activeMemberName : null,
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {member?.fullName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => {
            console.log("Update member list")
            updateMembers()
        }}>
        {saving ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.btnText}>Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40,
  },
  textInput: {
    height: 40,
    width: '90%',
    borderRadius: 5,
    borderColor: appTheme.INACTIVE_COLOR,
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  teamTextWrapper: {width: '90%', marginBottom: 10},
  teamText: {
    fontSize: 16,
    color: 'gray',
    paddingLeft: 7,
  },
  btnWrapper: {
    marginTop: 'auto',
    height: 45,
    backgroundColor: appTheme.PRIMARY_COLOR,
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  teamSection: {height: 150, width: '90%'},
  teamWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeTeamWrapper: {
    backgroundColor: appTheme.INACTIVE_COLOR,
  },
  memberWrapper: {
    width: '23%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 2.5
  },
  memberPhoto: {height: 40, width: 40, borderRadius: 50},
  memberName: {width: 60, textAlign: 'center', color: '#000', fontSize: 13},
  activeMemberName: {color: '#fff'},
});

export default styles;
