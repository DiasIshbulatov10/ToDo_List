import React, { useEffect, useRef, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native'


import Icon from 'react-native-vector-icons/Ionicons'
import { basicStyles, commonStyles } from '../assets/styles';
import { TextInput, Portal, PaperProvider, Modal } from 'react-native-paper';
import { FAB } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import { getUniqueId } from 'react-native-device-info';

import { db } from '../../firebase-config.js';

import {
  ref,
  onValue,
  push,
  update,
  remove,
  get
} from '@react-native-firebase/database';

const TaskGroup = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(false)

  const [auth, setAuth] = useState('')

  useEffect(() => {
    const getData = () => {
        try {
          getUniqueId()
          .then((uniqueId) => {
              setAuth(uniqueId);
          })
          .catch(err => {
              console.log(err);
          })
        } catch (error) {
            console.log(error);
        }
    };

    getData();
  }, []);

  const [group, setGroup] = useState([]);

  useEffect(() => {
    return onValue(ref(db, '/task_group'), querySnapShot => {
      let data = querySnapShot.val() || {};
      let groups = {...data};
      let list = [];
      if(auth != '') {
        Object.keys(groups).map(item => {
          if(auth == groups[item].user) {
            let info = {};
            info.name = groups[item].name;
            info.key = item;
            list.unshift(info);
          }
        })
      }
      setGroup(list);
    });
  }, [auth]);

  const [allTasks, setAllTasks] = useState([]);
  useEffect(() => {   
    setLoading(true)
    return onValue(ref(db, '/tasks'), querySnapShot => {
        let data = querySnapShot.val() || {};
        let tasks = {...data};
        let list = [];
        Object.keys(tasks).map(item => {
            let info = {};
            info.category = tasks[item].category;
            info.group = tasks[item].group;
            info.key = item;
            list.unshift(info);
        })
        setAllTasks(list);
        setTimeout(() => {
          setLoading(false) 
        }, 1000);
    });
  }, []);
  
  const taskGroupKeys = Object.keys(group);

  const [visible, setVisible] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [keyInfo, setKeyInfo] = useState('');
  
  const hideModal = () => {
    setKeyInfo('');
    setVisible(false);
  }

  const showModal = (name, key) => {
    setKeyInfo(key ? key : '')
    setInputVal(name ? name : '')
    setVisible(true)
  }

  const addTaskGroup = () => {
    if(inputVal == '') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'You must enter task group name!',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 20,
      })
      setVisible(false)
    }
    else {
      if(keyInfo == '') {
  
        push(ref(db, '/task_group'), {
          user: auth,
          name: inputVal,
        });
        setInputVal('');
        setVisible(false);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'New task group added successfully!',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 20,
        })
      }
      else {
        update(ref(db, `/task_group/${keyInfo}`), {name: inputVal});
        setInputVal('');
        setKeyInfo('');
        setVisible(false);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'This task group updated successfully!',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 20,
        })
      }
    }
  }

  const deleteModal = itemId => {
    const taskCount = allTasks.filter(i => i.group == itemId).length
    if(taskCount > 0) {
      Alert.alert(
        'Delete This Group and Tasks',
        "Some tasks still exist in this group. If you press 'DELETE ALL TASKS' button, you will be lost all tasks of this task group.",
        [
          {
            text: 'Delete All Tasks',
            onPress: () => deleteAllTasks(itemId),
            style: 'destructive',
          },
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ],
      );
    }
    else {
      Alert.alert(
        'Delete Group',
        "Do you really want to remove this group?",
        [
          {
            text: 'Delete',
            onPress: () => deleteTaskGroup(itemId),
            style: 'destructive',
          },
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ],
      );
    }
  };

  const deleteTaskGroup = (keyInfo) => {
    remove(ref(db, `/task_group/${keyInfo}`));
    setKeyInfo('');
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Delete this task group successfully!',
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 20,
    })
  }

  const deleteAllTasks = async (keyInfo) => {
    const documentRef = ref(db, '/tasks');
    const snapshot = await get(documentRef);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData['group'] === keyInfo) {
          const documentToRemoveRef = ref(db, `tasks/${childSnapshot.key}`);
          remove(documentToRemoveRef);
        }
      });
    }

    Alert.alert(
      'Delete Group',
      "Do you really want to remove this group?",
      [
        {
          text: 'Delete',
          onPress: () => deleteTaskGroup(keyInfo),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
    );
  }


  return (
    <PaperProvider>
      <StatusBar barStyle='light-content' backgroundColor={basicStyles.defaultColor} />
      <SafeAreaView style={commonStyles.SafeAreaView}>
        
        <ScrollView>
          <View style={{paddingBottom: '20%'}}>
          {
            group.map((item, index) => {
              return(
                  <TouchableOpacity
                      key={index}
                      onPress={() => navigation.navigate('MyTabs', { screen: 'Dashboard', params: {type : 'group', id: item.key} })}
                  >
                      <View style={{width: '90%', backgroundColor: 'white', alignSelf: 'center', padding: 10, borderRadius: 10, marginTop: 20}}>
                          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                              <View style={{flex: 8}} >
                                  <Text style={{color: basicStyles.textColor, fontWeight: 'bold', fontSize: 20}}>
                                      {item.name}
                                  </Text>
                              </View>
                              <View style={{flex: 1}}>
                                  <TouchableOpacity
                                      onPress={() => showModal(item.name, item.key)}
                                  >
                                    <Icon
                                        name={'create'}
                                        color={basicStyles.editBtnColor}
                                        size={30}
                                        style={{alignSelf: 'flex-end', marginRight: 10}}
                                    />
                                  </TouchableOpacity>
                              </View>
                              <View style={{flex: 1}}>
                                  <TouchableOpacity
                                      onPress={() => deleteModal(item.key)}
                                  >
                                    <Icon
                                        name={'trash'}
                                        color={basicStyles.deleteBtnColor}
                                        size={30}
                                        style={{alignSelf: 'flex-end'}}
                                    />
                                  </TouchableOpacity>
                              </View>
                          </View>
                      </View>
                  </TouchableOpacity>
              )
            })
          }
          </View>
        </ScrollView>

        <FAB 
          title="Group" 
          icon={<Icon name={'add-circle'} color='white' size={25}></Icon>} 
          style={{position: 'absolute', bottom: 20, alignSelf: 'flex-end', right: 20}} 
          color={basicStyles.defaultColor}
          onPress={() => showModal()}
        />

        <Portal>
            <Modal visible={visible} dismissable={false} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20}}>
                <Text style={{fontSize: basicStyles.modalTitleSize, color: basicStyles.textColor}}>
                    {
                        inputVal == "" ? 'ADD GROUP' : 'EDIT GROUP'
                    }
                </Text>
                <TextInput
                    mode='flat'
                    label="Name"
                    value={inputVal}
                    cursorColor={basicStyles.defaultColor}
                    activeOutlineColor={basicStyles.defaultColor}
                    activeUnderlineColor={basicStyles.defaultColor}
                    style={{width: '95%', backgroundColor: 'white', alignSelf: 'center', marginTop: 10}}
                    onChangeText={text => setInputVal(text)}
                />
                <View style={{flexDirection: 'row', alignSelf: 'flex-end', margin: 20, marginBottom: 10}}>
                    <TouchableOpacity
                        color={'white'}
                        onPress={() => addTaskGroup()}
                        style={{justifyContent: 'center', marginRight: 30}}
                    >
                        <Text style={{color: basicStyles.defaultColor, fontSize: 16, fontWeight: 'bold'}}>SAVE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        color={'white'}
                        onPress={() => hideModal()}
                        style={{justifyContent: 'center'}}
                    >
                        <Text style={{color: basicStyles.defaultColor, fontSize: 16, fontWeight: 'bold'}}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </Portal>

        <Spinner visible={isLoading} textContent={''} textStyle={{color : 'white' }} />
        <Toast refs={(myRef) => Toast.setRef(myRef)} />
      </SafeAreaView>
    </PaperProvider>
  )
}

export default TaskGroup
