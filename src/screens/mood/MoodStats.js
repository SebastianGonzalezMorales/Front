// react imports
import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LineChart, PieChart } from 'react-native-chart-kit';

// firebase
import { firebase } from '../../../firebase';

// components
import BackButton from '../../components/buttons/BackButton';
import { Dropdown } from 'react-native-element-dropdown';

// get functions
import { getMonth, getMonths, getMonthName } from '../utils/getMonths';

// customisation
import ChartStyle from '../../assets/styles/ChartStyle';
import GlobalStyle from '../../assets/styles/GlobalStyle';
import FormStyle from '../../assets/styles/FormStyle';

const MoodStats = ({ navigation }) => {
  //references
  const moodRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('mood');

  // states
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [badCounter, setBadCount] = useState(0);
  const [goodCounter, setGoodCount] = useState(0);
  const [greatCounter, setGreatCount] = useState(0);
  const [excellentCounter, setExcellentCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthChart, setMonthChart] = useState('');

  // data for pie chart
  const pieChartData = [
    {
      name: 'Bad',
      count: badCounter,
      color: '#d85a77',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    },
    {
      name: 'Good',
      count: goodCounter,
      color: '#238bdf',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    },
    {
      name: 'Great',
      count: greatCounter,
      color: '#109f5c',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    },
    {
      name: 'Excellent',
      count: excellentCounter,
      color: '#cc8e62',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    },
  ];

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  const currentMonth = getMonth();
  const months = getMonths();

  useEffect(() => {
    const fetchData = async () => {
      try {
        moodRef
          .orderBy('created', 'asc')
          .limit(30)
          .onSnapshot((querySnapshot) => {
            const x = [];
            const y = [];

            let bad = 0;
            let good = 0;
            let great = 0;
            let excellent = 0;

            const currentMonthAbbr = currentMonth.slice(0, 3);

            querySnapshot.forEach((doc) => {
              const { mood, value, created } = doc.data();
              const month = created.toDate().toString().slice(4, 7);
              const date = created.toDate().toString().slice(7, 10);
              if (month === currentMonthAbbr) {
                x.push('');
                y.push(value);

                // mood
                switch (mood) {
                  case 'Bad':
                    bad++;
                    break;
                  case 'Good':
                    good++;
                    break;
                  case 'Great':
                    great++;
                    break;
                  case 'Excellent':
                    excellent++;
                    break;
                  default:
                    break;
                }
              }
            });

            // line chart
            y.unshift(0);

            setX(x);
            setY(y);

            // pie chart
            setBadCount(bad);
            setGoodCount(good);
            setGreatCount(great);
            setExcellentCount(excellent);
            setMonthChart(currentMonth);
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // handle month selection
  const handleMonthSelected = async (item) => {
    setSelectedMonth(item.value);
    console.log('selected item:', item.value);

    const moodSnapshot = await moodRef.orderBy('created', 'desc').get(); // get the data once
    const moods = [];
    const x = [];
    const y = [];

    let bad = 0;
    let good = 0;
    let great = 0;
    let excellent = 0;
    try {
      moodSnapshot.forEach((doc) => {
        const { mood, value, created } = doc.data();

        const month = getMonthName(created.toDate().getMonth());
        const date = created.toDate().toString().slice(7, 10);
        if (item.value === month) {
          moods.push(mood);
          x.push('');
          y.push(value);
          setMonthChart(month);

          switch (mood) {
            case 'Bad':
              bad++;
              break;
            case 'Good':
              good++;
              break;
            case 'Great':
              great++;
              break;
            case 'Excellent':
              excellent++;
              break;
            default:
              break;
          }
        }
      });
      // line chart
      y.unshift(0);

      setX(x);
      setY(y);

      // pie chart
      setBadCount(bad);
      setGoodCount(good);
      setGreatCount(great);
      setExcellentCount(excellent);
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>Statistics</Text>
      </View>
      {/* dropdown */}
      <View style={{ paddingHorizontal: 30, marginVertical: 20 }}>
        <Dropdown
          placeholderStyle={{
            color: '#f2f2f2',
            fontFamily: 'DoppioOne',
          }}
          containerStyle={{
            borderRadius: 10,
          }}
          selectedTextStyle={{
            color: '#f2f2f2',
            fontFamily: 'DoppioOne',
            fontSize: 14,
          }}
          itemTextStyle={{ color: '#666a72', fontFamily: 'DoppioOne' }}
          iconStyle={{ tintColor: '#fff' }}
          placeholder={currentMonth}
          data={months.map((month) => ({ label: month, value: month }))}
          value={selectedMonth}
          onChange={(month) => handleMonthSelected(month)}
          labelField="label"
          valueField="value"
        />
      </View>
      {/*
       * **********************
       * ***** Line chart *****
       * **********************
       */}
      {y.length > 0 ? (
        <View>
          <LineChart
            data={{
              labels: x,
              datasets: [
                {
                  data: y,
                },
              ],
            }}
            width={Dimensions.get('window').width * 0.85}
            height={200}
            chartConfig={{
              backgroundGradientFrom: '#f2f2f2',
              backgroundGradientTo: '#f2f2f2',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(93, 165, 169, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(40, 42, 45, ${opacity})`,
              style: {
                marginTop: 20,
                backgroundColor: '#f2f2f2',
              },
              propsForDots: {
                r: '3',
                strokeWidth: '1',
                stroke: '#5da5a9',
              },
            }}
            style={ChartStyle.chartStyle}
            bezier
            yAxisInterval={4}
          />
          <Text
            style={{
              position: 'absolute',
              alignSelf: 'center',
              bottom: '3%',
              paddingLeft: 30,
              color: '#666a72',
              fontFamily: 'DoppioOne',
            }}
          >
            {monthChart}
          </Text>
        </View>
      ) : (
        <Text>Loading chart...</Text>
      )}
      <View style={ChartStyle.legendContainer}>
        <Text style={ChartStyle.legendtext}>1 - Bad</Text>
        <Text style={ChartStyle.legendtext}>2 - Good</Text>
        <Text style={ChartStyle.legendtext}>3 - Great</Text>
        <Text style={ChartStyle.legendtext}>4 - Excellent</Text>
      </View>

      {/*
       * *********************
       * ***** Pie chart *****
       * *********************
       */}
      <View style={ChartStyle.pieChartContainer}>
        <PieChart
          data={pieChartData}
          width={Dimensions.get('window').width * 0.85}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(93, 165, 169, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(40, 42, 45, ${opacity})`,
            style: {
              backgroundColor: '#f2f2f2',
            },
          }}
          accessor="count"
          backgroundColor="transparent"
          style={ChartStyle.pieChartStyle}
        />
      </View>
    </SafeAreaView>
  );
};

export default MoodStats;
