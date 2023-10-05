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
import InputButton from '../../components/buttons/InputButton';
import FormButton from '../../components/buttons/FormButton';

// customisation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormStyle from '../../assets/styles/FormStyle';

const UpdateMood = ({ navigation, route }) => {
  // references

  // document id passed from previous screen
  const docId = route.params.documentId;

  // obtain document id from firebase
  const obtainId = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('mood')
    .doc(docId);

  // states
  const [mood, setMood] = useState('');
  const [title, setTitle] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [activities, setActivities] = useState(Activity); // select activity handler

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // use effect to fetch mood value
  useEffect(() => {
    const fetchMood = async () => {
      try {
        const moodDoc = await obtainId.get();

        if (moodDoc.exists) {
          const moodData = moodDoc.data();
          const moodValue = moodData.mood;
          setMood(moodValue);
        } else {
          console.log('Document does not exist');
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchMood();
  }, []);

  // get document to enable the text values to be set based on document values
  useEffect(() => {
    const getDocument = async () => {
      const doc = await obtainId.get();
      const moodData = doc.data();
      setTitle(moodData.title);
      setQuickNote(moodData.quickNote);
      setActivities(moodData.activities);
    };

    getDocument();
  }, []);

  // select activity handler
  const selectHandler = (item) => {
    const selectedItem = activities.map((value) => {
      if (value.id === item.id) {
        return { ...value, selected: !value.selected };
      } else {
        return value;
      }
    });

    setActivities(selectedItem);
  };

  // update mood
  const update = async () => {
    try {
      await obtainId.update({
        activities: activities,
        title: title,
        quickNote: quickNote,
      });
      console.log('Mood has been updated');
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }
  };

  // keyboard offset
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={FormStyle.container}>
      {/* header */}
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>{mood}</Text>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <View style={FormStyle.formContainer}>
          {/* activities */}
          <Text style={FormStyle.subtitle}>
            What are you enjoying about today?
          </Text>

          <View style={FormStyle.flatListContainer}>
            <FlatList
              data={activities}
              scrollEnabled={true}
              numColumns={4}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                let iconName = '';

                // icons based on activity id
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
                value={title}
                placeholder="Enter a title..."
                onChangeText={(title) => {
                  setTitle(title);
                }}
                autoCorrect={false}
              />

              <Text style={FormStyle.text}>Note</Text>
              <InputButton
                value={quickNote}
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
            onPress={() => update()}
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

export default UpdateMood;
