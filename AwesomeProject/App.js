import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Button,
  Alert,
} from 'react-native';

// Utils
import { getLocationId, getWeather, getCurrentTemperature, getNextTemperature} from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import getIconForWeather from './utils/getIconForWeather';

// CLASS
export default class App extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      loading: false,
      error: false,
      location: '',
      weather: '',
      current: 0,
      timeupdate: '',
      next: 0
    };

  }
  // Life cycle
  componentDidMount() {
    this.handleUpdateLocation('Ho Chi Minh City');
  }

  // Update current location
  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {

        const ID = await getLocationId(city);
        const { location, weather } = await getWeather(ID);
        const { current, timeupdate } = await getCurrentTemperature();
        const next = (await getNextTemperature()).next;

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          current,
          timeupdate,
          next
        });

      } catch (e) {

        this.setState({
          loading: false,
          error: true,
        });

      }
    });
  };

  // RENDERING
  render() {

    // GET values of state
    const { loading, error, location, weather, current, timeupdate, next } = this.state;
    const updateTemprature = async () => {
      this.setState({ loading: true }, async () => {
        try {
          const { location, weather } = await getWeather(1252431);
          const { current, timeupdate } = await getCurrentTemperature();
          const next = (await getNextTemperature()).next;
          this.setState({
            loading: false,
            error: false,
            location,
            weather,
            current,
            timeupdate,
            next
          });
  
        } catch (e) {
  
          this.setState({
            loading: false,
            error: true,
          });
  
        }
      });
    };
    const createTwoButtonAlert = () =>
      Alert.alert(
        "Weather Future!",
        "Temperature after 30 minutes is: " + Number((next).toFixed(1)) + "°C",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
    );
    
    // Activity
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">

        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >

          <View style={styles.detailsContainer}>

            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    😞 Could not load your city or weather. Please try again later...
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {getIconForWeather(weather)} {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                       {weather}
                    </Text>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {current + "°C"} 
                    </Text>
                  </View>
                )}

                <Button 
                  style={[styles.smallText, styles.textStyle]}
                  title="Get current temperature" onPress={updateTemprature}>
                </Button>

                <Text style={[styles.superSmallText, styles.textStyle]}/>

                <Button 
                  style={[styles.smallText, styles.textStyle]}
                  title="Get weather future"
                  onPress={createTwoButtonAlert}>
                </Button>

                {!error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Last update: {timeupdate}
                  </Text>
                )}

              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}



/* StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: '#4ba37b',
    width: 100,
    borderRadius: 500,
    alignItems: 'center',
    marginTop: 100,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  superSmallText: {
    fontSize: 5,
  },
});
