// react imports
import { Image, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

// Firebase
import { firebase } from '../../../firebase';

// components
import AuthButton from '../../components/buttons/AuthButton';
import SmallAuthButton from '../../components/buttons/SmallAuthButton';

// customisation
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthStyle from '../../assets/styles/AuthStyle';

const Register = ({ navigation }) => {
  // states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // sign up function
  const handleSignUp = async (fullName, email, password) => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords don't match.");
        return;
      }

      await firebase.auth().createUserWithEmailAndPassword(email, password);

      const userRef = firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid);

      await userRef.set({
        fullName,
        email,
      });

      // create subcollections (mood, medication, questionnaire & medication history)
      const subcollections = [
        'mood',
        'medication',
        'questionnaire',
        'medicationHistory',
      ];
      for (const subcollection of subcollections) {
        const subcollectionRef = userRef.collection(subcollection).doc();
        await subcollectionRef.set({});
      }

      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={AuthStyle.container}>
        {/* section one */}
        <View style={AuthStyle.rowOne}>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="10%" cy="30%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="2%" cy="70%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="30%" cy="50%" r="30" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="25%" cy="95%" r="30" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="52%" cy="70%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="64%" cy="20%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="70%" cy="100%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="75%" cy="60%" r="30" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="95%" cy="35%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="100%" cy="85%" r="30" />
          </Svg>
          <SafeAreaView style={AuthStyle.logo}>
            {/* <Text style={AuthStyle.logoText}>Logo</Text> */}
            <Image
              style={{ width: 80, height: 80 }}
              source={require('./../../../assets/logo.png')}
            />
          </SafeAreaView>
        </View>
        {/* section two */}
        <View style={AuthStyle.rowTwo}>
          <Text style={AuthStyle.title}>Create an account</Text>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              onChangeText={(text) => setFullName(text)} // every time the text changes, we can set the email to that text (callback function)
              placeholder="Full name"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              style={AuthStyle.input}
            />
          </View>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={23}
              style={AuthStyle.icon}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)} // every time the text changes, we can set the email to that text (callback function)
              placeholder="Email address"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              style={AuthStyle.input}
            />
          </View>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="lock-open-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              placeholderTextColor="#92959f"
              secureTextEntry
              selectionColor="#5da5a9"
              style={AuthStyle.input}
            />
          </View>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              onChangeText={(text) => setConfirmPassword(text)}
              placeholder="Confirm password"
              placeholderTextColor="#92959f"
              secureTextEntry
              selectionColor="#5da5a9"
              style={AuthStyle.input}
            />
          </View>

          <AuthButton
            text="Sign up"
            onPress={() => handleSignUp(fullName, email, password)}
          />

          <View style={AuthStyle.changeScreenContainer}>
            <Text style={AuthStyle.changeScreenText}>
              Already have an account?
            </Text>
            <SmallAuthButton
              text="Sign in"
              onPress={() => navigation.replace('Login')}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Register;
