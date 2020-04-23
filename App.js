import React, { Component } from 'react';
import { Button, Text, View, StyleSheet,TextInput } from 'react-native';
import Swiper from 'react-native-swiper'; // 1.5.13
import PureChart from 'react-native-pure-chart';

export default class App extends Component {

  // Create States to Store Variables

  constructor(props) {
    super(props);
    this.state = {
      timeChartTest: [],
      test: [],
    };
  }

  componentDidMount() {
    this.getCaseCount();
  }

  /*Object.fromEntries(
    Object.entries(Object.values(data)[0]).map(([key, value]) => [key, value])
  ).coordinates*/
  //for X
  /*Object.entries(Object.fromEntries(
    Object.entries(Object.values(data)[0]).map(([key, value]) => [key, value])
  ).dates)[0][0]*/ 
  //for Y
  /*Object.entries(Object.fromEntries(
    Object.entries(Object.values(data)[0]).map(([key, value]) => [key, value])
  ).dates)[0][1].cases*/
  //Plain Dates
  /*Object.entries(Object.fromEntries(
    Object.entries(Object.values(data)[0]).map(([key, value]) => [key, value])
  ).dates)*/

//CoronaVirus API Goes here
getCaseCount(){
  fetch(`https://coronadatascraper.com/timeseries-byLocation.json`)
  .then(response => response.json())
  .then((data) => {
    let timeData = [];
    let size = Object.entries(Object.fromEntries(
      Object.entries(Object.values(data)[0]).map(([key, value]) => [key, value])
    ).dates).length;
    for (var i = 0; i < size; i++) {
      timeData[i] = {x: Object.entries(Object.fromEntries(
        Object.entries(Object.values(data)[0]).map(([key, value]) => [key, value])
      ).dates)[i][0], y: Object.entries(Object.fromEntries(
        Object.entries(Object.values(data)[0]).map(([key, value]) => [key, value])
      ).dates)[i][1].cases};
    }
    this.setState({timeChartTest: timeData})
  });
}
//Mapping Code
/*var countryOne = Object.values(countries)[0];
      var countryData = Object.fromEntries(
        Object.entries(countryOne).map(([key, value]) => [key, value])
      );*/

  render() {
      const { timeChartTest } = this.state;
      console.log(timeChartTest);
        return (<Swiper style={styles.wrapper} showsButtons={true}>

        <View style = {styles.container}>
        <Text style={styles.title}> Pandemic </Text>
        <Text style={styles.yourLocationTitle}> Your Location: </Text>
        <Text style={styles.locationText}> First Country: Antwerp, Flanders, Belgium</Text>
        </View>

        <View style = {styles.container}>

        {/*Documentation for Graph:  https://github.com/oksktank/react-native-pure-chart     */}
        <PureChart
            width={'50%'}
            height={400}
            data={timeChartTest}
            type="line"
            numberOfYAxisGuideLine={10}
            backgroundColor="rgba(90,90,90,1)"
            highlightColor="red"
            labelColor='black'
            primaryColor='red'/>
        </View>
        </Swiper>
        );
      }
    }
    const styles = StyleSheet.create({
      wrapper: {
      },
      title: {
        color: 'red',
        fontSize: 50,
        textAlign: "center",
        position:"absolute",
        top:70,
      },
      yourLocationTitle: {
        color: 'white',
        fontSize: 25,
        position:"absolute",
        top:180,
      },
      locationText: {
        color: 'white',
        fontSize: 25,
        position:"absolute",
        top:215,
      },
      container: {
        flex: 1,
        backgroundColor: '#242424',
        alignItems: 'center',
        justifyContent: 'center',
      },
      author: {
        position:"absolute",
        bottom: 5,
        right: 30,
        color: "white",
        fontSize: 15,
      },
      input: {
        borderColor: "black",
        backgroundColor: "white",
        fontSize: 20,
      },
      error:{
        fontSize: 15,
        color: "red"
      }
    });
