import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import shortid from 'shortid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './dashboardStyle';
import {AuthContext} from '../../context';
import {TabScreenHeader, TaskInfo, EmptyListComponent} from '../../components';
import {formatCurrentDate} from '../../utils/DataHelper';
import appTheme from '../../constants/colors';
import {getAllOfCollection} from '../../Backend/utility';
import {auth, db} from '../../Backend/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';
export function Dashboard() {
  const {state, dispatch} = useContext(AuthContext);
  let {tasks} = state;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'All Tasks', value: 'All Tasks'},
    {label: 'Ongoing', value: 'Ongoing'},
    {label: 'Completed', value: 'Completed'},
  ]);
  const [totalTasks, setTotalTasks] = useState(0)
  const [inProcessTasks, setInProcessTasks] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)
  const isFocused = useIsFocused()

  useEffect(() => {
    membersList();
    projectList();
  }, [isFocused]);

  useEffect(() => {
    console.log("Tasks changed------------------------------------------------------------------------------------------------------------------------------------------------------------------")
    let completed = 0;
    setTotalTasks(tasks?.length)
    tasks?.forEach((item, index) => {
      let check = true
      item?.todos?.forEach((todo, index) => {
        if(todo.status != 'completed') {
          check = false
        }
      })
      if(check){
        completed += 1
      }
    })
    setInProcessTasks(tasks?.length - completed)
    setCompletedTasks(completed)
  }, [state])

  const membersList = () => {
    getAllOfCollection('users', {
      field: 'id',
      operator: '!=',
      value: auth.currentUser.uid,
    }).then(users => {
      dispatch({
        type: 'users',
        payload: {
          users,
        },
      });
    });
  };

  const projectList = () => {
    const loggedInUser = auth.currentUser.uid;
    console.log("Logged in user id is", loggedInUser)
    getAllOfCollection('projects').then(projects => {
      let filteredData = projects.filter(
        (project, index) =>
          // project.admin === loggedInUser || project.team.includes(loggedInUser),
          project.admin === loggedInUser || project.team.find(element => element.id === loggedInUser),
      );

      if (filteredData.length > 0) {
        db.collection('tasks')
          .where(
            'projectId',
            'in',
            filteredData.map(project => project.id),
          )

          .get()
          .then(snap => {
            if (snap) {
              let tempTasks = [];
              snap.docs.forEach(doc => {
                tempTasks.push(doc.data());
              });

              dispatch({
                type: 'tasks',
                payload: {
                  tasks: tempTasks,
                },
              });
            }
          });
      }

      dispatch({
        type: 'projects',
        payload: {
          projects: filteredData,
        },
      });
    });
  };

  const getTasks = () => {
    let tasksToRender = [];
    if (!value || value === 'All Tasks') {
      tasksToRender = tasks;
    } else if (value === 'Ongoing') {
      tasksToRender = tasks.filter(task => task.progress < 100) || [];
    } else if (value === 'Completed') {
      tasksToRender = tasks.filter(task => task.progress === 100) || [];
    }

    return tasksToRender;
  };

  const handleCreateTask = () => {
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal: 'CreateTask'},
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
      <TabScreenHeader
        leftComponent={() => (
          <View style={styles.flexRow}>
            <Text style={styles.headerLeftText}>Dashboard</Text>
          </View>
        )}
        // isSearchBtnVisible={true}
        // isMoreBtnVisible={true}
      />
      <View style={styles.contentBody}>
        <View style={styles.statisticsSection}>
          <Text style={styles.contentTitle}>Today</Text>
          <View style={styles.statisticsContainer}>
            <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.PRIMARY_COLOR},
              ]}>
              <FontAwesome
                name="refresh"
                size={17}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>{totalTasks}</Text>
                <Text style={styles.statisticsTitle}>Total</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.COLOR1},
              ]}>
              <Feather
                name="clock"
                size={17}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>{inProcessTasks}</Text>
                <Text style={styles.statisticsTitle}>In Process</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.COLOR2},
              ]}>
              <MaterialCommunityIcons
                name="file-check-outline"
                size={19}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>{completedTasks}</Text>
                <Text style={styles.statisticsTitle}>Completed</Text>
              </View>
            </View>
            {/* <View
              style={[
                styles.statisticsContent,
                {backgroundColor: appTheme.COLOR3},
              ]}>
              <MaterialCommunityIcons
                name="file-remove-outline"
                size={19}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>28</Text>
                <Text style={styles.statisticsTitle}>Cancelled</Text>
              </View>
            </View> */}
          </View>
        </View>
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            <TouchableOpacity
              style={styles.tasksRow}
              onPress={() => handleCreateTask()}>
              <Text style={styles.tasksLeftText}>Add Task</Text>
              <View style={styles.plusBtnContainer}>
                <MaterialCommunityIcons name="plus" size={19} color="#fff" />
              </View>
            </TouchableOpacity>
            <DropDownPicker
              placeholder="All Tasks"
              placeholderStyle={{fontSize: 15}}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              containerStyle={{
                width: 130,
              }}
              style={{
                borderColor: 'transparent',
                backgroundColor: 'transparent',
              }}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderColor: 'transparent',
              }}
              labelStyle={{
                fontSize: 15,
              }}
            />
          </View>
          <View style={styles.tasksBody}>
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
              <View style={styles.tasksList}>
                {getTasks()?.map(task => (
                  <TaskInfo task={task} key={shortid.generate()} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
