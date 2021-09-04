import React from "react"
import { ImageBackground, StyleSheet, SafeAreaView, TextInput, View, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Modal } from "react-native"
import AuthenticatorService from "../services/AuthenticatorService"
const background = require("../../assets/background.jpg")

const RegisterScreen = ({navigation}) => {
    const [name, setName] = React.useState()
    const [email, setEmail] = React.useState()
    const [password, setPassword] = React.useState()
    const [retypePassword, setRetypePassword] = React.useState()
    const [validPass, setValidPass] = React.useState(true)
    async function register () {
        try {
          const emailRegex = /\S+@\S+\.\S+/
          if (!emailRegex.test(email)) {
              alert('Email not valid')
          }
          else if (password !== retypePassword) {
              alert('Passwords do not match')
          } else {
            let response = await AuthenticatorService.register(name, email, password)
            let json = await response.json()
            console.log('resp:', response)
            console.log('json:', json)
            if(json.msg === 'Registered successfully') {
                navigation.navigate('LoginScreen')
                alert(json.msg + '\nYou can login now')
            } else {
                alert(json.msg)
            }
          }
        } catch (error) {
            console.log(error)
            console.log(error.msg)
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
                            placeholder = 'Name'
                            placeholderTextColor = '#ffffff'
                            style = {styles.input}
                            value = {name}
                            onChangeText = {setName}
                        />
                    </SafeAreaView>
                    <SafeAreaView>
                        <TextInput
                            placeholder = 'Email'
                            placeholderTextColor = '#ffffff'
                            style = {styles.input}
                            value = {email}
                            onChangeText = {setEmail}
                        />
                    </SafeAreaView>
                    <SafeAreaView>
                        <TextInput
                            placeholder = 'Password'
                            placeholderTextColor = '#ffffff'
                            style = {styles.input}
                            value = {password}
                            secureTextEntry
                            onChangeText = {setPassword}
                        />
                    </SafeAreaView>
                    <SafeAreaView>
                        <TextInput
                            placeholder = 'Retype password'
                            placeholderTextColor = '#ffffff'
                            style = {styles.input}
                            value = {retypePassword}
                            secureTextEntry
                            onChangeText = {setRetypePassword}
                        />
                    </SafeAreaView>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = {register}
                    >
                        <Text style = {styles.text}>Register</Text>
                    </TouchableOpacity>
                    <Text style = {styles.text} onPress = {() => navigation.navigate('LoginScreen')}>Already have an account? Login here!</Text>
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

export default RegisterScreen