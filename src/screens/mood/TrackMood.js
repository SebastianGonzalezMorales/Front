// react imports
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Activity from './activities';

// firebase
import { firebase } from '../../../firebase';

// components
import BackButton from '../../components/buttons/BackButton';
import FormButton from '../../components/buttons/FormButton';
import InputButton from '../../components/buttons/InputButton';

// customisation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormStyle from '../../assets/styles/FormStyle';
import GlobalStyle from '../../assets/styles/GlobalStyle';

// route to manage navigation history
const TrackMood = ({ route, navigation }) => {
  // references

  // document id passed from previous screen
  const docId = route.params.documentId;

  // obtain document id
  const obtainId = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('mood')
    .doc(docId);

  // states
  const [mood, setMood] = useState('');
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [activities, setActivities] = useState(Activity); // select activity handler

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // use effect to fetch mood
  useEffect(() => {
    const fetchMood = async () => {
      try {
        const moodDoc = await obtainId.get();
        const moodData = moodDoc.data();
        const moodValue = moodData.mood;
        const value = moodData.value;
        setMood(moodValue);
        setValue(value);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchMood();
  }, []);

  // delete document when back button has been pressed
  function deleteDocument() {
    obtainId.delete();

    console.log('Document', docId, 'has been deleted.');
    navigation.goBack();
  }

  // track mood
  const trackMood = async (mood, value, title, quickNote) => {
    try {
      await obtainId.set({
        mood,
        value,
        activities: activities,
        title,
        quickNote,
        created: firebase.firestore.Timestamp.now(),
      });
      console.log('Mood has been tracked');
      navigation.navigate('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  // select activity handler
  const selectHandler = (item) => {
    // creates array over the activities array
    const selectedItem = activities.map((value) => {
      if (value.id === item.id) {
        return { ...value, selected: !value.selected }; // toggle the selected state
      } else {
        return value;
      }
    });
    setActivities(selectedItem);
    console.log(selectedItem);
  };

  // keyboard offset
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

  /*
   * ****************
   * **** Screen ****
   * ****************
   */
  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      {/* header */}
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={deleteDocument} />

        <Text style={FormStyle.title}>{mood}</Text>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <View style={FormStyle.formContainer}>
          {/* activities */}
          <Text style={FormStyle.subtitle}>What have you been up to?</Text>

          <View style={FormStyle.flatListContainer}>
            <FlatList
              data={activities}
              scrollEnabled={true}
              numColumns={4}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                let iconName = '';

                // set icons based on activity id
                switch (item.id) {
                  case 1:
                    item.selected
                      ? (iconName = 'weather-sunny')
                      : (iconName = 'weather-sunny');
                    break;
                  case 2:
                    item.selected
                      ? (iconName = 'power-sleep')
                      : (iconName = 'power-sleep');
                    break;
                  case 3:
                    item.selected
                      ? (iconName = 'cart')
                      : (iconName = 'cart-outline');
                    break;
                  case 4:
                    item.selected
                      ? (iconName = 'school')
                      : (iconName = 'school-outline');
                    break;
                  case 5:
                    item.selected
                      ? (iconName = 'dumbbell')
                      : (iconName = 'dumbbell');
                    break;
                  case 6:
                    item.selected
                      ? (iconName = 'controller-classic')
                      : (iconName = 'controller-classic-outline');
                    break;
                  case 7:
                    item.selected
                      ? (iconName = 'home')
                      : (iconName = 'home-outline');
                    break;
                  case 8:
                    item.selected
                      ? (iconName = 'briefcase')
                      : (iconName = 'briefcase-outline');
                    break;
                  case 9:
                    item.selected
                      ? (iconName = 'book-open')
                      : (iconName = 'book-open-outline');
                    break;
                  case 10:
                    item.selected
                      ? (iconName = 'chef-hat')
                      : (iconName = 'chef-hat');
                    break;
                  case 11:
                    item.selected
                      ? (iconName = 'movie')
                      : (iconName = 'movie-outline');
                    break;
                  case 12:
                    item.selected
                      ? (iconName = 'dots-horizontal-circle')
                      : (iconName = 'dots-horizontal-circle-outline');
                    break;
                }

                return (
                  <View style={FormStyle.activitiesContainer}>
                    <TouchableOpacity onPress={() => selectHandler(item)}>
                      <View
                        style={[
                          FormStyle.activityContainer,
                          {
                            backgroundColor: item.selected
                              ? 'white'
                              : 'transparent',
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={24}
                          color="#f2f2f2"
                          style={[
                            FormStyle.activityIcon,
                            {
                              color: item.selected ? '#5da5a9' : '#f2f2f2',
                            },
                          ]}
                        />
                        <Text
                          style={[
                            FormStyle.activityText,
                            {
                              color: item.selected ? '#5da5a9' : '#f2f2f2',
                            },
                          ]}
                        >
                          {item.activity}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          <Text style={FormStyle.seeMoreText}>Scroll for more</Text>
          {/* inputs */}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={FormStyle.inputContainer}>
              <Text style={FormStyle.text}>Title</Text>
              <InputButton
                placeholder="Enter a title..."
                onChangeText={(title) => {
                  setTitle(title);
                }}
                autoCorrect={false}
              />

              <Text style={FormStyle.text}>Note</Text>
              <InputButton
                placeholder="Write a note..."
                onChangeText={(quickNote) => {
                  setQuickNote(quickNote);
                }}
                autoCorrect={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* button */}
        <View style={[FormStyle.buttonContainer, { marginTop: 20 }]}>
          <FormButton
            onPress={() => trackMood(mood, value, title, quickNote)}
            text="Save"
            buttonStyle={{
              backgroundColor: '#f2f2f2',
            }}
            textStyle={{ color: '#5da5a9' }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TrackMood;
