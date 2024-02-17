import React, { useEffect, useRef, useState } from 'react'
import {
    SafeAreaView,
    View,
    StatusBar,
    Alert,
    ScrollView,
    TouchableWithoutFeedback,
    PermissionsAndroid,
    BackHandler,
    TouchableOpacity,
    Platform,
} from 'react-native'

import {
    Text,
} from 'galio-framework';

import { ListItem } from '@rneui/themed'
import { FAB, Button, Badge } from 'react-native-elements'
import { Divider, PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import { basicStyles, commonStyles } from '../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import { db } from '../../firebase-config.js';

import {
  ref,
  onValue,
  push,
  update,
  remove
} from '@react-native-firebase/database';
import { constants, functions } from '../utils';
import { getUniqueId } from 'react-native-device-info';


const nowDateTime = new Date(new Date().toLocaleString('sv-SE').substring(0, 10)).getTime();
const osType = Platform.OS;

const Dashboard = ({ navigation, route }) => {
    useEffect(() => {
        const backAction = () => {
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
    }, []);

    DropDownPicker.setListMode("SCROLLVIEW");
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

    const [params, setParams] = useState(route.params)

    if(params != route.params) {
        setParams(route.params)
    }


    useEffect(() => {
        if(params.type == 'group') {
            setValueSort(4)
            setValueGroupSort(params.id)
            changeSortType(params.id, 4)
        }
        else if(params.type == 'category') {
            setValueSort(3)
            setValueCatSort(params.id)
            changeSortType(params.id, 3)
        }
    }, [params])


    const [openSort, setOpenSort] = useState(false);
    const [valueSort, setValueSort] = useState(0);
    const taskSort = [
        {label: constants.sortType[0], value: 0},
        {label: constants.sortType[1], value: 1},
        {label: constants.sortType[2], value: 2},
        {label: constants.sortType[3], value: 3},
        {label: constants.sortType[4], value: 4},
    ]

    const [openCatSort, setOpenCatSort] = useState(false);
    const [valueCatSort, setValueCatSort] = useState(constants.categoryAll);

    const [openGroupSort, setOpenGroupSort] = useState(false);
    const [valueGroupSort, setValueGroupSort] = useState(constants.groupAll);

    const [openCompleteSort, setOpenCompleteSort] = useState(false);
    const [valueCompleteSort, setValueCompleteSort] = useState(constants.completeType[0]);
    const taskCompleteSort = [
        {label: constants.completeType[0], value: constants.completeType[0]},
        {label: constants.completeType[1], value: constants.completeType[1]},
        {label: constants.completeType[2], value: constants.completeType[2]},
    ]

    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        changeSortType(valueSort)
    }, [allTasks])

    const [taskCategory, setTaskCategory] = useState([]);
    useEffect(() => {
        return onValue(ref(db, '/task_category'), querySnapShot => {
        let data = querySnapShot.val() || {};
        let categoryList = {...data};
        let list = [];
        Object.keys(categoryList).map(item => {
            if(auth == categoryList[item].user) {
                let info = {};
                info.value = item;
                info.label = categoryList[item].name;
                list.unshift(info);
            }
        })
        let all = {value: constants.categoryAll, label: 'All'}
        list.unshift(all);
        setTaskCategory(list);
        });
    }, [auth]);

    const [taskGroup, setTaskGroup] = useState([]);
    useEffect(() => {
        return onValue(ref(db, '/task_group'), querySnapShot => {
        let data = querySnapShot.val() || {};
        let groupList = {...data};
        let list = [];
        Object.keys(groupList).map(item => {
            if(auth == groupList[item].user) {
                let info = {};
                info.value = item;
                info.label = groupList[item].name;
                list.unshift(info);
            }
        })
        let all = {value: constants.groupAll, label: 'All'}
        list.unshift(all);
        setTaskGroup(list);
        });
    }, [auth]);

    useEffect(() => {      
        setLoading(true)  
        return onValue(ref(db, '/tasks'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let tasks = {...data};
            let list = [];
            Object.keys(tasks).map(item => {
                let info = {};
                info.name = tasks[item].name;
                info.priority = tasks[item].priority;
                info.date = tasks[item].date;
                info.category = tasks[item].category;
                info.group = tasks[item].group;
                info.completed = tasks[item].completed;
                info.type = tasks[item].type;
                info.recurring = tasks[item].recurring;
                info.user = tasks[item].user;
                info.key = item;
                list.unshift(info);
            })
            setAllTasks(list);
            setTimeout(() => {
                setLoading(false) 
            }, 1000);
        });
    }, []);

    const [taskList, setTaskList] = useState([]);

    const changeSortType = (value, sort) => {
        setLoading(true);

        if(value == 0 || value == constants.completeType[0]) {
            let list = [];
            let temp = allTasks;
            let userFilter = temp.filter(item => item.user == auth);
            let sortList = userFilter.sort((a,b) => a.name - b.name);
            sortList.map((item, index) => {
                list.push(item);
            })
            
            setTaskList(list);
            setValueCompleteSort(constants.completeType[0])
        }
        else if(value == 1) {
            let list = [];
            let temp = allTasks;
            let userFilter = temp.filter(item => item.user == auth);
            let filterList = userFilter.filter(item => item.priority !== undefined);
            let sortList = filterList.sort((a,b) => b.priority - a.priority);
            sortList.map((item, index) => {
                list.push(item);
            })
            
            setTaskList(list);
        }
        else if(value == 2) {
            let list = [];
            let temp = allTasks;
            let userFilter = temp.filter(item => item.user == auth);
            let filterList = userFilter.filter(item => item.date !== '');
            let sortList = filterList.sort((a,b) => a.date.localeCompare(b.date));
            sortList.map((item, index) => {
                list.push(item);
            })
            
            setTaskList(list);
        }
        else if(value == 3 || value == constants.categoryAll) {
            let list = [];
            let temp = allTasks;
            let userFilter = temp.filter(item => item.user == auth);
            let filterList = userFilter.filter(item => item.category !== undefined);
            let sortList = filterList.sort((a,b) => a.category.localeCompare(b.category));
            sortList.map((item, index) => {
                list.push(item);
            })
            
            setTaskList(list);
            setValueCatSort(constants.categoryAll)
        }
        else if(value == 4 || value == constants.groupAll) {
            let list = [];
            let temp = allTasks;
            let userFilter = temp.filter(item => item.user == auth);
            let filterList = userFilter.filter(item => item.group !== undefined);
            let sortList = filterList.sort((a,b) => a.group.localeCompare(b.group));
            sortList.map((item, index) => {
                list.push(item);
            })
            
            setTaskList(list);
        }
        else if(value == constants.completeType[1]) {
            let list = [];
            let temp = allTasks;
            let userFilter = temp.filter(item => item.user == auth);
            let filterList = userFilter.filter(item => item.completed == false);
            let sortList = filterList.sort((a,b) => a.name - b.name);
            sortList.map((item, index) => {
                list.push(item);
            })
            
            setTaskList(list);
        }
        else if(value == constants.completeType[2]) {
            let list = [];
            let temp = allTasks;
            let userFilter = temp.filter(item => item.user == auth);
            let filterList = userFilter.filter(item => item.completed == true);
            let sortList = filterList.sort((a,b) => a.name - b.name);
            sortList.map((item, index) => {
                list.push(item);
            })
            
            setTaskList(list);
        }
        else {
            if(sort == 3) {
                let list = [];
                let temp = allTasks;
                let userFilter = temp.filter(item => item.user == auth);
                let filterList = userFilter.filter(item => item.category == value);
                filterList.map((item, index) => {
                    list.push(item);
                })
                
                setTaskList(list);
                navigation.navigate('MyTabs', { screen: 'Dashboard', params: {type : 0, id: 'All'} })
            }
            else if(sort == 4) {
                let list = [];
                let temp = allTasks;
                let userFilter = temp.filter(item => item.user == auth);
                let filterList = userFilter.filter(item => item.group == value);
                filterList.map((item, index) => {
                    list.push(item);
                })
                
                setTaskList(list);
                navigation.navigate('MyTabs', { screen: 'Dashboard', params: {type : 0, id: 'All'} })
            }
        }

        dismissSelects()
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }

    const deleteModal = itemId => {
        Alert.alert(
          'Delete Task',
          "Do you really want to remove this task?",
          [
            {
              text: 'Delete',
              onPress: () => deleteTask(itemId),
              style: 'destructive',
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ],
        );
    };

    const deleteTask = (keyInfo) => {
        remove(ref(db, `/tasks/${keyInfo}`));
        setAllTasks([]);
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Delete this task successfully!',
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 20,
        })
    }

    const completeModal = itemId => {
        Alert.alert(
          'Complete Task',
          "Do you really want to complete this task?",
          [
            {
              text: 'Complete',
              onPress: () => completeTask(itemId),
              style: 'destructive',
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ],
        );
    };

    const completeTask = (keyInfo) => {
        update(ref(db, `/tasks/${keyInfo}`), {completed: true});
        setAllTasks([]);
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Completed this task successfully!',
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 20,
        })
    }

    const dismissSelects = () => {
        setOpenSort(false); 
        setOpenCatSort(false); 
        setOpenCompleteSort(false)
    }


    const openExcel = () => {
        Alert.alert(
            'Export Excel',
            "Do you really want to export your tasks as excel file?",
            [
              {
                text: 'Export',
                onPress: () => exportExcel(),
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

    const exportExcel = async () => {
        setLoading(true)  
        
          // Check for Permission (check if permission is already given or not)
        if(osType == 'ios') {
            functions.downloadExcel(allTasks, auth, taskCategory, taskGroup)
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        } else {
            try{
                let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE );
      
                console.log("isPermitedExternalStorage ===================")
                console.log(isPermitedExternalStorage)

                if(!isPermitedExternalStorage){
          
                    // Ask for permission
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE ,
                        {
                            title: "Storage permission needed",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel",
                            buttonPositive: "OK"
                        }
                    );

                  console.log("granted ================================");
                  console.log(PermissionsAndroid.RESULTS.GRANTED)
                  console.log(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
          
                  
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      functions.downloadExcel(allTasks, auth, taskCategory, taskGroup)
                      setTimeout(() => {
                          setLoading(false)
                      }, 1000);
                  } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN){
                        functions.downloadExcel(allTasks, auth, taskCategory, taskGroup)
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000);
                  } else {
                      setLoading(false)
                      Toast.show({
                          type: 'error',
                          position: 'top',
                          text1: 'Permission denied!',
                          visibilityTime: 2000,
                          autoHide: true,
                          topOffset: 20,
                      })
                  }
                } else{
                      functions.downloadExcel(allTasks, auth, taskCategory, taskGroup)
                      setTimeout(() => {
                          setLoading(false)
                      }, 1000);
                }
          } catch(e) {
              setLoading(false)
              Toast.show({
                  type: 'error',
                  position: 'top',
                  text1: 'Error while checking permission!',
                  visibilityTime: 2000,
                  autoHide: true,
                  topOffset: 20,
              })
          }
        }
    };

    return (
        <PaperProvider>
            <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
            <SafeAreaView style={commonStyles.SafeAreaView}>
                <TouchableWithoutFeedback onPress={() => {dismissSelects()}}>
                    <View>
                        <ScrollView nestedScrollEnabled={true} onScroll={() => setOpenSort(false)} style={{minHeight: '50%'}}>
                            {/* <View style={commonStyles.centerWapper}> */}
                            <View style={{flexDirection: 'row', marginVertical: '5%', marginLeft: '5%', marginRight: '2%', justifyContent: 'center', width: '100%'}}>
                                <View style={{flex: 1}}>
                                    <Icon name={'print'} color={basicStyles.defaultColor} size={25} onPress={() => {openExcel()}} />
                                </View>
                                <View style={{flex: 8}}>
                                    <Text style={{fontSize: 18, color: basicStyles.textColor}}>
                                        Check & Remember your tasks.
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1, width: '100%'}}>
                                <View style={{flex: 1, margin: 10}}>
                                    <DropDownPicker
                                        placeholder='Select Sort Type...'
                                        open={openSort}
                                        value={valueSort}
                                        items={taskSort}
                                        setOpen={setOpenSort}
                                        setValue={setValueSort}
                                        style={{backgroundColor: 'white', alignSelf: 'center'}}
                                        onSelectItem={(value) => {changeSortType(value.value)}}
                                        labelStyle={{fontSize: 18}}
                                        listItemLabelStyle={{fontSize: 18}}
                                    />
                                </View>
                                {
                                    valueSort == 3 ?
                                    (
                                        <View style={{flex: 1, margin: 10}}>
                                            <DropDownPicker
                                                placeholder='Select Category Type...'
                                                open={openCatSort}
                                                value={valueCatSort}
                                                items={taskCategory}
                                                setOpen={setOpenCatSort}
                                                setValue={setValueCatSort}
                                                style={{backgroundColor: 'white', alignSelf: 'center'}}
                                                onSelectItem={(value) => {changeSortType(value.value, valueSort)}}
                                                labelStyle={{fontSize: 18}}
                                                listItemLabelStyle={{fontSize: 18}}
                                            />
                                        </View>
                                    )
                                    :
                                    valueSort == 4 ?
                                    (
                                        <View style={{flex: 1, margin: 10}}>
                                            <DropDownPicker
                                                placeholder='Select Task Status...'
                                                open={openGroupSort}
                                                value={valueGroupSort}
                                                items={taskGroup}
                                                setOpen={setOpenGroupSort}
                                                setValue={setValueGroupSort}
                                                style={{backgroundColor: 'white', alignSelf: 'center'}}
                                                onSelectItem={(value) => {changeSortType(value.value, valueSort)}}
                                                labelStyle={{fontSize: 18}}
                                                listItemLabelStyle={{fontSize: 18}}
                                            />
                                        </View>
                                    )
                                    :
                                    valueSort == 0 ?
                                    (
                                        <View style={{flex: 1, margin: 10}}>
                                            <DropDownPicker
                                                placeholder='Select Task Status...'
                                                open={openCompleteSort}
                                                value={valueCompleteSort}
                                                items={taskCompleteSort}
                                                setOpen={setOpenCompleteSort}
                                                setValue={setValueCompleteSort}
                                                style={{backgroundColor: 'white', alignSelf: 'center'}}
                                                onSelectItem={(value) => {changeSortType(value.value)}}
                                                labelStyle={{fontSize: 18}}
                                                listItemLabelStyle={{fontSize: 18}}
                                            />
                                        </View>
                                    )
                                    :
                                    ""
                                }
                            </View>
                            <View style={{zIndex: -1, alignSelf: 'center', paddingHorizontal: 10, marginBottom: '30%'}}>
                                <ListItem key={-1} containerStyle={{backgroundColor: 'white'}}>
                                    <View style={{flexDirection: 'row', width: '100%'}}>
                                        <View style={{flex: 6, justifyContent: 'center', borderRightWidth: 1}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: basicStyles.defaultColor}}>Task</Text>
                                        </View>
                                        <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}} >
                                            <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: basicStyles.defaultColor}}>{taskSort[valueSort].label}</Text>
                                        </View>
                                    </View>
                                </ListItem>
                                <Divider bold={true} />
                                {
                                    taskList.map((item, index) => {
                                        return(
                                            <View key={index}>
                                                <ListItem.Swipeable 
                                                    containerStyle={
                                                        item.completed == true ? 
                                                            {backgroundColor: basicStyles.completeItemColor, padding: 10}
                                                        :
                                                        taskSort[valueSort].label == constants.sortType[2] ?
                                                            new Date(item.date).getTime() - nowDateTime < 0 ? 
                                                                {backgroundColor: 'white', padding: 10}
                                                            :
                                                            new Date(item.date).getTime() - nowDateTime < constants.oneDay ? 
                                                                item.recurring != undefined ? {backgroundColor: 'white', padding: 10} : {backgroundColor: basicStyles.oneDueColor, padding: 10}
                                                            :
                                                            new Date(item.date).getTime() - nowDateTime < constants.twoDay?
                                                                item.recurring != undefined ? {backgroundColor: 'white', padding: 10} : {backgroundColor: basicStyles.oneDueColor, padding: 10}
                                                            :
                                                            new Date(item.date).getTime() - nowDateTime < constants.threeDay?
                                                                item.recurring != undefined ? {backgroundColor: 'white', padding: 10} : {backgroundColor: basicStyles.threeDueColor, padding: 10}
                                                            :
                                                            {backgroundColor: 'white', padding: 10}
                                                        :
                                                        {backgroundColor: 'white', padding: 10}
                                                    } 
                                                    onPress={() => {}}
                                                    leftContent={
                                                        (
                                                            <Button
                                                                title="Delete"
                                                                icon={{ name: 'delete', color: 'white' }}
                                                                buttonStyle={{ minHeight: '100%', backgroundColor: basicStyles.deleteBtnColor }}
                                                                onPress={() => {deleteModal(item.key)}}
                                                            />
                                                        )
                                                    }
                                                    rightContent={
                                                        item.completed == true ? "" 
                                                        :
                                                        (
                                                            <Button
                                                                title="Complete"
                                                                icon={{ name: 'check', color: 'white' }}
                                                                buttonStyle={{ minHeight: '100%', backgroundColor: basicStyles.editBtnColor }}
                                                                onPress={() => {completeModal(item.key)}}
                                                            />
                                                        )
                                                    }
                                                    defaultSwipeStatus="left"
                                                >
                                                    <ListItem.Content>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                dismissSelects();
                                                                item.completed == false ? navigation.navigate('NewTask', {edit : true, data: item, auth: auth} ) : '';
                                                            }}
                                                        >
                                                            <View style={{flexDirection: 'row', width: '100%'}}>
                                                                <View style={{flex: 6, justifyContent: 'center', borderRightWidth: 1}}>
                                                                    <Text style={{fontSize: 18, fontWeight: 'bold', color: basicStyles.textColor}}>{item.name}</Text>
                                                                </View>
                                                                <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}} >
                                                                    {
                                                                        taskSort[valueSort].label == constants.sortType[0] ?
                                                                        (
                                                                            <Text color={basicStyles.textColor} bold={true} size={16}>
                                                                                {
                                                                                    item.completed == true ? 
                                                                                    (
                                                                                        <Icon name='checkmark-circle' color={basicStyles.editBtnColor} size={25} />
                                                                                    )
                                                                                    :
                                                                                    (
                                                                                        <Icon name='remove-circle' color={basicStyles.primaryColor} size={25} />
                                                                                    )
                                                                                }
                                                                            </Text>
                                                                        )
                                                                        : taskSort[valueSort].label == constants.sortType[1] ?
                                                                        (
                                                                            <Badge 
                                                                                badgeStyle={
                                                                                    item.priority == 2 ? {paddingHorizontal: 5, backgroundColor: basicStyles.mediumBadgeColor, width: 90, alignSelf: 'center', height: 30}
                                                                                    : {paddingHorizontal: 5, width: 90, alignSelf: 'center', height: 30}
                                                                                }
                                                                                value={
                                                                                    <Text color='white' bold={true} size={item.priority == 0 ? 13 : 14}>
                                                                                        {
                                                                                            item.priority == 4 ? 'Urgent' 
                                                                                            : item.priority == 3 ? 'High' 
                                                                                            : item.priority == 2 ? 'Medium' 
                                                                                            : item.priority == 1 ? 'Low' 
                                                                                            : item.priority == 0 ? 'Very Low' 
                                                                                            : ""
                                                                                        }
                                                                                    </Text>
                                                                                }
                                                                                status={
                                                                                    item.priority == 4 ? 'error' 
                                                                                    : item.priority == 3 ? 'warning'
                                                                                    : item.priority == 1 ? 'success' 
                                                                                    : item.priority == 0 ? 'primary' 
                                                                                    : ""
                                                                                }
                                                                            />
                                                                        )
                                                                        :
                                                                        taskSort[valueSort].label == constants.sortType[2] ?
                                                                        (
                                                                            <>
                                                                                <View style={{flexDirection: 'row'}}>
                                                                                    <Text color={basicStyles.textColor} bold={true} size={16}>
                                                                                        {item.date}
                                                                                    </Text>
                                                                                </View>
                                                                                <View style={{flexDirection: 'row'}}>
                                                                                    {
                                                                                        item.type == 1 ? 
                                                                                        (
                                                                                            <Text size={13}>({constants.recuttingType[item.recurring]})</Text>
                                                                                        )
                                                                                        :
                                                                                        ""
                                                                                    }
                                                                                </View>
                                                                            </>
                                                                        )
                                                                        :
                                                                        taskSort[valueSort].label == constants.sortType[3] ?
                                                                        (
                                                                            <Text color={basicStyles.textColor} bold={true} size={15}>
                                                                                {
                                                                                    taskCategory.filter(i => i.value == item.category).length > 0 ? taskCategory.filter(i => i.value == item.category)[0].label : ''
                                                                                }
                                                                            </Text>
                                                                            
                                                                        )
                                                                        : taskSort[valueSort].label == constants.sortType[4] ?
                                                                        (
                                                                            <Text color={basicStyles.textColor} bold={true} size={16}>
                                                                                {
                                                                                    taskGroup.filter(i => i.value == item.group).length > 0 ? taskGroup.filter(i => i.value == item.group)[0].label : ''
                                                                                }
                                                                            </Text>
                                                                        )
                                                                        :""
                                                                    }
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </ListItem.Content>
                                                </ListItem.Swipeable>
                                                <Divider bold={true} />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>

                    </View>
                </TouchableWithoutFeedback>

                <FAB 
                    title="TASK" 
                    icon={<Icon name={'add-circle'} color='white' size={25}></Icon>} 
                    style={{position: 'absolute', bottom: 20, alignSelf: 'flex-end', right: 20}} 
                    color={basicStyles.defaultColor}
                    onPress={() => navigation.navigate('NewTask', {auth : auth})}
                />

                <Spinner visible={isLoading} textContent={''} textStyle={{color : 'white' }} />
                <Toast refs={(myRef) => Toast.setRef(myRef)} />
            </SafeAreaView>
        </PaperProvider>
    )
}


export default Dashboard
