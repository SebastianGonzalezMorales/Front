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

const MoodHistory = ({ navigation }) => {
  // references
  const moodRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('mood');

  // states
  const [moods, setMoods] = useState([]);
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
      moodRef.orderBy('created', 'desc').onSnapshot((querySnapshot) => {
        const month = new Date().toString().slice(4, 7);
        const moods = [];
        querySnapshot.forEach((doc) => {
          const { mood, created } = doc.data();
          const monthData = created.toDate().toString().slice(4, 7);
          const date = created.toDate().toString().slice(4, 10);
          const time = created.toDate().toString().slice(16, 21);
          if (month === monthData) {
            moods.push({
              id: doc.id, // document id
              mood,
              date,
              time,
            });
          }
        });
        setMoods(moods);
      });
    };

    fetchData(); // call the async function to fetch data
  }, []);

  // handle month selection
  const handleMonthSelected = async (item) => {
    setSelectedMonth(item.value);
    console.log('selected item:', item.value);

    const moodSnapshot = await moodRef.orderBy('created', 'desc').get(); // get the data once
    const moods = [];
    try {
      moodSnapshot.forEach((doc) => {
        const { mood, created } = doc.data();

        const month = getMonthName(created.toDate().getMonth());
        const date = created.toDate().toString().slice(4, 10);
        const time = created.toDate().toString().slice(16, 21);

        if (item.value === month) {
          moods.push({
            id: doc.id,
            mood,
            date,
            time,
          });
        }
      });
      setMoods(moods);
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
          data={moods}
          numColumns={1}
          renderItem={({ item }) => (
            <CustomButton
              buttonStyle={{
                backgroundColor:
                  item.mood === 'Bad'
                    ? '#f7d8e3'
                    : item.mood === 'Good'
                    ? '#d8eef7'
                    : item.mood === 'Great'
                    ? '#d8f7ea'
                    : '#f7e7d8',
              }}
              textStyle={{
                color:
                  item.mood === 'Bad'
                    ? '#d85a77'
                    : item.mood === 'Good'
                    ? '#238bdf'
                    : item.mood === 'Great'
                    ? '#109f5c'
                    : '#af7b56',
              }}
              title={item.mood}
              textOne={item.date}
              textTwo={item.time}
              onPress={() => {
                navigation.navigate('UpdateMood', {
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

export default MoodHistory;
