import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import 'react-native-gesture-handler'

import RegisterScreen from '../screens/RegisterScreen'
import LoginScreen from '../screens/LoginScreen'

const Stack = createStackNavigator();
const Register = ({ navigation }) => <RegisterScreen navigation={navigation} />
const Login = ({ navigation }) => <LoginScreen navigation={navigation} />

export default function AuthNavigator() {
    return (
      <Stack.Navigator >
        <Stack.Screen name="LoginScreen" component={Login} options={{headerShown: false}}/>
				<Stack.Screen name="RegisterScreen" component={Register} options={{headerShown: false}}/>
		  </Stack.Navigator >
    )
}