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

const MedicationHistory = ({ navigation }) => {
  // references
  const historyRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('medicationHistory');

  // states
  const [medicationHistory, setMedicationHistory] = useState([]);
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
      historyRef.orderBy('loggedDate', 'desc').onSnapshot((querySnapshot) => {
        const month = new Date().toString().slice(4, 7);
        const medicationHistory = [];
        querySnapshot.forEach((doc) => {
          const { medicationName, loggedDate, status, type } = doc.data();
          const monthData = loggedDate.toDate().toString().slice(4, 7);
          const date = loggedDate.toDate().toString().slice(4, 10);

          if (month === monthData) {
            medicationHistory.push({
              id: doc.id, // document id
              medicationName,
              date,
              status,
              type,
            });
          }
        });
        setMedicationHistory(medicationHistory);
      });
    };

    fetchData(); // call the async function to fetch data
  }, []);

  // handle month selection
  const handleMonthSelected = async (item) => {
    setSelectedMonth(item.value);
    console.log('selected item:', item.value);

    const medicationSnapshot = await historyRef
      .orderBy('loggedDate', 'desc')
      .get(); // get the data once
    const medicationHistory = [];
    try {
      medicationSnapshot.forEach((doc) => {
        const { medicationName, loggedDate, status, type } = doc.data();

        const month = getMonthName(loggedDate.toDate().getMonth());
        const date = loggedDate.toDate().toString().slice(4, 10);

        if (item.value === month) {
          medicationHistory.push({
            id: doc.id,
            medicationName,
            date,
            status,
            type,
          });
        }
      });
      setMedicationHistory(medicationHistory);
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
          data={medicationHistory}
          numColumns={1}
          renderItem={({ item }) => (
            <CustomButton
              buttonStyle={{
                backgroundColor:
                  item.type === 'Pill'
                    ? '#d8eef7'
                    : item.type === 'Bottle'
                    ? '#d8f7ea'
                    : item.type === 'Syringe'
                    ? '#f7e7d8'
                    : '#f7d8e3',
              }}
              textStyle={{
                color:
                  item.type === 'Pill'
                    ? '#238bdf'
                    : item.type === 'Bottle'
                    ? '#109f5c'
                    : item.type === 'Syringe'
                    ? '#af7b56'
                    : '#d85a77',
              }}
              // icon start
              name={
                item.type === 'Pill'
                  ? 'pill'
                  : item.type === 'Bottle'
                  ? 'bottle-tonic-plus'
                  : item.type === 'Syringe'
                  ? 'needle'
                  : 'plus-box'
              }
              color={
                item.type === 'Pill'
                  ? '#238bdf'
                  : item.type === 'Bottle'
                  ? '#109f5c'
                  : item.type === 'Syringe'
                  ? '#af7b56'
                  : '#d85a77'
              }
              style={{ marginLeft: 20, marginRight: -10 }}
              size={20}
              // icon end
              title={item.medicationName}
              textOne={item.date}
              textTwo={item.status}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default MedicationHistory;
