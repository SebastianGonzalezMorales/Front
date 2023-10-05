// React Imports
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import Onboarding from './src/screens/onboarding/OnboardingPage';

import Login from './src/screens/authentication/Login';
import Register from './src/screens/authentication/Register';

import Mood from './src/screens/mood/Mood';
import TrackMood from './src/screens/mood/TrackMood';
import UpdateMood from './src/screens/mood/UpdateMood';
import MoodStats from './src/screens/mood/MoodStats';
import MoodHistory from './src/screens/mood/MoodHistory';

import Medication from './src/screens/medication/Medication';
import TrackMedication from './src/screens/medication/TrackMedication';
import Track from './src/screens/medication/Track';
import UpdateMedication from './src/screens/medication/UpdateMedication';
import Notification from './src/screens/utils/Notification';
import MedicationHistory from './src/screens/medication/MedicationHistory';

import Questionnaire from './src/screens/questionnaire/Questionnaire';
import Test from './src/screens/questionnaire/Test';
import QuestionnaireStats from './src/screens/questionnaire/QuestionnaireStats';
import ResultView from './src/screens/questionnaire/ResultView';
import QuestionnaireHistory from './src/screens/questionnaire/QuestionnaireHistory';

import Settings from './src/screens/settings/Settings';
import EditProfile from './src/screens/settings/EditProfile';
import Chatbot from './src/screens/settings/Chatbot';
import Counselling from './src/screens/settings/Counselling';

// Firebase
import { firebase } from './firebase';

// Customisation
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator(); // create tab navigator method
const Stack = createNativeStackNavigator(); // create stack navigator method

// Tab navigator
function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: { paddingTop: 10 },

        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if (route.name === 'Mood') {
            iconName = focused ? 'home-variant' : 'home-variant-outline';
            size = 23;
            color = focused ? '#5da5a9' : '#999';
          } else if (route.name === 'Medication') {
            iconName = focused ? 'calendar' : 'calendar-outline';
            size = 22;
            color = focused ? '#5da5a9' : '#999';
          } else if (route.name === 'Questionnaire') {
            iconName = focused ? 'file-document' : 'file-document-outline';
            size = 22;
            color = focused ? '#5da5a9' : '#999';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
            size = 22;
            color = focused ? '#5da5a9' : '#999';
          } else {
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Mood'}
        component={Mood}
      />
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Medication'}
        component={Medication}
      />
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Questionnaire'}
        component={Questionnaire}
      />
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Settings'}
        component={Settings}
      />
    </Tab.Navigator>
  );
}

function App() {
  // onboarding
  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@viewedOnboarding');

        if (value !== null) {
          setViewedOnboarding(true);
        }
      } catch (error) {
        console.log('Error @checkOnboarding', error);
      }
    };
    checkOnboarding();
  }, []);

  const [initialising, setInitialising] = useState(true);
  const [user, setUser] = useState();

  // pre-loading fonts
  const [fontsLoaded] = useFonts({
    DoppioOne: require('./src/assets/fonts/DoppioOne-Regular.ttf'),
    Actor: require('./src/assets/fonts/Actor-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initialising) setInitialising(false);
  }

  // Remember user
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  if (initialising) return null;

  // nesting navigators
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* authentication */}
        {/* {viewedOnboarding ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        )} */}
        {!viewedOnboarding ? (
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{ gestureEnabled: false }}
          />
        ) : (
          <></>
        )}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Register" component={Register} />
        {/* mood tracker */}
        <Stack.Screen name="TrackMood" component={TrackMood} />
        <Stack.Screen name="UpdateMood" component={UpdateMood} />
        <Stack.Screen name="MoodStats" component={MoodStats} />
        <Stack.Screen
          name="MoodHistory"
          component={MoodHistory}
          options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
          }}
        />
        {/* medication */}
        <Stack.Screen name="TrackMedication" component={TrackMedication} />
        <Stack.Screen name="Track" component={Track} />
        <Stack.Screen name="UpdateMedication" component={UpdateMedication} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen
          name="MedicationHistory"
          component={MedicationHistory}
          options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
          }}
        />
        {/* questionnaire */}
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen
          name="QuestionnaireStats"
          component={QuestionnaireStats}
        />
        <Stack.Screen name="ResultView" component={ResultView} />
        <Stack.Screen
          name="QuestionnaireHistory"
          component={QuestionnaireHistory}
          options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
          }}
        />
        {/* settings */}
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
        <Stack.Screen name="Counselling" component={Counselling} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
