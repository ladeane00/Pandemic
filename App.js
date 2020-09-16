/*  App.js

React Native program that uses https://coronadatascraper.com/timeseries-byLocation.json
to show data on a time series graph. This applications allows for user input.#000
@Lucas Deane, @Eli Jaghab, @Will Sabia, @Alex Alano

*/ 

import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Button, Text, View, StyleSheet,TextInput } from 'react-native';
import PureChart from 'react-native-pure-chart';

export default class App extends Component {

  // Create States to Store Variables
  constructor(props) {
    super(props);
      this.state = {
        timeChart: [], 
        text: '',
        listData: [],
        loc: '',
        locArray: [],
        locTitle: '',
        allData: null,
        coordArray: [],
        locIndex: 3426, // Initialize with United States
        currentCaseCount: 0,
     };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.getData();
  }
  
  //Populate timeChart with Data from API for Graph
  setChart(num) {
    let timeData = [];
    
    // Identify Number of Dates for Specified Location
    let dateSize = Object.entries(Object.fromEntries(
      Object.entries(Object.values(this.state.allData)[num]).map(([key, value]) => [key, value])
      ).dates).length;

    this.setState({currentCaseCount: Object.entries(Object.fromEntries(
      Object.entries(Object.values(this.state.allData)[num]).map(([key, value]) => [key, value])
    ).dates)[dateSize - 1][1].cases});
    
    
    for (var i = 0; i < dateSize; i++) {
      // Determine Dates for Specified Location - X-Axis
      var xValue = (Object.entries(Object.fromEntries(
        Object.entries(Object.values(this.state.allData)[num]).map(([key, value]) => [key, value])
    ).dates)[i][0]).slice(6);
      
      // Determine Case Count for Specified Location - Y-Axis
      var yValue = (Object.entries(Object.fromEntries(
        Object.entries(Object.values(this.state.allData)[num]).map(([key, value]) => [key, value])
      ).dates)[i][1].cases);
      
      // Checks if Case Count is Null
      if (yValue == null) {
        yValue = 0;
      }
      // Temporary Array
      timeData[i] = {x: xValue, y: yValue};
    }
    // Sets Data for Graph
    this.setState({timeChart: timeData});

    // Sets Graph Label
    this.setState({loc: this.state.locArray[num]})
  }
  
  // FlatList Functions
  GetFlatListItem(item) {
    let number = 0;

    // Sorts Through Locations Array to Identify Index of Location Selected
    for (var i = 0; i < this.state.locArray.length; i++) {
      if (this.state.locArray[i] == item) {
        number = i;
      }
    }

    // Pass Location Index to Graph 
    this.setChart(number);

    this.setState({
      loc: item, // Sets Location Object to the String
      locIndex: number, // Sets Variable to Index of Location
    })
  }

  // Populate FlatList with Locations
  searchData(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1
    });

    this.setState({
      listData: newData, // Sets Array of Locations Based on Search
      text: text // User Input from Search
      })
    }

    itemSeparator = () => {
      return (
        <View
          style={{
            height: .5,
            width: "100%",
            backgroundColor: "#000",
          }}
        />
      );
    }

// Get Data from API 
getData() {
  fetch(`https://coronadatascraper.com/timeseries-byLocation.json`)
  .then(response => response.json())
  .then((data) => {
    this.setState({allData: data}); // Sets JSON to Variable
    this.setState({locArray: data.map(({ name }) => name)}); // Sets JSON Locations to locArray
    this.arrayholder = this.state.locArray;

        //List setter
        this.setState({listData: data.map(({ name }) => name)});
    
    this.setChart(this.state.locIndex); // Sets Default US
  });
}


render() {
  return (
    <View style = {styles.container}>
    <Text style={styles.title}> Pandemic </Text>
    <View style={{ height: 150}}>
      <TextInput 
      style={styles.input}
      onChangeText={(text) => this.searchData(text)}
      value={this.state.text}
      underlineColorAndroid='transparent'
      placeholder="Enter a Location"
      returnKeyType="go" />

      <FlatList
      data={this.state.listData}
      keyExtractor={ (index) => index }
      ItemSeparatorComponent={this.itemSeparator}
      renderItem={({ item }) => <Text style={styles.row}
      onPress= {this.GetFlatListItem.bind(this, item)} >{item}</Text>}
      value = {this.state.item}
      style = {{flexGrow: 0}}
      />

  </View>
  {/*Documentation for Graph:  https://github.com/oksktank/react-native-pure-chart   */}
  <View style = {{padding: 30, marginTop: 0}}>
  <PureChart
      style = {{marginLeft: 40}}
      width={1}
      height={300}
      gap={12}
      data={this.state.timeChart}
      padding={0}
      type="line"
      numberOfYAxisGuideLine={10}
      backgroundColor="rgba(90,90,90,1)"
      backgroundColor="lightgray"
      highlightColor="red"
      labelColor='black'
      primaryColor='red'/>
  </View>
  <Text style={styles.otherText}> {this.state.loc} </Text>
  <Text style={styles.otherText}> Total Cases: {this.state.currentCaseCount} </Text>
  </View>

  );
}
}
    const styles = StyleSheet.create({
      MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 5,
      },
      row: {
        fontSize: 18,
        padding: 12,
        backgroundColor: 'white',
      },
      textInput: {
        textAlign: 'center',
        height: 42,
        borderWidth: 1,
        borderColor: '#009688',
        borderRadius: 8,
        backgroundColor: "#FFFF"
      },
      wrapper: {
      },
      title: { 
        color: 'red',
        fontSize: 35,
        fontFamily: "Arial",
        textAlign: "center",
        top:0,
      },
      locTitle: { 
        color: 'white',
        fontSize: 35,
        fontFamily: "Arial",
        textAlign: "center",
        marginTop: 30,
      },  
      otherText: {
        color: 'white',
        fontSize: 20,
      },
      container: {
        flex: 1,
        backgroundColor: '#242424',
        alignItems: 'center',
        justifyContent: 'center',
      },
      input: {
        textAlign: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 27,
        width: 380,
        borderRadius: 5,
        borderColor: "black",
        backgroundColor: "white",
        fontSize: 20,
      },
      error:{
        fontSize: 15,
        color: "red"
      }
    });