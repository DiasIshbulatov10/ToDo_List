import React, { useRef, useState } from 'react'
import {
  SafeAreaView,
  Text,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native'


import { basicStyles, commonStyles } from '../assets/styles';

const Category = ({ navigation }) => {

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor={basicStyles.defaultColor} />
      <SafeAreaView style={commonStyles.SafeAreaView}>
        <ScrollView style={{paddingHorizontal: '5%', marginVertical: '5%'}}>

            {/* Privacy Policy */}
            <Text style={commonStyles.ParagraphMain}>
              Privacy Policy
            </Text>
              <Text style={commonStyles.ParagraphContent}>
                  At <Text style={[commonStyles.ParagraphContent, {color: basicStyles.defaultColor}]}>My Things To Do list</Text> app (hereinafter, “App”) we are committed to protecting your privacy. 
                  This Privacy Policy applies to our mobile app and describes how we collect, use, 
                  and share information about you when you use our App.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                What information do we collect about you?
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  We do not collect or store any information; however, third parties may collect your data or 
                  data that you share with them for example when you purchase the App from an app store, 
                  but any and all use by third parties in these circumstances is outside of our knowledge and responsibility.
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  There are no accounts associated with the purchase or use of the App. You may use the app to store 
                  your data and you may sync your data with your own other accounts, or in other manners, 
                  but we do not have access to that data, and we do not store it, or want it.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                We may share the information we collect about you as follows:
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                We do not collect any information to share with anyone. Other companies, for example, 
                app stores may retain and share information about your purchases including your purchase of this App, 
                but that is outside of our responsibility.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                What choices do you have about your information?
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                You have the following choices about the information we collect about you:
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                Since we do not collect data about you, there are no choices to be made.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                How do we protect your information?
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                Since we do not collect information about you or your purchases, we have no data to protect.
              </Text>

            {/* Terms & Conditions */}
            <Text style={commonStyles.ParagraphMain}>
              Terms & Conditions
            </Text>
              <Text style={commonStyles.ParagraphContent}>
                  By downloading and using our app, you agree to the following terms and conditions. 
                  If you do not agree to these terms and conditions, do not use our app. 
                  The App is in English only and made for persons residing in the United States of America. 
                  Any person attempting to download and use the App outside of the United States of America have no legal interest in the use of this App. 
                  We will not respond to inquiries made from persons living outside the United States of America.
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  There is no warranty or guarantee associated with App.
                  The App is available as-is with no refunds from App developer and owner.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  License
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  We grant you a limited, non-exclusive, non-transferable, revocable license to download and 
                  install a copy of our App on a single mobile device and to access it as you wish for your personal, 
                  non-commercial use. You may not copy, modify, distribute, sell, or lease any part of our App, 
                  nor may you reverse engineer or attempt to extract the source code of the App, unless laws prohibit these restrictions, 
                  or you have our written permission.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  Modification of the App
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  We reserve the right to modify, suspend, or discontinue our App or any of its features at any time, 
                  without notice or liability to you. 
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  User Accounts
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  In order to access certain features of the App, you may be required to create a user account and provide certain personal information, 
                  such as your name, email address, and a password to a third party, for example, 
                  a firebase database for syncing your to do list. You are responsible for maintaining the confidentiality of your account and password, 
                  and for all activities that occur under secondary accounts. 
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  User Content
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  Our App may allow you to enter data into fields of your To Do list. 
                  You are solely responsible for your User Content and the consequences of 
                  entering it into the App or uploading or syncing data to another third-party app. 
                  This App does not require a username or password to access. If you want your data that you enter into our App to remain private, 
                  you should use your phone’s privacy settings.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  Privacy
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  We care about the privacy of our users. By using our App, you agree to our Privacy Policy, 
                  which is incorporated into these terms by reference.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  Disclaimer of Warranties
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  Our App is provided on an “as is” and “as available” basis, without any warranties of any kind. 
                  We do not guarantee that our App will be uninterrupted, timely, secure, or error-free, that it will provide any 
                  specific results or meet your requirements, or that downloading or using our App is compatible with your phone hardware or software
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  Limitation of Liability
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  We shall not be liable for any damages or losses arising out of or in connection with these terms, 
                  including but not limited to direct, indirect, incidental, consequential, punitive, or exemplary damages. 
                  This limitation applies to all claims, whether based on warranty, contract, tort, or any other legal theory, 
                  and whether we have been informed of the possibility of such damages.
              </Text>
              <Text style={commonStyles.ParagraphTitle}>
                  Governing Law
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                  These terms and your use of our app shall be applicable laws of the United States of America and its States 
                  where State law is applicable to the use of this app.
              </Text>

            {/* About Us */}
            <Text style={commonStyles.ParagraphMain}>
              About Us
            </Text>
              <Text style={commonStyles.ParagraphContent}>
                My To Do List app was made and is maintained by <Text style={[commonStyles.ParagraphContent, {color: basicStyles.defaultColor}]}>Scott Costello</Text>.
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                The App is copyright protected with all rights reserved.
              </Text>
              <Text style={commonStyles.ParagraphContent}>
                Contact Us by email at, <Text style={[commonStyles.ParagraphContent, {color: basicStyles.defaultColor}]}>ScottsToDoApp@gmail.com</Text> with suggestions, concerns, complaints or questions. 
                We will respond as soon as possible.
              </Text>

        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default Category
