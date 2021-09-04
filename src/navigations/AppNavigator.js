import * as React from 'react' 
import { createStackNavigator } from '@react-navigation/stack'
import 'react-native-gesture-handler'

import DashboardScreen from "../screens/DashboardScreen"

const Stack = createStackNavigator();
const Dashboard = ({navigation}) => <DashboardScreen navigation={navigation}></DashboardScreen> 

export default function AppNavigator() {
    return (
        <Stack.Navigator >
			<Stack.Screen name="DashboardScreen" component={Dashboard} options={{headerShown: false}}/>
	    </Stack.Navigator >
    )
}