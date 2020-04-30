import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Button, Text, View, StyleSheet,TextInput } from 'react-native';
import PureChart from 'react-native-pure-chart';

export default class App extends Component {

  // Create States to Store Variables
  constructor(props) {
    super(props);
      this.state = {
        timeChart: [],
        latitude: '',
        longitude: '',
        coord: [],
        text: '',
        listData: [],
        loc: "",
        locIndex: 0,
        locArray: [],
        allData: null,
        coordArray: [],
     };
        global.lat = "";
        global.lon = "";
        this.arrayholder = [];
  }

  componentDidMount() {
    this.getData();
    this.getLocation();
  }

  GetFlatListItem(item) {
    let number = 0;
    for (var i = 0; i < this.state.locArray.length; i++) {
      if (this.state.locArray[i] == item) {
        number = i;
      }
    }
    
    this.setChart(number);

    this.setState({
      loc: item,
      locIndex: number,
    })
  }

  setChart(num) {
    let timeData = [];

      let dateSize = Object.entries(Object.fromEntries(
        Object.entries(Object.values(this.state.allData)[num]).map(([key, value]) => [key, value])
        ).dates).length;

      for (var i = 0; i < dateSize; i++) {
        timeData[i] = {x: Object.entries(Object.fromEntries(
          Object.entries(Object.values(this.state.allData)[num]).map(([key, value]) => [key, value])
        ).dates)[i][0], y: Object.entries(Object.fromEntries(
          Object.entries(Object.values(this.state.allData)[num]).map(([key, value]) => [key, value])
        ).dates)[i][1].cases};
      }
      this.setState({timeChart: timeData});
  }


  // FlatList Functions
  searchData(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1
    });
 
    this.setState({
      listData: newData,
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

//User Location 
  getLocation() {
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
    this.setState({
      latitude: parseInt(this.state.latitude),
      longitude: parseInt(this.state.longitude),
      coord: [parseInt(this.state.latitude), parseInt(this.state.longitude)],
    })
  }

 submitLocation() {
    global.custLoc = this.state.custLocTemp;
}

getData() {
  fetch(`https://coronadatascraper.com/timeseries-byLocation.json`)
  .then(response => response.json())
  .then((data) => {
    //sets a data variable with everything
    this.setState({allData: data});

    //Location Keys Array
    this.setState({locArray: Object.keys(data)});

    let locSize = Object.keys(data).length;

    let coordData = [];
    for (var i = 0; i < locSize; i++) {
      coordData[i] = Object.fromEntries(
        Object.entries(Object.values(data)[i]).map(([key, value]) => [key, value])
      ).coordinates;
      
      

    }

    this.setState({coordArray: coordData});

    //List setter
    this.setState({listData: Object.keys(data)}, () => {
      this.arrayholder = Object.keys(data);
    });

    //loc stuff

    /*for (var i = 0; i < locSize; i++) {
      var coordinate = coordData[i];
      var long = coordinate[0];
      var lat = coordinate[1];

      var currLowLongDif = 10000.0;
      var currLowLatDif = 10000.0;

      var longDiff= Math.abs(long-this.state.coord[0]);
      var latDiff= Math.abs(lat-this.state.coord[1]);
      if(longDiff < currLowLongDif && latDiff < currLowLatDif){
        currLowLongDif = longDiff;
        currLowLatDif = latDiff;
        this.state.locIndex = i;
      }
    }*/


    //compare all coordinates in coordArray with coord
    //set locIndex to the one with the closet coordinates

    /*def closest (num, arr):
    curr = arr[0]
    foreach val in arr:
        if abs (num - val) < abs (num - curr):
            curr = val
    return curr*/
    
    this.setChart(this.state.locIndex);
  });

}


  render() {
    const { timeChart } = this.state;
    //console.log(timeChart);

    /*if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
        <ActivityIndicator />
      </View>
      )
    }*/
    return (

        <View style = {styles.container}>
          <Text style={styles.title}> Pandemic </Text>
          <View style={{ height: 200}}>
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
            width={'40%'}
            height={300}
            gap={25}
            data={timeChart}
            padding={0}
            type="line"
            numberOfYAxisGuideLine={10}
            backgroundColor="rgba(90,90,90,1)"
            highlightColor="red"
            labelColor='black'
            primaryColor='red'/>
        </View>
        <Text style={styles.otherText}> {this.state.loc} </Text>
        <Text style={styles.otherText}>  </Text>
        <Button
            title = 'Use Current Location'
            onPress={() => this.submitLocation()}
        />


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
        textAlign: "center",
        top:0,
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
