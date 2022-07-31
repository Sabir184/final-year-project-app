import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ToastAndroid,
  FlatList
} from 'react-native';
import shortid from 'shortid';
import styles from './createTaskStyle';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import DropDownPicker from 'react-native-dropdown-picker';
import {db} from '../../../Backend/firebaseConfig';
import {docIdGenerator} from '../../../Backend/utility';
import {getCurrentUser} from '../../../Backend/Auth';
import IIcons from 'react-native-vector-icons/Ionicons'
import AIcons from 'react-native-vector-icons/AntDesign'
export function CreateTask() {
  const {state, dispatch} = useContext(AuthContext);
  const {members} = state;
  console.log("Members are =====", members)
  const [data, setData] = useState({
    newTask: {title: '', description: '', selectedMembers: []},
  });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(
   
    state.projects.map(project => ({
      label: project.title,
      value: project.id,
    })),
  );

  const [toDo, setToDo] = useState([])
  const [todotext, setTodoText] = useState('')

  const ref = useRef()


  const ToDosList = ({item, index}) => {
    return (
      <View style={styles.todoscontainer}>
        <Text>{item.description}</Text>
        <TouchableOpacity style={{position: 'absolute', right: 5}}
        onPress={() => {
          setToDo(toDo.filter((citem) => citem.id !== item.id))
        }}
        >        
          <AIcons name='delete' size={25} />
        </TouchableOpacity>
      </View>
    )
  }

  const handleBottomModal = bottomModal => {
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal: null},
    });
  };

  const handleSetValue = (field, value) => {
    let {newTask} = data;
    if (field === 'selectedMembers') {
      let {selectedMembers} = newTask;
      const foundIndex = selectedMembers?.findIndex(a => a?.id === value?.id);
      if (foundIndex === -1) {
        selectedMembers.push(value);
      } else {
        selectedMembers = selectedMembers.filter(a => a?.id !== value?.id);
      }
      newTask['selectedMembers'] = selectedMembers;
    } else {
      newTask[field] = value;
    }

    setData(
      combineData(data, {
        newTask,
      }),
    );
  };

  const addTaskToProject = () => {
    // persist data to database

    // id: 1,
    // projectId: 1,
    // title: 'Dashboard Design',
    setSaving(true);
    try {
      let {newTask} = data;
      newTask['todos'] = toDo

      const docId = docIdGenerator('tasks');

      db.collection('tasks')
        .doc(docId)
        .set({
          id: docId,
          projectId: value,
          title: newTask.title,

          team: newTask.selectedMembers,
          todos: newTask.todos,
          progress: 35,
          createdAt: new Date(),

          status: 'ongoing',
        })
        .then(() => {
          setSaving(false);
          ToastAndroid.show('task created ', ToastAndroid.LONG);
          dispatch({
            type: 'tasks',
            payload: {
              tasks: [
                ...state.tasks,
                {
                  id: docId,
                  projectId: value,
                  title: newTask.title,

                  team: newTask.selectedMembers,
                  todos: newTask.todos,
                  progress: 35,
                  createdAt: new Date(),

                  status: 'ongoing',
                },
              ],
            },
          });
          handleBottomModal();
        });
    } catch (error) {
      setSaving(false);

      console.log('Error', error);
    }
  };
  const isSelectedMember = member => {
    let value;
    let {selectedMembers} = data?.newTask;
    const foundIndex = selectedMembers?.findIndex(
      a => a?.id?.toLowerCase() == member?.id?.toLowerCase(),
    );
    if (foundIndex > -1) {
      value = true;
    }
    return value;
  };

  return (
    <ScrollView 
    nestedScrollEnabled={true}
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
    >
      <Text style={styles.boldText}>Create Task</Text>
      <TextInput
        placeholder="Title"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('title', text)}
      />

      {/* projects to add task */}

      <DropDownPicker
        placeholder="Select project"
        placeholderStyle={{fontSize: 15}}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        zIndex={9999}
        style={{
          borderColor: "#a6a6a6",
          width: '90%',
          alignSelf: 'center'
        }}
        dropDownContainerStyle={{
          backgroundColor: "#fff",
          height: 190,
          zIndex: 1,
          width: '90%',
          alignSelf: 'center',
          borderColor: "#a6a6a6",
        }}
        labelStyle={{
          fontSize: 15,
        }}
        listMode={'SCROLLVIEW'}
      />

      <View style={styles.todoInput}>
      <TextInput
        ref={ref}
        placeholder="Todos"
        placeholderTextColor="gray"
        onChangeText={text => {
          // handleSetValue('title', text)
          setTodoText(text)
        }}
      />
      <TouchableOpacity 
      style={{position: 'absolute', right: 3, top: 2}}
          onPress={() => {
            const randomid = Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1)
            const object = {
              id: randomid,
              description: todotext,
              status: 'ongoing'
            }
            setToDo([...toDo, object])
            setTodoText('')
            ref.current.clear()
          }}
      >
      <IIcons name='add-circle-outline' size={30} />
      </TouchableOpacity>
      </View>

      {toDo.length > 0 ? <View style={styles.flatListContainer}>
        <FlatList
        data={toDo}
        extraData={toDo}
        renderItem={({item, index}) => (
          <ToDosList
          item={item}
          index={index}
          />
        )}
        keyExtractor={(items) => items.id}
        ItemSeparatorComponent={() => (
          <View style={{height: 10}} />
        )}
        nestedScrollEnabled={true}
        />
      </View> : null}

      {/* end */}
      <View style={styles.teamTextWrapper}>
        <Text style={styles.teamText}>Select Members</Text>
      </View>
      <View style={styles.teamSection}>
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
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
      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => addTaskToProject()}>
        <Text style={styles.btnText}>Send</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
