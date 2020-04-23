import React, { Component } from 'react';
import { Button, Text, View, StyleSheet,TextInput, FlatList } from 'react-native';
import Swiper from 'react-native-swiper'; // 1.5.13
import PureChart from 'react-native-pure-chart';
import { List, ListItem, SearchBar } from "react-native-elements";

export default class App extends Component {

  // Create States to Store Variables
  constructor(props) {

    super(props);

    this.state = {
      custLoc: '',
      custLocTemp: '',
      latitude: '',
      longitude: '',
      latitudeTemp: '',
      longitudeTemp: '',
      countries: [],
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
    global.custLoc = "";
    global.lat = "";
    global.lon = "";
  }

  componentDidMount() {
    this.makeRemoteRequest();
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

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  getLocation(){
    this.setState({
      latitudeTemp:this.state.latitude,
      longitudeTemp:this.state.longitude,
    })
  }

  

 submitLocation() {

    global.custLoc = this.state.custLocTemp;
}

getCaseCount(){
  global.lat = parseInt(this.state.latitude);
  global.lon = parseInt(this.state.longitude);
  fetch(`https://coronadatascraper.com/timeseries-byLocation.json`)
  .then(response => response.json())
  .then(data => this.setState({ countries: Object.keys(data) }));
}

makeRemoteRequest = () => {
  const { page, seed } = this.state;
  const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
  this.setState({ loading: true });

  fetch(url)
    .then(res => res.json())
    .then(res => {
      this.setState({
        data: page === 1 ? res.results : [...this.state.data, ...res.results],
        error: res.error || null,
        loading: false,
        refreshing: false
      });
    })
    .catch(error => {
      this.setState({ error, loading: false });
    });
};

handleRefresh = () => {
  this.setState(
    {
      page: 1,
      seed: this.state.seed + 1,
      refreshing: true
    },
    () => {
      this.makeRemoteRequest();
    }
  );
};

handleLoadMore = () => {
  this.setState(
    {
      page: this.state.page + 1
    },
    () => {
      this.makeRemoteRequest();
    }
  );
};

renderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "86%",
        backgroundColor: "#CED0CE",
        marginLeft: "14%"
      }}
    />
  );
};

renderHeader = () => {
  return <SearchBar placeholder="Type Here..." lightTheme round />;
};

renderFooter = () => {
  if (!this.state.loading) return null;

  return (
    <View
      style={{
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#CED0CE"
      }}
    >
      <ActivityIndicator animating size="large" />
    </View>
  );
};
  render() {

        const { countries } = this.state;
        return (<Swiper style={styles.wrapper} showsButtons={true}>

        <View style = {styles.container}>
        <Text style={styles.title}> Pandemic </Text>
        <Text style={styles.otherText}> Location: </Text>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              roundAvatar
              title={`${item.name.first} ${item.name.last}`}
              subtitle={item.email}
              avatar={{ uri: item.picture.thumbnail }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </List>
        <Text style={styles.otherText}> <Text style={styles.otherText}> First Country: {countries[0]} </Text></Text>
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

        <Text style={styles.title}>Graph</Text>
        
        {/*Documentation for Graph:  https://github.com/oksktank/react-native-pure-chart     */}
        <PureChart data={[ {x: '2018-01-01', y: 30}, {x: '2018-01-02', y: 200}, {x: '2018-01-03', y: 170}, {x: '2018-01-04', y: 250}, {x: '2018-01-05', y: 10} ]} type='line' />
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
        color: 'white',
        fontSize: 50,
        textAlign: "center",
        position:"absolute",
        top:150,
      },
      otherText: {
        color: 'white',
        fontSize: 25,
      },
      container: {
        flex: 1,
        backgroundColor: '#001F5B',
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
