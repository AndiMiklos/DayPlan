import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AuthNavigator from './AuthNavigator'
import AppNavigator from './AppNavigator'
import AuthProvider from './AuthProvider'
import { UserContext } from './AuthProvider'

export default function Routes() {
    const {user, setUser} = useContext(UserContext)
    return (
        <NavigationContainer>
            {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}