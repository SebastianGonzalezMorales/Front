// react imports
import { SafeAreaView, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

// firebase
import { firebase } from '../../../firebase';

// components
import BackButton from '../../components/buttons/BackButton';
import SmallFormButton from '../../components/buttons/SmallFormButton';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';
import FormStyle from '../../assets/styles/FormStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function Track({ route, navigation }) {
  // references

  // fetch document id passed from previous screen
  const docId = route.params.documentId;

  // obtain document id from firebase
  const obtainId = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('medication')
    .doc(docId);
  const historyRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('medicationHistory')
    .doc();

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

  // update status (skipped or taken)
  const updateStatus = async (newStatus) => {
    try {
      // update medication status
      await obtainId.update({ status: newStatus });

      // set document's status and other details into the medication history collection
      await historyRef.set({
        loggedDate: firebase.firestore.Timestamp.now(),
        medicationName,
        medicationID: docId,
        type,
        status: newStatus,
      });

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
      <KeyboardAwareScrollView>
        <View style={FormStyle.formContainer}>
          <View style={FormStyle.inputContainer}>
            <Text style={FormStyle.text}>Medication name</Text>
            <View style={FormStyle.textBox}>
              <Text style={[FormStyle.text, { marginLeft: 20 }]}>
                {medicationName}
              </Text>
            </View>
          </View>
          <View style={FormStyle.inputContainer}>
            <Text style={FormStyle.text}>Dosage (in mg)</Text>
            <View style={FormStyle.textBox}>
              <Text style={[FormStyle.text, { marginLeft: 20 }]}>{dosage}</Text>
            </View>
          </View>
          <View style={FormStyle.inputContainer}>
            <Text style={FormStyle.text}>Reminder time</Text>
            <View style={FormStyle.textBox}>
              <Text style={[FormStyle.text, { marginLeft: 20 }]}>{time}</Text>
            </View>
          </View>
          <View style={FormStyle.inputContainer}>
            <Text style={FormStyle.text}>Memo</Text>
            <View style={FormStyle.textBox}>
              <Text style={[FormStyle.text, { marginLeft: 20 }]}>{memo}</Text>
            </View>
          </View>
          <View style={FormStyle.inputContainer}>
            <Text style={FormStyle.text}>Status</Text>
            <View style={FormStyle.textBox}>
              <Text style={[FormStyle.text, { marginLeft: 20 }]}>{status}</Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* buttons */}
      <View style={[FormStyle.buttonContainer, { flexDirection: 'row' }]}>
        <SmallFormButton
          text="Skip"
          buttonStyle={{
            backgroundColor: '#7db7ba',
          }}
          textStyle={{ color: '#f2f2f2' }}
          onPress={() => updateStatus('Skipped')}
        />
        <SmallFormButton
          text="Track"
          buttonStyle={{
            backgroundColor: '#f2f2f2',
          }}
          textStyle={{ color: '#5da5a9' }}
          onPress={() => updateStatus('Taken')}
        />
      </View>
    </SafeAreaView>
  );
}

export default Track;
