// react imports
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

// firebase
import { firebase } from '../../../firebase';

// components
import BackButton from '../../components/buttons/BackButton';
import InputButton from '../../components/buttons/InputButton';
import FormButton from '../../components/buttons/FormButton';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';
import FormStyle from '../../assets/styles/FormStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function UpdateMedication({ route, navigation }) {
  // references

  // fetch document id passed from previous screen
  const docId = route.params.selectedId;

  // obtain document id from firebase
  const obtainId = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('medication')
    .doc(docId);

  // states
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // get document data based on document id
  useEffect(() => {
    const getDocument = async () => {
      const doc = await obtainId.get();
      const medicationData = doc.data();

      setMedicationName(medicationData.medicationName);
      setDosage(medicationData.dosage);
      setTime(medicationData.time);
      setStatus(medicationData.status);
      setMemo(medicationData.memo);
      setType(medicationData.type);
    };

    getDocument();
  }, []);

  // update medication
  const update = async () => {
    try {
      await obtainId.update({
        medicationName: medicationName,
        dosage: dosage,
        type: type,
        memo: memo,
      });
      console.log('Medication has been updated');
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>Reminder</Text>
      </View>

      {/* text view */}
      <ScrollView>
        <KeyboardAwareScrollView>
          <View style={FormStyle.formContainer}>
            <View style={FormStyle.inputContainer}>
              <Text style={FormStyle.text}>Medication name</Text>
              <InputButton
                value={medicationName}
                placeholder="Enter name..."
                onChangeText={(name) => {
                  setMedicationName(name);
                }}
                autoCorrect={false}
              />

              <Text style={FormStyle.text}>Dosage (in mg)</Text>
              <InputButton
                value={dosage}
                placeholder="Enter dosage..."
                onChangeText={(dosage) => {
                  setDosage(dosage);
                }}
                autoCorrect={false}
              />
            </View>
            <View style={FormStyle.inputContainer}>
              <Text style={FormStyle.text}>Reminder time</Text>
              <View style={FormStyle.textBox}>
                <Text style={[FormStyle.text, { marginLeft: 20 }]}>{time}</Text>
              </View>
            </View>
            <View style={FormStyle.inputContainer}>
              <Text style={FormStyle.text}>Memo</Text>
              <InputButton
                value={memo}
                placeholder="Write a memo..."
                onChangeText={(memo) => {
                  setMemo(memo);
                }}
                autoCorrect={false}
              />
            </View>
            <View style={FormStyle.inputContainer}>
              <Text style={FormStyle.text}>Status</Text>
              <View style={FormStyle.textBox}>
                <Text style={[FormStyle.text, { marginLeft: 20 }]}>
                  {status}
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* buttons */}
        <View style={[FormStyle.buttonContainer, { marginTop: 20 }]}>
          <FormButton
            onPress={() => update()}
            text="Save"
            buttonStyle={{
              backgroundColor: '#f2f2f2',
            }}
            textStyle={{ color: '#5da5a9' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UpdateMedication;
