// react imports
import { View, SafeAreaView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { keywords } from '../utils/data';

// firebase
import { firebase } from '../../../firebase';

// messaging & http client
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

// components
import BackButton from '../../components/buttons/BackButton';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';
import FormStyle from '../../assets/styles/FormStyle';
import {
  customDate,
  customInputToolbar,
  customBubble,
} from '../../assets/styles/ChatStyle';

const Chatbot = ({ navigation }) => {
  // references
  const questionnaireRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('questionnaire');

  const moodRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('mood');

  const [moods, setMoods] = useState([]);
  const [results, setResults] = useState([]);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const API_KEY = 'API_KEY'; // created a secret API key on platform.openai.com/account

  const avatar = { image: 'https://i.ibb.co/Wy4KjGH/robot.png' };
  // const avatar2 = { image: 'https://i.ibb.co/gMbchB4/robot-3558860.png' };

  // hook to fetch all documents
  useEffect(() => {
    const fetchData = async () => {
      const moodSnapshot = await moodRef.orderBy('created', 'desc').get();
      const questionnaireSnapshot = await questionnaireRef
        .orderBy('created', 'desc')
        .get();

      const moods = [];
      const results = [];

      try {
        moodSnapshot.forEach((doc) => {
          const { mood, created } = doc.data();
          const latestMoodDate = created.seconds;
          moods.push({
            mood,
            latestMoodDate,
          });
        });
        setMoods(moods);
      } catch (error) {
        console.error(error);
      }

      try {
        questionnaireSnapshot.forEach((doc) => {
          const { severity, created } = doc.data();
          const latestResultDate = created.seconds;
          results.push({
            severity,
            latestResultDate,
          });
        });
        setResults(results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Call the async function to fetch data
  }, []);

  // set the tone for the following messages based on user's latest mood/severity
  // useEffect(() => {
  //   if (results.length > 0) {
  //     const setBotTone = async () => {
  //       let prompt = '';
  //       // compare seconds
  //       if (moods[0].latestMoodDate > results[0].latestResultDate) {
  //         prompt = 'You are a chatbot aiding people with messages';
  //         console.log(prompt);
  //       } else if (moods[0].latestMoodDate < results[0].latestResultDate) {
  //         prompt = 'This is a test';
  //         console.log(prompt);
  //       } else {
  //         prompt = 'This a mental health management application.';
  //       }

  //       const response = await axios.post(
  //         'https://api.openai.com/v1/engines/text-davinci-003/completions',
  //         {
  //           prompt: prompt,
  //           max_tokens: 1200,
  //           temperature: 0.7,
  //           n: 2,
  //         },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${API_KEY}`,
  //           },
  //         }
  //       );
  //       console.log(response.data.choices[0].text);
  //     };

  //     setBotTone();
  //   }
  // }, [results]); // use effect will run whenever the results array changes

  // initial message

  useEffect(() => {
    const initialMessage = async () => {
      const chatbotMessage = {
        _id: new Date().getTime(),
        text: "Hi, I am WeBot. If you are looking for support, or just need someone to talk to, I'm here for you! Feel free to open up about how you are feeling and I will do my very best to provide you with valuable information. \n\nFor example, if you are having a rough day, I can suggest ways to brighten your mood. \n\nYou can also try out the quick reply feature below by tapping on either of the two options.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'WeBot',
          avatar: avatar.image,
        },
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              title: 'Cheer me up!',
              value: 'Cheer me up!',
            },
            {
              title: 'Motivate me!',
              value: 'Motivate me!',
            },
          ],
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatbotMessage)
      );
    };

    initialMessage();
  }, []);

  // submit quick reply handler
  const handleQuickReply = async (quickReply) => {
    try {
      const quickMessage = quickReply[0].value;

      let message = {
        _id: new Date().getTime() + 1,
        text: quickMessage,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      };

      // add the quick message to the message state for the user to see
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );

      let prompt = '';
      if (message.text == 'Cheer me up!') {
        let prompts = [
          `${message.text}`,
          `Tell me a joke about robots`,
          `Say something that will brighten up my mood please`,
          `Tell me a joke about monsters`,
          `Tell me a joke about cats`,
          `Tell me a funny joke about the world`,
          `Tell me a joke about football`,
          `Tell me a joke about rabbits`,
          `Tell me a joke about school`,
          `Tell me a joke about work`,
          `Tell me a joke about life`,
        ];
        const randomIndex = Math.floor(Math.random() * prompts.length);
        prompt = prompts[randomIndex];
      } else if (message.text == 'Motivate me!') {
        let prompts = [
          `Tell me some famous quotes to movivate me. Say 'Motivational quotes are incredibly inspiring so here's a list of quotes for you!' then provide the list. Don't say 'of quotes'`,
          `Provide me with a motivational tip to overcome any challenges I'm facing?`,
          `Motivate me to get work done`,
          `Can give me a small list of motivational books. Say 'Books can be a powerful source of motivation, inspiring you to strive for improvement!' then provide the list`,
          `How can I use visualisation techniques to boost my motivation and see my success in my mind's eye?`,
        ];
        const randomIndex = Math.floor(Math.random() * prompts.length);
        prompt = prompts[randomIndex];
      }

      setIsTyping(true);

      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: prompt,
          max_tokens: 600,
          temperature: 0.7,
          n: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const responseMessage = response.data.choices[0].text.trim();
      console.log(responseMessage);

      const chatbotMessage = {
        _id: new Date().getTime() + 1,
        text: responseMessage,
        created: new Date(),
        user: {
          _id: 2,
          name: 'WeBot',
          avatar: avatar.image,
        },
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              title: 'Cheer me up!',
              value: 'Cheer me up!',
            },
            {
              title: 'Motivate me!',
              value: 'Motivate me!',
            },
          ],
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatbotMessage)
      );
      setIsTyping(false);
    } catch (error) {
      console.error(error);
    }
  };

  // submit message handler
  const handleSubmit = async (newMessages = []) => {
    try {
      const userMessage = newMessages[0];

      // add the user's message to the message state
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, userMessage)
      );

      setIsTyping(true);

      const messageText = userMessage.text;

      let prompt = '';
      // compare seconds
      if (
        moods.length > 0 &&
        moods[0].latestMoodDate > results[0].latestResultDate
      ) {
        let messageOne = `You are a chatbot for a mental health management application. The user 
        is currently feeling ${moods[0].mood}. Please tailor your response according to the user's latest
        mood without mentioning their latest mood entry. \n\n The user has submitted a message: ${messageText}. Offer guidance and support based on their current emotional state 
        and the mentioned challenges. Try to ask as little questions as possible.`;
        prompt = messageOne;
        console.log(prompt);
      } else if (results.length > 0) {
        let messageTwo = `You are a chatbot for a mental health management application. The user 
        recently completed the PHQ-9 Questionnaire with the result: ${results[0].severity}. Please 
        tailor your response according to the user's latest result without mentioning the questionnaire
        or result. \n\n The user has submitted a message: ${messageText}. Offer guidance and support based on their current emotional state 
        and the mentioned challenges. Try to ask as little questions as possible.`;

        prompt = messageTwo;
        console.log(prompt);
      } else {
        prompt = `You are a chatbot for a mental health management application. Offer guidance and support based on their message: ${messageText}.`;
        console.log(prompt);
      }

      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions', // endpoint
        {
          // prompt: `${messageText}`,
          prompt: prompt,
          max_tokens: 600,
          temperature: 0.7,
          n: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      const message = response.data.choices[0].text.trim();
      const chatbotMessage = {
        _id: new Date().getTime() + 1,
        text: message,
        created: new Date(),
        user: {
          _id: 2,
          name: 'WeBot',
          avatar: avatar.image,
        },
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              title: 'Cheer me up!',
              value: 'Cheer me up!',
            },
            {
              title: 'Motivate me!',
              value: 'Motivate me!',
            },
          ],
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatbotMessage)
      );
      setIsTyping(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={[FormStyle.flexContainer, { marginBottom: 10 }]}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>Chatbot</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(message) => handleSubmit(message)}
        onQuickReply={(quickReply) => handleQuickReply(quickReply)}
        user={{ _id: 1 }}
        minInputToolbarHeight={54}
        bottomOffset={32}
        isTyping={isTyping}
        quickReplyStyle={{
          marginTop: 5,
          backgroundColor: '#7db7ba',
          borderWidth: 0,
        }}
        quickReplyTextStyle={{ color: '#f2f2f2' }}
        // renderDay={customDate} // date
        renderInputToolbar={customInputToolbar}
        renderBubble={customBubble}
      />
    </SafeAreaView>
  );
};
export default Chatbot;

// Credit: https://youtu.be/XOnKpBCtrOM
// Gave me a good starting point on how to develop a chatbot using the ChatGPT API
