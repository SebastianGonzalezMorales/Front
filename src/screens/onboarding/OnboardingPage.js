// react imports
import { Animated, FlatList, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';
import NextButton from './NextButton';
import slides from '../utils/slides';

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  // next slide needs to be at least 50% on screen before it will change
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // next button function
  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slideRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
        console.log('completed');
        navigation.navigate('Login');
      } catch (error) {
        console.log('Error @setItem', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slideRef}
        />
      </View>

      <Paginator data={slides} scrollX={scrollX} />
      <NextButton scrollTo={scrollTo} />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Credit: https://youtu.be/r2NJJye0XnM
