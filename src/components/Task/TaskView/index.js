import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import shortid from 'shortid';
import ProgressCircle from 'react-native-progress-circle';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './taskViewStyle';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import appTheme from '../../../constants/colors';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {db} from '../../../Backend/firebaseConfig';

export function TaskView() {
  const {state, dispatch} = useContext(AuthContext);
  const {selectedTask, tasks} = state;
  const [percentage, setPercentage] = useState(0)
  const [toDosList, setToDos] = useState(selectedTask?.todos ? selectedTask.todos : [])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  console.log("Selected task!!@!@!@!@!@!@", state.projects)


  const calculatePercentageOfTheTaskCompleted = () => {
    const totalNumberOfTasks = toDosList.length
    var completedNumberOfTaks = 0
    toDosList.map((element, index) => {
      if(element.status != 'ongoing'){
        completedNumberOfTaks += 1
      }
    })
    const percentageOfTasksCompleted = Math.round(((completedNumberOfTaks/totalNumberOfTasks)*100))
    setPercentage(percentageOfTasksCompleted)
  }

  const updateTodoList = async () => {
    setLoading(true)
    try {
      console.log("Array of objects to be updated is", toDosList)
      await db
      .collection('tasks')
      .doc(selectedTask.id)
      .set(
        { todos: toDosList },
        { merge: true }
      )
      setLoading(false)
    } catch (error) {
      console.log("Some error occured", error)
      setLoading(false)
    }
  }

  const handleBottomModal = bottomModal => {
    dispatch({
      type: 'toggleBottomModal',
      payload: { bottomModal },
    });
  };

  const deleteTask = async () => {
    try {
      setLoading2(true)
      await db
      .collection('tasks')
      .doc(selectedTask.id)
      .delete()
      dispatch({
        type: 'tasks',
        payload: {
          tasks: tasks.filter((e, index) => e.id != selectedTask.id)
        },
      });
      setLoading(false)
      handleBottomModal(null)
    } catch (error) {
      console.log("Some error occured", error)
      setLoading(false)
    }
  } 

  const ToDoList = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.todocontainer}>
      <BouncyCheckbox
        size={25}
        fillColor="green"
        unfillColor="#FFFFFF"
        text={item.description}
        iconStyle={{ borderColor: "green" }}
        textStyle={{ fontFamily: "JosefinSans-Regular" }}
        onPress={(isChecked) => {
          if(toDosList[index].status == 'completed') {
            toDosList[index].status='ongoing'
          } else {
            toDosList[index].status='completed'
          }
          calculatePercentageOfTheTaskCompleted()
        }}
        textContainerStyle={{ flexWrap: 'wrap'}}
        disableBuiltInState={true}
        isChecked={item.status == 'completed' ? true : false}
      />
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    calculatePercentageOfTheTaskCompleted()
  }, [])

  return (
    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        <View style={styles.taskProgressWrapper}>
          <ProgressCircle
            percent={percentage}
            radius={30}
            borderWidth={7}
            color="#6AC67E"
            shadowColor="#f4f4f4"
            bgColor="#fff">
            <Text style={styles.taskProgress}>{percentage}%</Text>
          </ProgressCircle>
        </View>
        <Text style={styles.taskTitle}>{selectedTask?.title}</Text>
      </View>
      {/* <Text style={styles.taskTeamText}>Team</Text>
      <View style={styles.taskMembersWrapper}>
        {selectedTask?.team?.map(member => (
          <Image
            key={shortid.generate()}
            style={styles.taskMemberPhoto}
            source={{uri: member?.image}}
          />
        ))}
      </View> */}
      <View style={styles.scheduleWrapper}>
        <View style={styles.scheduleRow}>
          <AntDesign
            name="calendar"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.scheduleText}>June 13 2021</Text>
        </View>
      </View>
      <FlatList
      contentContainerStyle={{paddingBottom: 10}}
      data={toDosList}
      extraData={toDosList}
      renderItem={({item, index}) => (
        <ToDoList 
        item={item}
        index={index}
        />
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => (
        <View style={{height: 10}} />
      )}
      />
      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => {
          updateTodoList()
        }}
        disabled={loading ? true : false}
        >
        {loading 
        ?
        <ActivityIndicator color={'#fff'}/>
        :
        <Text style={styles.btnText}>Save</Text>
        }
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => {
          deleteTask()
        }}
        disabled={loading2 ? true : false}
        >
        {loading2 
        ?
        <ActivityIndicator color={'#fff'}/>
        :
        <Text style={styles.btnText}>Delete</Text>
        }
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}
