import React, { useContext } from "react"
import axios from 'axios'
import { ImageBackground, StyleSheet, SafeAreaView, TextInput, View, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import AuthenticatorService from "../services/AuthenticatorService"
import { UserContext } from "../navigations/AuthProvider"
const background = require("../../assets/background_1.jpg")

const LoginScreen = ({navigation}) => {
    const [email, onChangeEmail] = React.useState()
    const [password, onChangePassword] = React.useState()
    const {user, setUser} = useContext(UserContext)
    async function login () {
        try {
            console.log(email, password)
          let response = await AuthenticatorService.login(email, password)
          let json = await response.json()
          alert(json.msg)
          console.log(json)
          if (json.success) {
              console.log('successfull login')
              let userInfoResponse = await AuthenticatorService.userInfo()
              let currentUser = await userInfoResponse.json()
              setUser(currentUser)
          }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ImageBackground
            style = {styles.background}
            source = {background}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style = {styles.view}>
                    <SafeAreaView>
                        <TextInput
                            placeholder = 'Email'
                            placeholderTextColor = '#ffffff'
                            style = {styles.input}
                            value = {email}
                            onChangeText = {onChangeEmail}
                        />
                    </SafeAreaView>
                    <SafeAreaView>
                        <TextInput
                            placeholder = 'Password'
                            placeholderTextColor = '#ffffff'
                            style = {styles.input}
                            value = {password}
                            secureTextEntry
                            onChangeText = {onChangePassword}
                        />
                    </SafeAreaView>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = {login}
                    >
                        <Text style = {styles.text}>Login</Text>
                    </TouchableOpacity>
                    <Text style = {styles.text} onPress = {() => navigation.navigate('RegisterScreen')}>Don't have an account yet? Register here!</Text>
                </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    input: {
        height: 60,
        margin: 15,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#ffffff',
        backgroundColor: 'transparent',
        padding: 10,
        color: '#ffffff'
    },
    view: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        height: 65,
        margin: 15,
        borderWidth: 1,
        borderColor: '#ffffff',
        backgroundColor: 'transparent',
        padding: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%'
    },
    text: {
        color: '#ffffff',
        fontSize: 20,
        alignSelf: 'center'
    }
})

export default LoginScreen