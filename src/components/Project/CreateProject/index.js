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
} from 'react-native';
import shortid from 'shortid';
import styles from './createProjectStyle';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import {db, auth} from '../../../Backend/firebaseConfig';
import {getAllOfCollection} from '../../../Backend/utility';
import {docIdGenerator} from '../../../Backend/utility';
export function CreateProject() {
  const {state, dispatch} = useContext(AuthContext);
  const {members} = state;
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    projectList();
  }, []);
  const [data, setData] = useState({
    newProject: {title: '', description: '', selectedMembers: []},
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

  const projectList = () => {
    const loggedInUser = auth.currentUser.uid;
    console.log('Logged in user id is', loggedInUser);
    getAllOfCollection('projects').then(projects => {
      console.log(projects.length);
      setProjects(projects);
    });
  };
  const createProject = () => {
    // persist data to database
    try {
      setSaving(true);

      let {newProject} = data;

      const docId = docIdGenerator('projects');
      let filteredByDesignation = [
        ...members
          .filter(member => member.designation)
          .map(a => ({...a, designation: a.designation.toLowerCase()})),
      ];
      // fetch all users : members
      // check for designation
      filteredByDesignation = filteredByDesignation.filter(member =>
        member.designation.includes(newProject.title.trim()),
      );
      console.log({filteredByDesignation});
      //  if it matches the input value of project
      // second check will if this user is not included in team array of any other projects
      console.log(projects.length);
      let teamIds = [];
      teamIds = projects
        .filter(project => {
          return project.team;
        })
        .map(project => project.team);
      console.log('first ', teamIds[0]);
      teamIds.forEach(team => {
        team = team.map(user => user.id);
        // teamIds.push([...teamIds,...team]);
        teamIds = [...teamIds, ...team];
      });

      teamIds = teamIds.filter(i => typeof i === 'string');
      projects.forEach(pro => {
        if (pro.team) {
          pro.team.forEach(i => {
            if (teamIds.includes(i.id)) {
              let toBeDeleted = teamIds.findIndex(t => t === i.id);
              teamIds.splice(toBeDeleted, 1);
              console.log(teamIds);
            }
          });
        }
      });

      teamIds = members.filter(mem => teamIds.includes(mem.id));

      db.collection('projects')
        .doc(docId)
        .set({
          id: docId,
          title: newProject.title,
          description: newProject.description,
          team: teamIds,
          progress: 0,
          createdAt: new Date(),
          tasks: 0,
          status: 'ongoing',
          admin: auth.currentUser.uid,
        })
        .then(() => {
          ToastAndroid.show('Project created ', ToastAndroid.LONG);
          setData({newProject: {title: '', description: '', members: []}});
          db.collection('projects')
            .doc(docId)
            .get()
            .then(lastCreated => {
              dispatch({
                type: 'projects',
                payload: {
                  projects: [...state.projects, lastCreated.data()],
                },
              });
            })
            .catch(e => {
              setSaving(false);
            });

          handleBottomModal();
          setSaving(false);
        });
    } catch (error) {
      setSaving(false);

      console.log('Error', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>Create Project</Text>
      <TextInput
        placeholder="Title"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('title', text)}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('description', text)}
      />
      {/* <View style={styles.teamTextWrapper}>
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
      </View> */}
      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => createProject()}>
        {saving ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.btnText}>Create</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
