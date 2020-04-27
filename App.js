import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Button, Text, View, StyleSheet,TextInput } from 'react-native';
import Swiper from 'react-native-swiper'; // 1.5.13
import PureChart from 'react-native-pure-chart';

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
      text: '',
      data: [],
    };
    global.custLoc = "";
    global.lat = "";
    global.lon = "";
    this.arrayholder = [];
  }

  componentDidMount() {
    //this.getTestData();
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

  getTestData() {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          isLoading: false,
          data: responseJson,
        }, () => {
          // In this block you can do something with new state.
          this.arrayholder = responseJson;
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  GetFlatListItem(item) {
    Alert.alert(item);
  }

  searchData(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1
    });
 
    this.setState({
      data: newData,
      text: text
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
    //Countries Keys Array
    this.setState({data: Object.keys(data)}, () => {
      this.arrayholder = Object.keys(data);
    });
    let timeData = [];
    // Number of Countries
    let size = Object.entries(Object.fromEntries(
      Object.entries(Object.values(data)[12]).map(([key, value]) => [key, value])
    ).dates).length;
    //
    for (var i = 0; i < size; i++) {
      timeData[i] = {x: Object.entries(Object.fromEntries(
        Object.entries(Object.values(data)[12]).map(([key, value]) => [key, value])
      ).dates)[i][0], y: Object.entries(Object.fromEntries(
        Object.entries(Object.values(data)[12]).map(([key, value]) => [key, value])
      ).dates)[i][1].cases};
    }
    
    this.setState({timeChartTest: timeData})
  });
}

  render() {
    const { timeChartTest } = this.state;
    //console.log(timeChartTest);

    /*if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
        <ActivityIndicator />
      </View>
      )
    }*/
    return (
      <Swiper style={styles.wrapper} showsButtons={true}>

        <View style = {styles.container}>
        <Text style={styles.title}> Pandemic </Text>
        <TextInput style={styles.input}
          placeholder="Custom Location"
          onChangeText={(value) => this.state.custLocTemp = value}
        />
      <Button
            title = 'Enter'
            onPress={() => this.submitLocation()}
        />

        <Text style={styles.otherText}>
          Location: {global.custLoc}
        </Text>
        </View>

        <View style = {styles.container}>

        <Text style={styles.graphTitle}>Graph</Text>
        
        {/*Documentation for Graph:  https://github.com/oksktank/react-native-pure-chart   */}
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

        <View>
          <TextInput 
          style={styles.textInput}
          onChangeText={(text) => this.searchData(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Enter a Location" />
 
          <FlatList
          data={this.state.data}
          keyExtractor={ (index) => index }
          ItemSeparatorComponent={this.itemSeparator}
          renderItem={({ item }) => <Text style={styles.row}
          onPress={this.GetFlatListItem.bind(this, item)} >{item}</Text>}
          style={{ marginTop: 10 }} />
        </View>

        </Swiper>
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
        padding: 12
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
