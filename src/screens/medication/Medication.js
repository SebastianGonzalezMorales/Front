// react imports
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';

// firebase
import { firebase } from '../../../firebase';

// components
import CircularButton from '../../components/buttons/CircularButton';
import CustomButton from '../../components/buttons/CustomButton';
import FormButton from '../../components/buttons/FormButton';
import HistoryButton from '../../components/buttons/HistoryButton';

// get functions
import { getMonth } from '../utils/getMonths';
import getYear from '../utils/getYear';
import getWeekdays from '../utils/getWeekdays';
import getDaysString from '../utils/getDaysString';

// customisation
import GestureRecognizer from 'react-native-swipe-gestures';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../../assets/styles/GlobalStyle';
import ModalStyle from '../../assets/styles/ModalStyle';

// notification
import { cancelNotification } from '../utils/Notification';

function Medication({ navigation }) {
  // references
  const userRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid);
  const medRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('medication');
  const historyRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('medicationHistory');

  // states
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [medications, setMedication] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taken, setTaken] = useState(0); // count amount taken
  const [total, setTotal] = useState(0); // count amount taken
  const [modalVisible, setModalVisible] = useState(false);
  const [seeAllModalVisible, setSeeAllModalVisible] = useState(false);
  const [notificationID, setNotificationID] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  const month = getMonth();
  const year = getYear();
  const days = getWeekdays();

  // fetch all medications
  useEffect(() => {
    const fetchData = async () => {
      medRef.orderBy('created', 'desc').onSnapshot((querySnapshot) => {
        const medications = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
          const { medicationName, status, time, notificationID, type } =
            doc.data();
          medications.push({
            id: doc.id,
            medicationName,
            status,
            time,
            type,
            notificationID,
          });

          if (status === 'Taken') {
            count++;
          }
        });
        setTaken(count);
        setTotal(medications.length);
        setMedication(medications);
        setNotificationID(medications.notificationID);
      });
    };

    fetchData(); // call async function to fetch data
  }, []);

  // fetch all medication history
  useEffect(() => {
    const fetchHistory = async () => {
      historyRef.orderBy('loggedDate', 'desc').onSnapshot((querySnapshot) => {
        const medicationHistory = [];
        querySnapshot.forEach((doc) => {
          const { medicationName, status, loggedDate } = doc.data();
          const date = loggedDate.toDate().toString().slice(4, 15);
          const customDate = loggedDate.toDate().toString().slice(4, 10);
          medicationHistory.push({
            id: doc.id,
            date,
            medicationName,
            status,
            customDate,
          });
        });
        setMedicationHistory(medicationHistory);
      });
    };

    fetchHistory();
  }, []);

  // handle date selection
  const handleDateSelected = async (item) => {
    setSelectedDate(item);
    const selectedDate = item.toString().slice(4, 15);

    try {
      const historySnapshot = await historyRef.get();
      const medicationSnapshot = await medRef.orderBy('created', 'desc').get();
      const medicationHistory = [];
      let count = 0;

      const today = new Date().toString().slice(4, 15);
      // if today has been selected then show medication document
      if (selectedDate === today) {
        const medications = medicationSnapshot.docs.map((doc) => {
          const { medicationName, status, time, type, notificationID } =
            doc.data();
          if (selectedDate === today && status === 'Taken') {
            count++;
          }
          return {
            id: doc.id,
            medicationName,
            status,
            time,
            type,
            notificationID,
          };
        });
        setTaken(count);
        setMedication(medications);
      }
      // if the date selected is after today then show nothing
      else if (selectedDate > today) {
        setMedication([]);
        setTaken(0);
      }
      // if the date selected is before today then show the medication history document for that day
      else {
        historySnapshot.forEach((doc) => {
          const { medicationName, status, loggedDate, type } = doc.data();

          if (loggedDate) {
            const date = loggedDate.toDate().toString().slice(4, 15);

            if (selectedDate === date && status === 'Taken') {
              count++;
            }
            if (selectedDate === date) {
              medicationHistory.push({
                id: doc.id,
                loggedDate,
                medicationName,
                status,
                type,
              });
            }
          }
        });
        setTaken(count);
        setMedication(medicationHistory);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // delete doc and cancel notification
  const deleteItemAndReminder = async (notificationID) => {
    try {
      // delete item
      await userRef.collection('medication').doc(selectedId).delete();
      await userRef.collection('medicationHistory').doc(selectedId).delete();
      console.log('Document', selectedId, 'has been deleted');

      // delete reminder
      await cancelNotification(notificationID);
    } catch (error) {
      console.error(error);
    }

    // close modal
    setModalVisible(false);
  };

  // percentage of the medication taken by filtering array
  const getTakenCount = (item) => {
    const selectedDate = item.toString().slice(4, 15);

    const takenPerDate = medicationHistory.filter(
      (item) => item.date === selectedDate && item.status === 'Taken'
    ).length;

    const percentageTaken = (takenPerDate / total) * 100;

    if (percentageTaken < 50) {
      return (
        <MaterialCommunityIcons
          name="circle"
          size={8}
          style={{
            marginTop: 3,
            color: '#d85a77',
          }}
        />
      );
    } else if (percentageTaken >= 50 && percentageTaken < 75) {
      return (
        <MaterialCommunityIcons
          name="circle"
          size={8}
          style={{
            marginTop: 3,
            color: '#E2EE4B',
          }}
        />
      );
    } else {
      return (
        <MaterialCommunityIcons
          name="circle"
          size={8}
          style={{
            marginTop: 3,
            color: '#70EE4B',
          }}
        />
      );
    }
  };
  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/*
       * ******************
       * ***** Modals *****
       * ******************
       */}

      {/* modal one - medication history */}
      <GestureRecognizer onSwipeDown={() => setSeeAllModalVisible(false)}>
        <Modal visible={seeAllModalVisible} animationType="slide">
          <SafeAreaView style={ModalStyle.modalContent}>
            <View style={ModalStyle.headerWrapper}>
              <Text style={ModalStyle.modalTitle}>History</Text>
              <MaterialCommunityIcons
                name="close"
                color="#666a72"
                size={30}
                onPress={() => setSeeAllModalVisible(false)}
              />
            </View>
            <View style={ModalStyle.flatlistWrapper}>
              <FlatList
                data={medicationHistory}
                numColumns={1}
                renderItem={({ item }) => (
                  <CustomButton
                    buttonStyle={{
                      backgroundColor: '#d8eef7',
                    }}
                    textStyle={{ color: '#238bdf' }}
                    title={item.medicationName}
                    textOne={item.customDate}
                    textTwo={item.status}
                  />
                )}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </GestureRecognizer>

      {/* modal two - delete document modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={[ModalStyle.halfModalContent, { height: 260 }]}>
          <View style={ModalStyle.halfModalWrapper}>
            <FormButton
              text="Delete"
              onPress={() => {
                deleteItemAndReminder(notificationID),
                  setModalVisible(!modalVisible);
              }}
              buttonStyle={{
                backgroundColor: '#e55e7e',
              }}
              textStyle={{ color: '#f2f2f2' }}
            />

            <FormButton
              text="Edit"
              onPress={() => {
                navigation.navigate('UpdateMedication', { selectedId }),
                  setModalVisible(!modalVisible);
              }}
              buttonStyle={{
                backgroundColor: '#5da5a9',
              }}
              textStyle={{ color: '#f2f2f2' }}
            />

            <FormButton
              text="Cancel"
              onPress={() => setModalVisible(!modalVisible)}
              buttonStyle={{
                backgroundColor: '#5da5a9',
              }}
              textStyle={{ color: '#f2f2f2' }}
            />
          </View>
        </View>
      </Modal>

      {/*
       * *********************
       * ***** Section 1 *****
       * *********************
       */}
      <View style={{ height: 210 }}>
        <Text style={GlobalStyle.welcomeText}>Medication Reminder</Text>

        <Text style={GlobalStyle.subtitle}>
          {month}, {year}
        </Text>

        {/* calendar */}
        <View style={GlobalStyle.calendarContainer}>
          <FlatList
            horizontal
            scrollEnabled={false}
            data={days}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                <View style={GlobalStyle.daysContainer}>
                  <Text style={GlobalStyle.daysText}>
                    {getDaysString(item)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDateSelected(item)}
                  style={[
                    GlobalStyle.selectDate,
                    {
                      backgroundColor:
                        item.toDateString() === selectedDate.toDateString()
                          ? '#f2f2f2'
                          : '#5da5a9',
                      borderRadius:
                        item.toDateString() === selectedDate.toDateString()
                          ? 50
                          : 0,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        item.toDateString() === selectedDate.toDateString()
                          ? '#5da5a9'
                          : '#f2f2f2',
                      fontFamily: 'DoppioOne',
                    }}
                  >
                    {item.getDate().toString()}
                  </Text>
                </TouchableOpacity>
                <View style={GlobalStyle.daysContainer}>
                  {getTakenCount(item)}
                </View>
              </View>
            )}
          />
        </View>
        {/* completed counter */}
        {/* <Text style={[GlobalStyle.text, { marginTop: -15 }]}>
          Completed: {taken} / {total}
        </Text> */}
      </View>

      {/*
       * *********************
       * ***** Section 2 *****
       * *********************
       */}
      <View style={GlobalStyle.rowTwo}>
        <HistoryButton
          onPress={() => navigation.navigate('MedicationHistory')}
          textLeft="Today"
          textRight="History"
        />
        <FlatList
          data={medications}
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
              textOne={item.status}
              textTwo={item.time}
              onLongPress={() => (
                setModalVisible(true),
                setSelectedId(item.id),
                setNotificationID(item.notificationID)
              )}
              onPress={() => {
                navigation.navigate('Track', {
                  documentId: item.id,
                });
              }}
            />
          )}
        />

        {/* button */}
        <View style={GlobalStyle.circularButtonContainer}>
          <CircularButton
            onPress={() => navigation.navigate('TrackMedication')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Medication;
