import React, { Component } from 'react';
import { Button, Text, View, StyleSheet,TextInput } from 'react-native';
import Swiper from 'react-native-swiper'; // 1.5.13
import PureChart from 'react-native-pure-chart';

export default class App extends Component {

  // Create States to Store Variables

  constructor(props) {
    super(props);
    this.state = {
      countries: [],
    };
  }

  componentDidMount() {
    this.getCaseCount();
  }

//CoronaVirus API Goes here
getCaseCount(){
  fetch(`https://coronadatascraper.com/timeseries-byLocation.json`)
  .then(response => response.json())
  .then(data => this.setState({ countries: Object.keys(data) }));
}
//Mapping Code
/*{countries.map(country =>
          <Text key={country.ObjectID}>
            {country.country} !|! </Text>
        )} */

  render() {
      const { countries } = this.state;
        return (<Swiper style={styles.wrapper} showsButtons={true}>

        <View style = {styles.container}>
        <Text style={styles.title}> Pandemic </Text>
        <Text style={styles.yourLocationTitle}> Your Location: </Text>
        <Text style={styles.locationText}> First Country: {countries[0]}</Text>
        </View>

        <View style = {styles.container}>

        {/*Documentation for Graph:  https://github.com/oksktank/react-native-pure-chart     */}
        <PureChart data={[{x: 1, y: 2}]} type='line' />
        </View>
        <View>
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
