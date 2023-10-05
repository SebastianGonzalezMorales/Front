// react imports
import {
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { data, timeIntervals } from '../utils/data';

// firebase
import { firebase } from '../../../firebase';

// components
import BackButton from '../../components/buttons/BackButton';
import FormButton from '../../components/buttons/FormButton';
import InputButton from '../../components/buttons/InputButton';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';
import FormStyle from '../../assets/styles/FormStyle';

// notification
import Notification, { schedulePushNotification } from '../utils/Notification';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function TrackMedication({ navigation }) {
  // references
  const userRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid);

  // states
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [type, setType] = useState('');
  const [time, setTime] = useState(new Date());
  const [memo, setMemo] = useState('');
  const [timeInterval, setTimeInterval] = useState(0);

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  //
  const handleSaveReminder = async () => {
    if (!medicationName) {
      alert('Please enter a medication name.');
      return;
    }

    try {
      // schedule push notification to schedule a reminder
      const notificationID = await schedulePushNotification(
        medicationName,
        time,
        timeInterval
      );

      const medicationData = userRef.collection('medication').doc();
      try {
        await medicationData.set({
          notificationID,
          medicationName,
          dosage,
          type,
          time: time.toString().slice(16, 21),
          memo,
          status: 'Pending',
          created: firebase.firestore.Timestamp.now(),
        });
        navigation.goBack();
      } catch (error) {
        alert(error.message);
      }
    } catch (error) {
      alert('Failed to schedule the medication reminder.');
    }
  };

  const handleTimePickerConfirm = (event, time) => {
    setTime(time);
  };

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>Reminder</Text>
      </View>

      {/* inputs */}
      <ScrollView>
        <KeyboardAwareScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={FormStyle.formContainer}>
              <View style={FormStyle.inputContainer}>
                <Text style={FormStyle.text}>Medication name</Text>
                <InputButton
                  placeholder="Enter name..."
                  autoCorrect={false}
                  onChangeText={setMedicationName}
                  value={medicationName}
                />
              </View>
              <View style={FormStyle.inputContainer}>
                <Text style={FormStyle.text}>Dosage (in mg)</Text>
                <InputButton
                  placeholder="Enter dosage..."
                  autoCorrect={false}
                  onChangeText={setDosage}
                  value={dosage}
                />
              </View>
              <View style={FormStyle.inputContainer}>
                <Text style={FormStyle.text}>Medication type</Text>
                <Dropdown
                  placeholderStyle={FormStyle.placeholderStyle}
                  iconStyle={FormStyle.iconStyle}
                  iconColor="#f2f2f2"
                  containerStyle={FormStyle.containerStyle}
                  itemTextStyle={FormStyle.itemTextStyle}
                  selectedTextStyle={FormStyle.selectedTextStyle}
                  style={FormStyle.dropdownStyle}
                  activeColor="#5da5a9"
                  placeholder="Select item"
                  data={data}
                  value={type}
                  onChange={(item) => {
                    setType(item.value);
                  }}
                  labelField="label"
                  valueField="value"
                />
              </View>
              <View style={FormStyle.inputContainer}>
                <Text style={FormStyle.text}>Memo</Text>
                <InputButton
                  placeholder="Write a memo..."
                  autoCorrect={false}
                  onChangeText={setMemo}
                  value={memo}
                />
              </View>
              <View style={FormStyle.inputContainer}>
                <Text style={FormStyle.text}>Start time</Text>
                <View style={FormStyle.startTimeContainer}>
                  <Text style={[FormStyle.text, { marginLeft: 20 }]}>
                    Set a time
                  </Text>
                  <DateTimePicker
                    value={time}
                    style={FormStyle.dateTimePicker}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimePickerConfirm}
                  />
                </View>
              </View>

              {/* <View style={FormStyle.inputContainer}>
          <Text style={FormStyle.text}>Time interval</Text>
          <Dropdown
            placeholderStyle={FormStyle.placeholderStyle}
            iconStyle={FormStyle.iconStyle}
            iconColor="#f2f2f2"
            containerStyle={FormStyle.containerStyle}
            itemTextStyle={FormStyle.itemTextStyle}
            selectedTextStyle={FormStyle.selectedTextStyle}
            style={FormStyle.dropdownStyle}
            placeholder="Select item"
            data={timeIntervals}
            value={timeInterval}
            onChange={(item) => {
              setTimeInterval(item.value);
            }}
            labelField="label"
            valueField="value"
          />
        </View> */}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>

        {/* button */}
        <View style={[FormStyle.buttonContainer, { marginTop: 20 }]}>
          <FormButton
            text="Save"
            buttonStyle={{
              backgroundColor: '#f2f2f2',
            }}
            textStyle={{ color: '#5da5a9' }}
            onPress={handleSaveReminder}
          />
        </View>
      </ScrollView>

      {/* notification component */}
      <Notification />
    </SafeAreaView>
  );
}

export default TrackMedication;
