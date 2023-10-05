import { Platform, Text, View } from 'react-native';
import { InputToolbar, Bubble } from 'react-native-gifted-chat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const customDate = (props) => {
  return (
    <View {...props} style={{ alignItems: 'center', marginVertical: 10 }}>
      <Text
        style={{
          color: '#f2f2f2',
          fontSize: 12,
        }}
      >
        {props.currentMessage.createdAt.toDateString().slice(4, 15)}
      </Text>
    </View>
  );
};

const customInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#f2f2f2',
        borderTopWidth: 0,
        paddingBottom: 2,
        paddingTop: 10,
      }}
    />
  );
};

const customBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          padding: 5,
          backgroundColor: '#7db7ba',
        },
        left: {
          padding: 5,
          backgroundColor: '#f2f2f2',
        },
      }}
      style={{ color: '#fff' }}
    />
  );
};

export { customDate, customInputToolbar, customBubble };
