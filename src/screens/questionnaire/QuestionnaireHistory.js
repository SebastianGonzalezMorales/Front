// react imports
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

// firebase
import { firebase } from '../../../firebase';

// components
import CustomButton from '../../components/buttons/CustomButton';
import { Dropdown } from 'react-native-element-dropdown';

// get functions
import { getMonth, getMonths, getMonthName } from '../utils/getMonths';

// customisation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalStyle from '../../assets/styles/ModalStyle';

const QuestionnaireHistory = ({ navigation }) => {
  // references
  const questionnaireRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('questionnaire');

  // states
  const [results, setResults] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  const months = getMonths();
  const currentMonth = getMonth();

  // hook to fetch all documents
  useEffect(() => {
    const fetchData = async () => {
      // onSnapshot method to listen to real time updates
      questionnaireRef
        .orderBy('created', 'desc')
        .onSnapshot((querySnapshot) => {
          const month = new Date().toString().slice(4, 7); // current month
          const results = [];
          querySnapshot.forEach((doc) => {
            const { severity, created, total } = doc.data();
            const monthData = created.toDate().toString().slice(4, 7);
            const date = created.toDate().toString().slice(4, 10);
            const totalScore = total + '/27';
            if (month === monthData) {
              results.push({
                id: doc.id, // document id
                severity,
                date,
                totalScore,
              });
            }
          });
          setResults(results);
        });
    };

    fetchData(); // call the async function to fetch data
  }, []);

  // handle month selection
  const handleMonthSelected = async (item) => {
    setSelectedMonth(item.value);
    console.log('selected item:', item.value);

    const questionnaireSnapshot = await questionnaireRef
      .orderBy('created', 'desc')
      .get(); // get the data once
    const results = [];
    try {
      questionnaireSnapshot.forEach((doc) => {
        const { severity, created, total } = doc.data();

        const month = getMonthName(created.toDate().getMonth());
        const date = created.toDate().toString().slice(4, 10);
        const totalScore = total + '/27';

        if (item.value === month) {
          results.push({
            id: doc.id,
            severity,
            date,
            totalScore,
          });
        }
      });
      setResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={ModalStyle.modalContent}>
      <View style={ModalStyle.headerWrapper}>
        <Text style={ModalStyle.modalTitle}>History</Text>
        <MaterialCommunityIcons
          name="close"
          color="#666a72"
          size={30}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* dropdown */}
      <View style={{ paddingHorizontal: 30, marginVertical: 10 }}>
        <Dropdown
          placeholderStyle={{
            color: '#666a72',
            fontFamily: 'DoppioOne',
          }}
          containerStyle={{
            borderRadius: 10,
          }}
          selectedTextStyle={{
            color: '#666a72',
            fontFamily: 'DoppioOne',
            fontSize: 14,
          }}
          itemTextStyle={{ color: '#666a72', fontFamily: 'DoppioOne' }}
          placeholder={currentMonth}
          data={months.map((month) => ({ label: month, value: month }))}
          value={selectedMonth}
          onChange={(month) => handleMonthSelected(month)}
          labelField="label"
          valueField="value"
        />
      </View>

      <View style={ModalStyle.flatlistWrapper}>
        <FlatList
          data={results}
          numColumns={1}
          renderItem={({ item }) => (
            <CustomButton
              buttonStyle={{
                backgroundColor:
                  item.severity === 'None'
                    ? '#f7e7d8'
                    : item.severity === 'Mild'
                    ? '#d8f7ea'
                    : item.severity === 'Moderate'
                    ? '#d8eef7'
                    : item.severity === 'Moderately severe'
                    ? '#f7d8e3'
                    : '#f7d8e3',
              }}
              textStyle={{
                color:
                  item.severity === 'None'
                    ? '#af7b56'
                    : item.severity === 'Mild'
                    ? '#109f5c'
                    : item.severity === 'Moderate'
                    ? '#238bdf'
                    : item.severity === 'Moderately severe'
                    ? '#d85a77'
                    : '#d85a77',
              }}
              title={item.severity}
              textOne={item.date}
              textTwo={item.totalScore}
              onPress={() => {
                navigation.navigate('ResultView', {
                  documentId: item.id,
                });
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default QuestionnaireHistory;
