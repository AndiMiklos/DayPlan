import React, {useContext} from "react"
import { TouchableOpacity, Text, View, StyleSheet } from "react-native"
import AuthenticatorService from "../services/AuthenticatorService"
import { UserContext } from "../navigations/AuthProvider"

const DashboardScreen = ({navigation}) => {
    const {user, setUser} = useContext(UserContext)

    function logout () {
        try {
            AuthenticatorService.logout()
            setUser(null)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style = {styles.view}>
            <Text>Welcome to the dashboard</Text>
            <TouchableOpacity 
                        onPress = {logout}
                    >
                        <Text style = {styles.text}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
    }
})

export default DashboardScreen