// react imports
import { SafeAreaView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

// firebase
import { firebase } from '../../../firebase';

// components
import BackButton from '../../components/buttons/BackButton';
import FormButton from '../../components/buttons/FormButton';
import InputButton from '../../components/buttons/InputButton';

// customisation
import FormStyle from '../../assets/styles/FormStyle';

const EditProfile = ({ navigation }) => {
  // references
  const userRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid);

  // states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // get user's document
  useEffect(() => {
    const getUserDocument = async () => {
      const doc = await userRef.get(); // get the document once
      const userData = doc.data();
      setEmail(userData.email);
      setName(userData.fullName);
    };

    getUserDocument();
  }, []);

  // update the user's name
  const updateName = async () => {
    try {
      await userRef.update({
        fullName: name,
      });
      navigation.navigate('Settings');
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
    <SafeAreaView style={FormStyle.container}>
      {/* header */}
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={FormStyle.title}>Profile</Text>
      </View>

      {/* text */}
      <View style={{ flex: 1 }}>
        <View style={FormStyle.inputContainer}>
          <Text style={FormStyle.text}>Name</Text>
          <InputButton
            value={name}
            placeholder="Enter a name..."
            onChangeText={(name) => {
              setName(name);
            }}
            autoCorrect={false}
          />

          <Text style={FormStyle.text}>Email</Text>
          <View style={FormStyle.textContainer}>
            <Text style={[FormStyle.text, { marginLeft: 20 }]}>{email}</Text>
          </View>
        </View>

        {/* button */}
        <View style={[FormStyle.buttonContainer, FormStyle.buttonPosition]}>
          <FormButton
            onPress={() => updateName()}
            text="Save"
            buttonStyle={{
              backgroundColor: '#f2f2f2',
            }}
            textStyle={{ color: '#5da5a9' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
