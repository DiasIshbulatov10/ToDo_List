import { Alert, Platform } from 'react-native'
import XLSX from 'xlsx';
import Mailer from 'react-native-mail';
import constants from './constants';
import MailAttachment from 'react-native-mail-attachment';
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker'
/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
const hashCode = (str) => {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash;
}

const validateEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const messageBox = (title, description, okHandler = null) => {
    Alert.alert(
        title,
        description,
        [
            {text: 'Ok', onPress: () => okHandler},
            {text: 'Cancel', onPress: () => {}}
        ],
        { cancelable: true }
    )
}

const now = new Date().toLocaleString('sv-SE').substring(0, 16).replace(/[-: ]/g, '');
const fileName = 'ToDo(' + now + ').xlsx';

const priorityList = [
    'VeryLow',
    'Low',
    'Medium',
    'High',
    'Urgent'
]

const downloadExcel = (tasks, user, category, group) => {
    let userTask = tasks.filter(item => item.user == user);
    let data = [];

    console.log("================tasks to excel===========")
    userTask.map((item, i) => {
        let info = {};
        info.name = item.name;
        info.completed = item.completed
        info.dueDate = item.date
        info.recurring = constants.recuttingType[item.recurring]
        info.priority = item.priority != undefined ? priorityList[item.priority] : '';
        info.group = item.group ? group.filter(groupItem => groupItem.value == item.group).length > 0 ? group.filter(groupItem => groupItem.value == item.group)[0].label : '' : '';
        info.category = item.category ? category.filter(catItem => catItem.value == item.category).length > 0 ? category.filter(catItem => catItem.value == item.category)[0].label : '' : '';

        data.unshift(info);
    })
      
    // Convert data to XLSX format
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const xlsxData = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });
    
    // Save XLSX data to a file using react-native-fs
    const path = RNFS.DocumentDirectoryPath + "/" + fileName;

    RNFS.writeFile(path, xlsxData, 'ascii')
    .then(() => {
        
        setTimeout(() => {
	    if(Platform.OS == 'ios'){
            	RNFS.writeFile(path, xlsxData, 'ascii')
            	.then(() => {
		    if(Platform.OS == 'ios') {
	    		Alert.alert("Notification", "Your tasks list is saved in /On My iPhone/ToDo/" + fileName, 
                      	    [{text: 'Ok', onPress: () => {}},], { cancelable: false })
		    } else {
	    		Alert.alert("Notification", "Your tasks list is saved in /Document/" + fileName, 
                            [{text: 'Open', onPress: () => {sendEmail()}},], { cancelable: false })
		    }
                    
            	})
            	.catch((error) => {
              	    messageBox("Error", error)
                    console.log('Error saving file:', error);
            	});
	    } else {
		const path = RNFS.DownloadDirectoryPath + "/" + fileName;
                RNFS.writeFile(path, xlsxData, 'ascii')
                .then(() => {
                    Alert.alert("Notification", "Your tasks list is saved in /Download/" + fileName, 
                        [{text: 'Open', onPress: () => {sendEmail()}},], { cancelable: false })
                    
                        RNFS.readFile(path, 'ascii').then(res => console.log("success read!!!")).catch(err => console.log(err));
                })
                .catch((error) => {
                    messageBox("Error", error)
                    console.log('Error saving file:', error);
                });
	    }
            
        }, 2000);
        
    })
    .catch((error) => {
        messageBox("Error", error)
        console.log('Error saving file:', error);
    });
}

const sendEmail = () => {
    
    DocumentPicker.pickSingle({allowMultiSelection: false}).then((result) => {
	const iosUri = result['uri'].substring(6, result['uri'].length);
        const recipient = '';
        const subject = fileName;
        const body = 'ToDo is sending your tasks list as excel file.';
	if(Platform.OS == 'ios') {
	    // MailAttachment.sendEmailWithAttachment(result['uri'], recipient, subject, body)
	}
	else {
	    MailAttachment.sendEmailWithAttachment(result['uri'], recipient, subject, body)
	}
    })
    .catch((error) => {
        console.log('Error file pick:', error);
    })
    
    return;
    Mailer.mail({
        subject: 'Task List',
        recipients: [],
        ccRecipients: [],
        bccRecipients: [],
        body: '<b>MyToDo is sending your tasks list as excel file to your mail.</b>',
        customChooserTitle: 'This is my new title', 
        isHTML: true,
        attachments: [{
                path: path,
                type: 'csv', 
            }]
        }, (error, event) => {
            Alert.alert(
                "Error while sending the email",
                error,
                [
                    {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
                    {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
                ],
                { cancelable: true }
            )
    });
}

export default {
    hashCode,
    validateEmail,
    downloadExcel
}