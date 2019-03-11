/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: ' ',
    };
  }

  componentWillMount() {
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        '984438365877-tpns55cllr7b2jn37s65g8mjghvv1ci0.apps.googleusercontent.com',
    });
    this._getCurrentUser();
  }

  _getCurrentUser = async () => {
    //May be called eg. in the componentDidMount of your main component.
    //This method returns the current user
    //if they already signed in and null otherwise.
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo: userInfo });
    } catch (error) {
      console.error(error);
    }
  };

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      userInfo = await GoogleSignin.signIn();
      console.error(userInfo);

      await this.setState({ userInfo: userInfo });
    } catch (error) {
      console.log('Message', error.message);
      Alert.alert("1");
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("SIGN_IN_CANCELLED");
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("IN_PROGRESS");
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("PLAY_SERVICES_NOT_AVAILABLE");
        console.log('Play Services Not Available or Outdated');
      } else {
        Alert.alert("Some Other Error Happened");
        console.log('Some Other Error Happened');
      }
    }
  }

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await this.setState({ userInfo: ' ' }); // Remove the user from your app's state as well
      Alert.alert("Logged Out Successfully...");
    } catch (error) {
      console.error(error);
    }
  };

  _revokeAccess = async () => {
    //Remove your application from the user authorized applications.
    try {
      await GoogleSignin.revokeAccess();
      console.log('deleted');
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native Google SignIn!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={{ flex: 1 }}>{JSON.stringify(this.state.userInfo)}</Text>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => this._signIn()}
        //disabled={this.state.isSigninInProgress} 
        />
        <TouchableOpacity style={{ height: 40, width: 180, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => this._signOut()}>
          <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Logout</Text>
        </TouchableOpacity>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
