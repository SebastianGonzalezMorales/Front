// react imports
import {
  Linking,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

// components
import BackButton from '../../components/buttons/BackButton';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';
import FormStyle from '../../assets/styles/FormStyle';

const Counselling = ({ navigation }) => {
  const freePhoneCall = () => {
    Linking.openURL('tel:1800804848');
  };
  const under18Call = () => {
    Linking.openURL('tel:1800666666');
  };

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={[FormStyle.flexContainer, { marginBottom: 10 }]}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>Counselling</Text>
      </View>

      <View style={FormStyle.inputContainer}>
        {/* support line */}
        <Text
          style={{
            color: '#f2f2f2',
            fontFamily: 'DoppioOne',
            fontSize: 20,
            marginTop: 20,
          }}
        >
          Support Line
        </Text>
        <Text
          style={{ color: '#f2f2f2', fontFamily: 'DoppioOne', marginTop: 20 }}
        >
          We offer a free service available to anyone seeking support and
          information about anxiety, depression or bipolar disorder. The service
          is available 7 days a week from 10am to 10pm.
        </Text>

        <View style={{ flexDirection: 'row' }}>
          <Text style={FormStyle.text}>Freephone - </Text>
          <TouchableOpacity onPress={() => freePhoneCall()}>
            <Text style={FormStyle.text}>1800 80 48 48</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={FormStyle.text}>Under 18 - </Text>
          <TouchableOpacity onPress={() => under18Call()}>
            <Text style={FormStyle.text}>1800 66 66 66</Text>
          </TouchableOpacity>
        </View>

        <View style={GlobalStyle.counsellingLine} />

        {/* counselling */}
        <Text
          style={{
            color: '#f2f2f2',
            fontFamily: 'DoppioOne',
            fontSize: 20,
            marginTop: 20,
          }}
        >
          Counselling
        </Text>
        <Text
          style={{ color: '#f2f2f2', fontFamily: 'DoppioOne', marginTop: 20 }}
        >
          Our counseling service offers dedicated support for individuals
          dealing with depression, anxiety, and bipolar disorder. With the use
          of evidence-based approaches, we will work together to tackle any
          challenges you may be facing.
        </Text>

        <View style={{ flexDirection: 'row' }}>
          <Text style={FormStyle.text}>Freephone - </Text>
          <TouchableOpacity onPress={() => freePhoneCall()}>
            <Text style={FormStyle.text}>1800 64 64 64</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={FormStyle.text}>Under 18 - </Text>
          <TouchableOpacity onPress={() => under18Call()}>
            <Text style={FormStyle.text}>1800 38 38 38</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Counselling;
