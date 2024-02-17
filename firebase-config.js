import { initializeApp } from '@react-native-firebase/app';
import { getDatabase } from '@react-native-firebase/database';
import { Platform } from 'react-native';
// import { getAnalytics } from "firebase/analytics";

// let config = {};
// if(Platform.OS == 'ios') {
//     config = {
//         appId: '1:403527180790:ios:11a5c367c6e140a1be67d7',
//         messagingSenderId: '403527180790',
//         apiKey: 'AIzaSyDbs-IS9pBu2JzLYfQHrjZFYXIltU-tl98',
//         projectId: 'scott-8ac91',
//         storageBucket: 'scott-8ac91.appspot.com',
//         databaseURL: 'https://scott-8ac91-default-rtdb.firebaseio.com',
//         authDomain: 'scott-8ac91.firebaseapp.com',
//         bundleId: 'org.app.ToDo'
//     }
// } else {
//     config = {
//         apiKey: 'AIzaSyCSecHSamToZRX6ZrEzix298sdHpAlCepg',
//         authDomain: 'scott-8ac91.firebaseapp.com',
//         databaseURL: 'https://scott-8ac91-default-rtdb.firebaseio.com',
//         projectId: 'scott-8ac91',
//         storageBucket: 'scott-8ac91.appspot.com',
//         messagingSenderId: '403527180790',
//         appId: '1:403527180790:web:37dda0fd4a3f86f8be67d7',
//         measurementId: "G-DZLVV22ME3"
//     }
// }

// console.log(config);

// const firebaseConfig = config;

const firebaseConfig = {
   apiKey: 'AIzaSyCSecHSamToZRX6ZrEzix298sdHpAlCepg',
   authDomain: 'scott-8ac91.firebaseapp.com',
   databaseURL: 'https://scott-8ac91-default-rtdb.firebaseio.com',
   projectId: 'scott-8ac91',
   storageBucket: 'scott-8ac91.appspot.com',
   messagingSenderId: '403527180790',
   appId: '1:403527180790:web:37dda0fd4a3f86f8be67d7',
   measurementId: "G-DZLVV22ME3"
};


// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
