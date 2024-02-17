import React, { useEffect, useRef, useState } from 'react'
import {
  SafeAreaView,
  View,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  TouchableOpacity,
  Text,
  ScrollView
} from 'react-native'

import { TextInput, PaperProvider, Portal, Modal } from 'react-native-paper';
import { FAB } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { google, outlook } from 'calendar-link';

import { db } from '../../firebase-config.js';

import {
  ref,
  onValue,
  push,
  update
} from '@react-native-firebase/database';

import { basicStyles, commonStyles } from '../assets/styles';

const iconImg = require('../assets/images/new-task.png')
const newDate = new Date();
const timezoneOffsetMinutes = newDate.getTimezoneOffset();
const timezoneOffsetHours = Math.floor(timezoneOffsetMinutes / 60);

const NewTask = ({ navigation, route }) => {
    const auth = route.params.auth
    
    const [params, setParams] = useState(route.params)

    if(params != route.params) {
        setParams(route.params)
    }
    
    const [taskKey, setTaskKey] = useState('');
    const [taskName, setTaskName] = useState('');

    const [openType, setOpenType] = useState(false);
    const [valueType, setValueType] = useState(null);
    const taskType = [
        {label: 'Due Date', value: 0},
        {label: 'Recurring', value: 1}
    ]

    const [openPriority, setOpenPriority] = useState(false);
    const [valuePriority, setValuePriority] = useState(null);
    const taskPriority = [
        {label: 'Very Low', value: 0},
        {label: 'Low', value: 1},
        {label: 'Medium', value: 2},
        {label: 'High', value: 3},
        {label: 'Urgent', value: 4},
    ]

    const [openCategory, setOpenCategory] = useState(false);
    const [valueCategory, setValueCategory] = useState(null);
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
        setTaskCategory(list);
        });
    }, []);

    const [openGroup, setOpenGroup] = useState(false);
    const [valueGroup, setValueGroup] = useState(null);
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
            setTaskGroup(list);
        });
    }, []);
    
    const [openRecurring, setOpenRecurring] = useState(false);
    const [valueRecurring, setValueRecurring] = useState(null);
    const taskRecurring = [
        {label: 'Daily', value: 0},
        {label: 'Weekly', value: 1},
        {label: 'Bi-Weekly', value: 2},
        {label: 'Semi-monthly', value: 3},
        {label: 'Monthly', value: 4},
        {label: 'Quarterly', value: 5},
        {label: 'Semi-Annually', value: 6},
        {label: 'Annually', value: 7},
    ]

    const [dueDate, setDueDate] = useState('');

    const [date, setDate] = useState(new Date());
    const [isDisplayDate, setShowDate] = useState(false);
    const changeSelectedDate = (event, selectedDate) => {
        console.log(event);
        setShowDate(false);
        
        if(event.type == 'set') {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setDueDate(currentDate.toLocaleString('sv-SE').substring(0, 10))
        }
    };

    const dismissAllSelect = (name) => {
        setOpenType(false);
        setOpenPriority(false);
        setOpenCategory(false);
        setOpenGroup(false);
        setOpenRecurring(false);

        name == 'type' ? setOpenType(true)
        : name == 'recurring' ? setOpenRecurring(true)
        : name == 'priority' ? setOpenPriority(true)
        : name == 'category' ? setOpenCategory(true)
        : name == 'group' ? setOpenGroup(true)
        : ""
    }

    const defaultVal = () => {
        setTaskName('');
        setDueDate('');
        setValueType(null);
        setValueRecurring(null);
        setValuePriority(null);
        setValueCategory(null);
        setValueGroup(null);
    }


    useEffect(() => {
        if(params.edit == true) {
            setTaskName(params.data.name)
            setValueType(params.data.type)
            setValueRecurring(params.data.recurring)
            setDueDate(params.data.date)
            setValuePriority(params.data.priority)
            setValueCategory(params.data.category)
            setValueGroup(params.data.group)
            setTaskKey(params.data.key)
            if(params.data.date != '')
                setDate(new Date(params.data.date))
        }
    }, [params])

    const validate = () => {
        if(taskName == '') {
            Toast.show({type: 'error', position: 'top', text1: 'Task Name must be entered!', visibilityTime: 2000, autoHide: true, topOffset: 30})
        }
        else if(valueType == null && valuePriority == null && valueCategory == null && valueGroup == null) {
            Toast.show({type: 'error', position: 'top', text1: 'You must be select another one more field!', visibilityTime: 2000, autoHide: true, topOffset: 30})
        }
        else if(valueType == 1 && valueRecurring == null) {
            Toast.show({type: 'error', position: 'top', text1: 'You must be select recurring type!', visibilityTime: 2000, autoHide: true, topOffset: 30})
        }
        else if(valueType == 0 && dueDate == '' || valueType == 1 && valueRecurring != 0 && dueDate == '') {
            Toast.show({type: 'error', position: 'top', text1: 'You must be input due date!', visibilityTime: 2000, autoHide: true, topOffset: 30})
        }
        else {
            return true;
        }
    }

    const googleCalendarLink = () => {
        const recurringType = valueRecurring == 0 ? 'FREQ=DAILY' 
                            : valueRecurring == 1 ? 'FREQ=WEEKLY'
                            : valueRecurring == 2 ? 'FREQ=DAILY;INTERVAL=4'
                            : valueRecurring == 3 ? 'FREQ=WEEKLY;INTERVAL=2'
                            : valueRecurring == 4 ? 'FREQ=MONTHLY'
                            : valueRecurring == 5 ? 'FREQ=MONTHLY;INTERVAL=3'
                            : valueRecurring == 6 ? 'FREQ=MONTHLY;INTERVAL=6'
                            : valueRecurring == 7 ? 'FREQ=YEARLY'
                            : ''

        if(dueDate != '' || valueRecurring == 0) {
            let startDate = dueDate != '' ? dueDate : new Date().toLocaleString('sv-SE').substring(0, 10)
            const task = {
                title: taskName,
                description: `Priority: ${valuePriority ? taskPriority[valuePriority].label : "Undefined"},` + 
                            `Category: ${valueCategory ? taskCategory.filter(i => i.value == valueCategory)[0].label : "Undefined"}` +
                            `Group: ${valueGroup ? taskGroup.filter(i => i.value == valueGroup)[0].label : 'Undefined'}`,
                start: new Date(new Date(startDate).setHours(+7)).toISOString().slice(0, -5) + `${timezoneOffsetHours}:00`,
                duration: [3, 'hour'],
                rRule: recurringType
            };
            const googleCalendarLink = google(task);
            
            Linking.openURL(googleCalendarLink);
        }
    }

    const addTaskModal = () => {
        const valid = validate();
        if(valid) {
            Alert.alert(
              'Add Task',
              "Do you really want to add this task?",
              [
                {
                  text: 'Save',
                  onPress: () => addTask(),
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

    const addTask = () => {
        push(ref(db, '/tasks'), {
            name: taskName,
            type: valueType,
            date: valueRecurring == 0 ? new Date().toLocaleString('sv-SE').substring(0, 10) : dueDate,
            priority: valuePriority,
            category: valueCategory,
            group: valueGroup,
            recurring: valueRecurring,
            completed: false,
            user: auth
        });
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'New task added successfully!',
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 30,
        })

        googleCalendarLink();
        defaultVal();
    }


    const editTaskModal = () => {
        const valid = validate();
        if(valid) {
            Alert.alert(
              'Edit Task',
              "Do you really want to edit this task?",
              [
                {
                  text: 'Save',
                  onPress: () => editTask(),
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
    }

    const editTask = () => {
        update(ref(db, `/tasks/${taskKey}`), {
            name: taskName,
            type: valueType,
            date: valueRecurring == 0 ? new Date().toLocaleString('sv-SE').substring(0, 10) : dueDate,
            priority: valuePriority,
            category: valueCategory,
            group: valueGroup,
            recurring: valueRecurring,
        });
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'New task added successfully!',
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 30,
        })
        
        googleCalendarLink();
    }

    const changeType = (type) => {
        if(type.value == 0) {
            setDueDate('');
            setValueRecurring(null)
        }
        else {
            setDueDate('');
        }
    }

    const [visible, setVisible] = useState(false);
    const [inputVal, setInputVal] = useState('');

    const hideModal = () => {
        setVisible(false);
    }
    
    const showModal = () => {
        setInputVal('')
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
    }
    
    return (
        <PaperProvider>
            <StatusBar barStyle='light-content' backgroundColor={basicStyles.defaultColor} />
            <TouchableWithoutFeedback 
                onPress={() => {
                    dismissAllSelect()
                }}
            >
                <SafeAreaView style={commonStyles.SafeAreaView}>
                    <ScrollView style={{padding: '5%', backgroundColor: 'white'}}>
                    <View style={{marginBottom: '15%'}}>
                    <View style={[commonStyles.alignCenter, {marginTop: '5%'}]}>
                        <Image source={iconImg}/>
                    </View>
                    <View style= {commonStyles.LoginPart}>
                        <TextInput
                            mode='flat'
                            label="Task Name"
                            cursorColor={basicStyles.defaultColor}
                            activeOutlineColor={basicStyles.defaultColor}
                            activeUnderlineColor={basicStyles.defaultColor}
                            underlineColor='black'
                            style={{width: '97%', backgroundColor: 'white', marginBottom: '2%', fontSize: 18}}
                            value={taskName}
                            onChangeText={text => setTaskName(text)}
                        />
                        <DropDownPicker
                            placeholder='Select Task Type'
                            open={openType}
                            value={valueType}
                            items={taskType}
                            setOpen={setOpenType}
                            setValue={setValueType}
                            onOpen={() => dismissAllSelect('type')}
                            style={{borderWidth: 0, borderBottomWidth: 1, backgroundColor: 'white', alignSelf: 'center', marginBottom: '2%', zIndex: 0}}
                            dropDownContainerStyle={{zIndex: 99999}}
                            labelStyle={{fontSize: 18}}
                            listItemLabelStyle={{fontSize: 18}}
                            placeholderStyle={{fontSize: 18}}
                            onSelectItem={(value) => {changeType(value)}}
                        />
                        {
                            valueType == 0 ?
                            (
                                <TextInput
                                    mode='flat'
                                    label="Enter Due Date"
                                    value={dueDate}
                                    cursorColor={basicStyles.defaultColor}
                                    activeOutlineColor={basicStyles.defaultColor}
                                    activeUnderlineColor={basicStyles.defaultColor}
                                    style={{width: '97%', backgroundColor: 'white', marginBottom: '2%', fontSize: 18}}
                                    onPressOut={() => {setShowDate(true)}}
                                    keyboardAppearance={false}
                                />
                            )
                            : valueType == 1 ?
                            (
                                <DropDownPicker
                                    placeholder='Select Recurring'
                                    open={openRecurring}
                                    value={valueRecurring}
                                    items={taskRecurring}
                                    setOpen={setOpenRecurring}
                                    setValue={setValueRecurring}
                                    onOpen={() => dismissAllSelect('recurring')}
                                    style={{borderWidth: 0, borderBottomWidth: 1, backgroundColor: 'white', alignSelf: 'center', marginBottom: '1%', zIndex: 0}}
                                     zIndex={6}
                                     dropDownContainerStyle={{zIndex: 99999}}
                                    labelStyle={{fontSize: 18}}
                                    listItemLabelStyle={{fontSize: 18}}
                                    placeholderStyle={{fontSize: 18}}
                                />
                            )
                            : ""
                        }
                        {
                            valueRecurring > 0 && valueRecurring < 8 ? 
                            (
                                <TextInput
                                    mode='flat'
                                    label="Enter Due Date"
                                    value={dueDate}
                                    cursorColor={basicStyles.defaultColor}
                                    activeOutlineColor={basicStyles.defaultColor}
                                    activeUnderlineColor={basicStyles.defaultColor}
                                    style={{width: '97%', backgroundColor: 'white', marginBottom: '2%', fontSize: 18}}
                                    onPressOut={() => {setShowDate(true)}}
                                    keyboardAppearance={false}
                                />
                            )
                            : ""
                        }
                        {isDisplayDate ? (
                            <DateTimePicker
                                minimumDate={new Date()}
                                testID="datePicker"
                                value={date}
                                mode='date'
                                display='spinner'
                                onChange={changeSelectedDate}
                            />
                        ) : ""}
                        <DropDownPicker
                            placeholder='Select Priority'
                            open={openPriority}
                            value={valuePriority}
                            items={taskPriority}
                            setOpen={setOpenPriority}
                            setValue={setValuePriority}
                            onOpen={() => dismissAllSelect('priority')}
                            style={{borderWidth: 0, borderBottomWidth: 1, backgroundColor: 'white', alignSelf: 'center', marginBottom: '2%', zIndex: 0}}
                            zIndex={5}
                            dropDownContainerStyle={{zIndex: 99999}}
                            labelStyle={{fontSize: 18}}
                            listItemLabelStyle={{fontSize: 18}}
                            placeholderStyle={{fontSize: 18}}
                        />
                        <DropDownPicker
                            placeholder='Select Category'
                            open={openCategory}
                            value={valueCategory}
                            items={taskCategory}
                            setOpen={setOpenCategory}
                            setValue={setValueCategory}
                            onOpen={() => dismissAllSelect('category')}
                            style={{borderWidth: 0, borderBottomWidth: 1, backgroundColor: 'white', alignSelf: 'center', marginBottom: '2%', zIndex: 0}}
                            dropDownContainerStyle={{zIndex: 99999}}
                            zIndex={4}
                            labelStyle={{fontSize: 18}}
                            listItemLabelStyle={{fontSize: 18}}
                            placeholderStyle={{fontSize: 18}}
                        />
                        <DropDownPicker
                            placeholder='Select Task Group'
                            open={openGroup}
                            value={valueGroup}
                            items={taskGroup}
                            setOpen={setOpenGroup}
                            setValue={setValueGroup}
                            onOpen={() => dismissAllSelect('group')}
                            style={{borderWidth: 0, borderBottomWidth: 1, backgroundColor: 'white', alignSelf: 'center', marginBottom: '2%', zIndex: 0}}
                            zIndex={3}
                            labelStyle={{fontSize: 18}}
                            listItemLabelStyle={{fontSize: 18}}
                            placeholderStyle={{fontSize: 18}}
                        />
                        <TouchableOpacity
                            color={'white'}
                            onPress={() => showModal()}
                            style={{justifyContent: 'center', alignSelf: 'flex-end', marginHorizontal: '5%', marginTop: '5%'}}
                        >
                            <Text style={{color: basicStyles.defaultColor, fontSize: 18, fontWeight: 'bold', borderBottomWidth: 3, borderBottomColor: basicStyles.defaultColor}}>
                                <Icon name={'duplicate'} color={basicStyles.defaultColor} size={20}/> Add Task Group
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {
                        params.edit == false ? 
                        (
                            <FAB 
                                title="Add Task" 
                                icon={<Icon name={'add-circle'} color='white' size={25} style={{fontWeight: 'bold'}}></Icon>} 
                                style={{marginTop: '8%', alignSelf: 'center', zIndex: -1}}
                                containerStyle={{width: '90%'}}
                                titleStyle={{fontWeight: 'bold'}}
                                color={basicStyles.defaultColor}
                                onPress={() => addTaskModal()}
                            />
                        )
                        :
                        (
                            <FAB 
                                title="Save Task" 
                                icon={<Icon name={'create'} color='white' size={25} style={{fontWeight: 'bold'}}></Icon>} 
                                style={{marginTop: '4%', alignSelf: 'center', zIndex: -1}}
                                containerStyle={{width: '90%'}}
                                titleStyle={{fontWeight: 'bold'}}
                                color={basicStyles.defaultColor}
                                onPress={() => editTaskModal()}
                            />
                        )
                    }

                    </View>

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

                    <Toast refs={(myRef) => Toast.setRef(myRef)} />
                </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </PaperProvider>
    )
}


export default NewTask
