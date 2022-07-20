import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import shortid from 'shortid';
import styles from './projectsStyle';
import {AuthContext} from '../../context';
import {
  TabScreenHeader,
  ProjectCard,
  EmptyListComponent,
} from '../../components';
import {combineData} from '../../utils/DataHelper';
import { getDocByKeyValue } from '../../Backend/utility';
import {db} from '../../Backend/firebaseConfig';

export function Projects({navigation}) {
  const tabs = ['All', 'Completed'];

  const {state, dispatch} = useContext(AuthContext);
  const {projects} = state;

  console.log("Project is", projects)

  const [data, setData] = useState({activeTab: 'All'});
  const [completedProjects, setCompletedProjects] = useState([])

  const toggleTab = tab => {
    setData(combineData(data, {activeTab: tab}));
  };

  const isActiveTab = tab => {
    const value = data?.activeTab === tab;
    return value;
  };

  const getProjects = () => {
    let {activeTab} = data;
    let projectsToRender = [];
    if (activeTab === 'All') {
      projectsToRender = projects;
    } else if(activeTab === 'Completed'){
      projectsToRender = completedProjects
    }
    else {
      projectsToRender =
        projects?.filter(
          project => project.status === activeTab?.toLowerCase(),
        ) || [];
    }

    return projectsToRender;
  };

  const RenderProjectInfo = ({item, index}) => {
    const [percentage, setPercentage] = useState(0)
    useEffect(() => {
      console.log("item is", item)
      getDocByKeyValue('tasks', 'projectId', item.id).then(
        projectTasks => {
            console.log("Project tasks", projectTasks)
            const totalNumberOfTasks = projectTasks.length
            console.log("Totla number of tasks", totalNumberOfTasks)
            var completedNumberOfTaks = 0
            projectTasks.forEach((pelement, index) => {
              let check = true
              if(pelement.todos.length > 0) {
                pelement?.todos?.forEach((element, index) => {
                  console.log("todo", element)
                  if(element.status != 'completed'){
                    check = false
                  }
                })
                if(check){
                  completedNumberOfTaks += 1
                }  
              }
            })
            const percentageOfTasksCompleted = Math.round(((completedNumberOfTaks/totalNumberOfTasks)*100))
            if(percentageOfTasksCompleted == 100) {
              completedProjects.push(item)
            }
            console.log("Percentage is", percentageOfTasksCompleted)
            setPercentage(percentageOfTasksCompleted)
        },
      );
    }, [])
    return (
      <ProjectCard
        project={item}
        index={index}
        key={shortid.generate()}
        navigation={navigation}
        percentage={percentage}
        deleteProject={async () => {
          console.log("Delete project")
          try {
            await db
            .collection('projects')
            .doc(item.id)
            .delete()
            dispatch({
              type: 'projects',
              payload: {
                projects: projects.filter((e, index) => e.id != item.id)
              },
            });
          } catch (error) {
            console.log("Some error occured", error)
          }
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => <Text style={styles.headerTitle}>Projects</Text>}
        // isSearchBtnVisible={true}
        isMoreBtnVisible={true}
      />
      <View style={styles.projectsBody}>
        <View style={styles.projectsTabs}>
          {tabs?.map(tab => (
            <TouchableOpacity
              style={[
                styles.projectTab,
                isActiveTab(tab) ? styles.activeProjectTab : null,
              ]}
              onPress={() => toggleTab(tab)}
              key={shortid.generate()}>
              <Text
                style={[
                  styles.projectTabText,
                  isActiveTab(tab)
                    ? styles.activeProjectTabText
                    : styles.inActiveProjectTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {projects?.length > 0 ? (
          <FlatList
            data={getProjects()}
            keyExtractor={(item, index) => shortid.generate()}
            renderItem={({item, index}) => (
              <RenderProjectInfo 
              item={item}
              index={index}
              />
            )}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyListComponent />
        )}
      </View>
    </SafeAreaView>
  );
}
