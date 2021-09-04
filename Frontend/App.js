import React from 'react';
import {View, Text} from 'react-native'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import Routes from './src/navigations/Routes'
import Providers from './src/navigations';

export default function App() {
  return (
    <Providers />
  );
}
