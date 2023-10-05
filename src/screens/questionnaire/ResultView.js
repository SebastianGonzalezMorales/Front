// react imports
import { SafeAreaView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

// firebase
import { firebase } from '../../../firebase';

// components
import FormButton from '../../components/buttons/FormButton';

// customisation
import FormStyle from '../../assets/styles/FormStyle';
import GlobalStyle from '../../assets/styles/GlobalStyle';

const ResultView = ({ route, navigation }) => {
  // fetch document id passed from previous screen
  const docId = route.params.documentId;

  // obtain document id from firebase
  const obtainId = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('questionnaire')
    .doc(docId);

  // states
  const [total, setTotal] = useState('');
  const [severity, setSeverity] = useState('');
  const [date, setDate] = useState('');

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // get document data based on document id
  useEffect(() => {
    const getDocument = async () => {
      const doc = await obtainId.get();
      const resultData = doc.data();
      setTotal(resultData.total);
      setSeverity(resultData.severity);
      setDate(resultData.date);
    };

    getDocument();
  }, []);

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      {/* table */}
      <View style={FormStyle.resultContainer}>
        <Text style={FormStyle.resultTextOne}>Your result</Text>
        <Text style={FormStyle.resultTextTwo}>{total} / 27</Text>
        <Text style={FormStyle.resultTextThree}>{severity}</Text>
      </View>

      <View style={FormStyle.tableContainer}>
        <View style={FormStyle.tableHeader}>
          <Text style={FormStyle.tableHeaderTitle}>Date taken</Text>
        </View>
        <View style={[FormStyle.tableRowOdd, FormStyle.tableRowEnd]}>
          <Text style={FormStyle.tableText}>Date</Text>
          <Text style={FormStyle.tableText}>{date}</Text>
        </View>

        <View style={FormStyle.tableSubContainer}>
          <View style={FormStyle.tableHeader}>
            <Text style={FormStyle.tableHeaderTitle}>Depression severity</Text>
          </View>
          <View style={FormStyle.tableRowOdd}>
            <Text style={FormStyle.tableText}>None</Text>
            <Text style={FormStyle.tableText}>0 - 4</Text>
          </View>
          <View style={FormStyle.tableRowEven}>
            <Text style={FormStyle.tableText}>Mild</Text>
            <Text style={FormStyle.tableText}>5 - 9</Text>
          </View>
          <View style={FormStyle.tableRowOdd}>
            <Text style={FormStyle.tableText}>Moderate</Text>
            <Text style={FormStyle.tableText}>10 - 14</Text>
          </View>
          <View style={FormStyle.tableRowEven}>
            <Text style={FormStyle.tableText}>Moderately severe</Text>
            <Text style={FormStyle.tableText}>15 - 19</Text>
          </View>
          <View style={[FormStyle.tableRowOdd, FormStyle.tableRowEnd]}>
            <Text style={FormStyle.tableText}>Severe</Text>
            <Text style={FormStyle.tableText}>20 - 27</Text>
          </View>
        </View>
      </View>

      {/* button */}
      <View style={[FormStyle.buttonContainer, FormStyle.buttonPosition]}>
        <FormButton
          onPress={() => navigation.navigate('Questionnaire')}
          text="Return home"
          buttonStyle={{
            backgroundColor: '#f2f2f2',
          }}
          textStyle={{ color: '#5da5a9' }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResultView;
