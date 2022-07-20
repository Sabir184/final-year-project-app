import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ProgressBar, MD3Colors} from 'react-native-paper';
import shortid from 'shortid';
import styles from './taskInfoStyle';
import appTheme from '../../../constants/colors';
import {AuthContext} from '../../../context';

export function TaskInfo({task}) {
  console.log("Task detals are", task)
  const {state, dispatch} = useContext(AuthContext);
  const [percentage, setPercentage] = useState()

  const handleBottomModal = () => {
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal: 'TaskView'},
    });

    dispatch({
      type: 'viewTask',
      payload: {selectedTask: task},
    });
  };

  const calculatePercentageOfTheTaskCompleted = () => {
    if(task?.todos?.length > 0) {
      const totalNumberOfTasks = task.todos.length
      var completedNumberOfTaks = 0
      task.todos.map((element, index) => {
        if(element.status != 'ongoing'){
          completedNumberOfTaks += 1
        }
      })
      const percentageOfTasksCompleted = Math.round(((completedNumberOfTaks/totalNumberOfTasks)*100))
      setPercentage(percentageOfTasksCompleted/100)
    }
  }

  useEffect(() => {
    calculatePercentageOfTheTaskCompleted()
  }, [task])

  return (
    <TouchableWithoutFeedback onPress={() => handleBottomModal()}>
      <View style={styles.container}>
        <AntDesign
          name="checksquareo"
          size={20}
          color={
            task?.progress === 100 ? appTheme.COLOR2 : appTheme.INACTIVE_COLOR
          }
          style={styles.taskProgressIndicator}
        />
        <View style={styles.taskMiddleColumn}>
          <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
            {task?.title}
          </Text>
          <ProgressBar
            progress={percentage}
            color={task?.progress === 100 ? appTheme.COLOR2 : appTheme.COLOR1}
            style={styles.taskProgressBar}
          />
        </View>
        <View style={styles.teamWrapper}>
          {task?.members?.slice(0, 2)?.map(member => (
            <Image
              key={shortid.generate()}
              style={styles.memberPhoto}
              source={{uri: member?.photo}}
            />
          ))}
        </View>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={25}
          color={appTheme.INACTIVE_COLOR}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
