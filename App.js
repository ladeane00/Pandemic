
import React, { Component } from 'react';
import { Button, Text, View, StyleSheet,TextInput } from 'react-native';
import Swiper from 'react-native-swiper'; // 1.5.13
import PureChart from 'react-native-pure-chart';
import { InputAutoSuggest } from 'react-native-autocomplete-search';


export default class App extends Component {

  // Create States to Store Variables
  constructor(props) {

    super(props);

    this.state = {
      timeChartTest: [],
      custLoc: '',
      custLocTemp: '',
      latitude: '',
      longitude: '',
      latitudeTemp: '',
      longitudeTemp: '',
    };
    global.custLoc = "";
    global.lat = "";
    global.lon = "";
  }

  componentDidMount() {
    this.getCaseCount();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          });
        },

        (error) => this.setState({ error: error.message, latitude:40.0379, longitude:75.3433 }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
      );
  }

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
  getLocation(){
    this.setState({
      latitudeTemp:this.state.latitude,
      longitudeTemp:this.state.longitude,
    })
  }

  

 submitLocation() {
    global.custLoc = this.state.custLocTemp;
}

getCaseCount() {
  global.lat = parseInt(this.state.latitude);
  global.lon = parseInt(this.state.longitude);
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





  render() {
        const { timeChartTest } = this.state;
        console.log(timeChartTest);
        return (<Swiper style={styles.wrapper} showsButtons={true}>

        <View style = {styles.container}>
        <Text style={styles.title}> Pandemic </Text>
        
        
        <InputAutoSuggest
  style={{ flex: 1 }}
  staticData={[
    {someAttribute: 'val1', details: { id: '1', name:'Paris', country:'FR', continent:'Europe'}},
    {someAttribute: 'val2', details: { id: '2', name: 'Pattanduru', country:'PA', continent:'South America'}},
    {someAttribute: 'val3', details: { id: '3', name: 'Para', country:'PA', continent: 'South America'}},
    {someAttribute: 'val4', details: { id: '4', name:'London', country:'UK', continent: 'Europe'}},
    {someAttribute: 'val5', details: { id: '5', name:'New York', country: 'US', continent: 'North America'}},
    {someAttribute: 'val6', details: { id: '6', name:'Berlin', country: 'DE', continent: 'Europe'}},
   ]}
  itemFormat={{id: 'details.id', name: 'details.name', tags:['details.continent', 'details.country']}}
/>

      <Button
            title = 'Enter'
            onPress={() => this.submitLocation()}
        />

        <Text style={styles.otherText}>
          Location: {global.custLoc}
        </Text>

        {/*Documentation for Graph:  https://github.com/oksktank/react-native-pure-chart     */}
        <View style = {{padding: 30, marginTop: 100, marginBottom: 0}}>
        <PureChart
            style = {{marginLeft: 40}}
            width={'40%'}
            height={400}
            gap={25}
            data={timeChartTest}
            padding={100}
            type="line"
            numberOfYAxisGuideLine={10}
            backgroundColor="rgba(90,90,90,1)"
            highlightColor="red"
            labelColor='black'
            primaryColor='red'/>
        </View>
        <Button
            title = 'Get Location'
            onPress={() => this.getLocation() }
        />
        <Text style= {styles.otherText}>Latitude: {this.state.latitudeTemp}</Text>
        <Text style= {styles.otherText}>Longitude: {this.state.longitudeTemp}</Text>
        <Text style={styles.otherText}> Location: {global.custLoc}</Text>
              {this.state.error ? <Text style={styles.error}>Error: {this.state.error} Default Coordinates: Villanova University</Text> : null}
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
      graphTitle: {
        color: 'red',
        fontSize: 50,
        textAlign: "center",
        position:"absolute",
        top:20,
      },
      otherText: {
        color: 'white',
        fontSize: 25,
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
