import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      }); // listen to incoming notifications when the app is open

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      }); // does nothing right now, but it is used to handle what happens when the notification has been tapped
  });
}

// set notification parameters
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// schedule a notification
export async function schedulePushNotification(medicationName, time) {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Medication Reminder',
      body: `Time for your ${medicationName}! 💊 Take care and stay healthy! 😊`,
      data: { medicationName },
    },
    trigger: {
      hour: time.getHours(),
      minute: time.getMinutes(),
      repeats: true,
    },
  });

  return identifier;
}

// cancel a specific notification
export async function cancelNotification(id) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

// get permissions
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: '06980911-56be-454b-a7d6-c1d35d9e040f',
      })
    ).data;
    // console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
