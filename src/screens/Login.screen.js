import React, { useEffect, useState } from 'react';
import {View, StatusBar, Text, TouchableOpacity} from 'react-native';
import LoginScreen from 'react-native-login-screen';
import TextInput from 'react-native-text-input-interactive';
import { Checkbox } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import { db } from '../../firebase-config.js';

import {
    ref,
    onValue,
    push,
} from '@react-native-firebase/database';

import { basicStyles } from '../assets/styles';
import { functions } from '../utils';

const Login = ({ navigation, route }) => {
   
    const [logEmail, setLogEmail] = useState('');
    const [logPass, setLogPass] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [type, setType] = useState(0);
    const [remember, setRemember] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);
    const [prevRemember, setPrevRemember] = useState(false);
    const [prevAutoLogin, setPrevAutoLogin] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const [logout, setLogout] = useState(false)
    const [users, setUsers] = useState([]);

    if(route.params.logout == true && logout == false) {
        console.log("first time after logout")
        const getData = async () => {
            try {
                const store_remember = await AsyncStorage.getItem('MyToDo_remember');
                const store_autolog = await AsyncStorage.getItem('MyToDo_autolog');
                const store_email = await AsyncStorage.getItem('MyToDo_Email');
                const store_pass = await AsyncStorage.getItem('MyToDo_Pass');

                setLogEmail(store_email)
                setLogPass(store_pass)
                
                if(store_remember == 'true') {
                    if(autoLogin != prevAutoLogin) {
                        console.log("checkbox1=")
                    } else if(remember != prevRemember) {
                        console.log("checkbox2=")
                    } else {
                        setRemember(true)
                        setPrevRemember(true)
                    }
                } 

                if(store_autolog == 'true') {
                    if(autoLogin != prevAutoLogin) {
                        console.log("checkbox1=")
                    } else if(remember != prevRemember) {
                        console.log("checkbox2=")
                    } else {
                        setAutoLogin(true)
                        setPrevAutoLogin(true)
                    }
                }
                
            } catch (error) {
                console.log(error);
            }
        };
        
        getData();
        setLogout(route.params.logout);
    }
    

    const getUserListFromDB = () => {
        setLoading(true)
        return onValue(ref(db, '/users'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let userList = {...data};
            let list = [];
            Object.keys(userList).map(item => {
                let info = {};
                info.key = item;
                info.email = userList[item].email;
                info.password = userList[item].password;
                list.unshift(info);
            })
            setUsers(list);
            setLoading(false)
        });
    }
    useEffect(() => {
        console.log("----use effect[]-----")
        getUserListFromDB()
    }, []);

    useEffect(() => {
        console.log("----use effect[users]-----")
        if(users.length <= 0)
            return
    
        if(autoLogin == true) {
            if(users.length > 0) {
                loginFunc()
            }
        }

        const setData = async () => {
            try {
                const auth = users.filter(item => item.email == email)
                await AsyncStorage.setItem('MyToDo_userKey', String(auth[0].key));
                if(auth.length > 0) {
                    setLoading(false)
                    navigation.navigate('MyTabs', { screen: 'Dashboard', params: {auth : auth[0].key} })
                    setType(0)
                }
            } catch (error) {
                console.log(error);
            }
        }

        setData();
    }, [users])

    useEffect(() => {
        console.log("----use effect[logout]-----")
        const getData = async () => {
            try {
                const store_remember = await AsyncStorage.getItem('MyToDo_remember');
                const store_autolog = await AsyncStorage.getItem('MyToDo_autolog');
                const store_email = await AsyncStorage.getItem('MyToDo_Email');
                const store_pass = await AsyncStorage.getItem('MyToDo_Pass');
                
                setLogEmail(store_email)
                setLogPass(store_pass)

                if(store_remember == 'true') {             
                    setRemember(true)
                    setPrevRemember(true)
                } 
                
                if(logout == false && store_autolog == 'true') {
                    setAutoLogin(true)
                    setPrevAutoLogin(true)
                }
            } catch (error) {
                console.log(error);
            }
        };
    
        getData();
    }, [logout]);

    const rememberInfo = async(emailAddress, savePassword) => {
        
        await AsyncStorage.setItem('MyToDo_remember', String(remember));
        await AsyncStorage.setItem('MyToDo_autolog', String(autoLogin));
        if(remember == true) {
            await AsyncStorage.setItem('MyToDo_Email', String(emailAddress));
            await AsyncStorage.setItem('MyToDo_Pass', String(savePassword));
        } else {
            await AsyncStorage.setItem('MyToDo_Email', '');
            await AsyncStorage.setItem('MyToDo_Pass', '');
        }
    }

    const signUpFunc = async () => {
        if(email != '') {
            if(functions.validateEmail(email) != null) {
                if(password != '') {
                    if(password == repassword) {
                        const same = users.filter(item => item.email == email);
                        if(same.length > 0) {
                            Toast.show({
                                type: 'error',
                                position: 'top',
                                text1: 'This email is already exist!',
                                visibilityTime: 3000,
                                autoHide: true,
                                topOffset: 30,
                            })
                        } else {
                            setLoading(true)
                            await push(ref(db, '/users'), {
                                email: email,
                                password: functions.hashCode(password)
                            });
                            
                            rememberInfo(email, password)

                            setLogEmail(email)
                            setLogPass(password)
                            getUserListFromDB()
                            setUsers([]);
                            setEmail('');
                            setPassword('');
                            setRepassword('');
                        }
                    } else {
                        Toast.show({
                            type: 'error',
                            position: 'top',
                            text1: 'The password and re-password do not match!',
                            visibilityTime: 3000,
                            autoHide: true,
                            topOffset: 30,
                        })
                    }
                }
                else {
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: "Please enter password!",
                        visibilityTime: 3000,
                        autoHide: true,
                        topOffset: 30,
                    })
                }
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: "That's invailed email address.",
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 30,
                })
            }
        } else {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: "Please enter Email!",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
            })
        }
    }

    const loginFunc = async () => {
        if(logEmail != '') {
            if(functions.validateEmail(logEmail) != null) {
                if(logPass != '') {
                    const same = users.filter(item => item.email == logEmail);

                    if(same.length > 0) {
                        if(same[0].password == functions.hashCode(logPass)) {
                            rememberInfo(logEmail, logPass)
                            const auth = users.filter(item => item.email == logEmail)
                            await AsyncStorage.setItem('MyToDo_userKey', String(auth[0].key));
                            
                            console.log("logined successfully")                            
                            navigation.navigate('MyTabs', { screen: 'Dashboard', params: {auth : auth[0].key} })
                            setLogout(false)
                            setLogEmail('')
                            setLogPass('')

                        } else {
                            Toast.show({
                                type: 'error',
                                position: 'top',
                                text1: 'This password incorrect!',
                                visibilityTime: 3000,
                                autoHide: true,
                                topOffset: 30,
                            })
                        }
                    } else {
                        Toast.show({
                            type: 'error',
                            position: 'top',
                            text1: 'This email does not exist!',
                            visibilityTime: 3000,
                            autoHide: true,
                            topOffset: 30,
                        })
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: "Please enter password!",
                        visibilityTime: 3000,
                        autoHide: true,
                        topOffset: 30,
                    })
                }
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: "That email address doesn't look right!",
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 30,
                })
            }
        } else {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: "Please enter Email!",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
            })
        }
    }


    const renderSignupScreen = () => (
        <LoginScreen
            key={'signup'}
            logoImageSource={require('../assets/images/logo.png')}
            onLoginPress={() => {signUpFunc()}}
            onSignupPress={() => {setType(0); setEmail(''); setPassword(''); setRepassword('')}}
            onEmailChange={setEmail}
            loginButtonText={'Create an account'}
            disableEmailValidation
            textInputChildren={
                <>
                    <View style={{marginTop: 16}}>
                        <TextInput
                            placeholder="Re-Password"
                            secureTextEntry
                            onChangeText={setRepassword}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {setRemember(!remember)}}
                        style={{marginHorizontal: '7%', alignSelf: 'flex-start'}}
                    >
                        <View style={{marginTop: 16, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                            <Checkbox
                                key={'check-1'}
                                status={remember ? 'checked' : 'unchecked'}
                                color={'white'}
                                uncheckedColor='white'
                            />
                            <Text style={{fontSize: 16, color: 'white'}}>Remember Email & Password</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {setAutoLogin(!autoLogin)}}
                        style={{marginHorizontal: '7%', alignSelf: 'flex-start'}}
                    >
                        <View style={{marginTop: 16, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                            <Checkbox
                                key={'check-2'}
                                status={autoLogin ? 'checked' : 'unchecked'}
                                color={'white'}
                                uncheckedColor='white'
                            />
                            <Text style={{fontSize: 16, color: 'white'}}>Auto Login</Text>
                        </View>
                    </TouchableOpacity>
                </>
            }
            onPasswordChange={setPassword}
            disableSocialButtons
            disableEmailTooltip
            style={{justifyContent: 'center', backgroundColor: basicStyles.defaultColor}}
            signupText='Go to Login'
            signupTextStyle={{color: 'white', fontSize: 16}}
            signupStyle={{width: '100%'}}
            emailTextInputProps={{
                value: email
            }}
            passwordTextInputProps={{
                value: password
            }}
        />
    );

    const renderLoginScreen = () => (
        <LoginScreen
            key={'login'}
            logoImageSource={require('../assets/images/logo.png')}
            onLoginPress={() => {loginFunc()}}
            onSignupPress={() => {setType(1);}}
            onEmailChange={setLogEmail}
            onPasswordChange={setLogPass}
            disableEmailValidation
            disableEmailTooltip
            disableSocialButtons
            textInputChildren={
                <>
                    <TouchableOpacity
                        onPress={() => {setRemember(!remember)}}
                        style={{marginHorizontal: '7%', alignSelf: 'flex-start'}}
                    >
                        <View style={{marginTop: 16, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                            <Checkbox
                                key={'check-3'}
                                status={remember ? 'checked' : 'unchecked'}
                                color={'white'}
                                uncheckedColor='white'
                            />
                            <Text style={{fontSize: 15, color: 'white'}}>Remember Email & Password</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {setAutoLogin(!autoLogin)}}
                        style={{marginHorizontal: '7%', alignSelf: 'flex-start'}}
                    >
                        <View style={{marginTop: 16, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                            <Checkbox
                                key={'check-4'}
                                status={autoLogin ? 'checked' : 'unchecked'}
                                color={'white'}
                                uncheckedColor='white'
                            />
                            <Text style={{fontSize: 15, color: 'white'}}>Auto Login</Text>
                        </View>
                    </TouchableOpacity>
                </>
            }
            style={{justifyContent: 'center', backgroundColor: basicStyles.defaultColor}}
            signupTextStyle={{color: 'white', fontSize: 16}}
            signupStyle={{width: '100%'}}
            emailTextInputProps={{
                value: logEmail
            }}
            passwordTextInputProps={{
                value: logPass
            }}
        />
    );

    return (
        <View style={{flex: 1}}>
        <StatusBar barStyle={'black'} backgroundColor={'white'} />
            {
                type == 0 ? 
                    (renderLoginScreen())
                :
                    (renderSignupScreen())
            }
            <Spinner visible={isLoading} textContent={''} textStyle={{color : 'white' }} />
            {/* {isLoading && ( <ActivityIndicator size="large" style={{position: 'absolute', margin: 'auto', height: 80,}}/> )} */}
            <Toast refs={(myRef) => Toast.setRef(myRef)} />
        </View>
    );
};

export default Login;