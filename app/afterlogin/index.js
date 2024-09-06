import { Text, StyleSheet, View } from 'react-native';
import React from 'react';
import { globalStyles } from '../dashboard/global'
import { TextInput, Button, Pressable, Alert, Image, ImageBackground} from 'react-native';
import { useState } from 'react';
import { afterLoginStyles } from './afterlogin';
import { useNavigation } from 'expo-router/build/useNavigation';
const logo = require("../../assets/images/favicon.png")


export default function AfterLogin () {

    const navigation = useNavigation()

    const handleExplore = () => {
        navigation.navigate('dashboard'); 
    }

    return(
        <View style={afterLoginStyles.container}>
            <View style={afterLoginStyles.contentContainer}>
                <Image style={afterLoginStyles.logo} source={logo}/>
                <Text style={afterLoginStyles.title}>Congratulations You got a</Text>
                <Text style={afterLoginStyles.title2}>Free Chat!</Text>
                <Pressable style={afterLoginStyles.button}>
                    <Text style={afterLoginStyles.buttonText} >Start Free Chat</Text>
                </Pressable>
                <Pressable style={afterLoginStyles.exploreText} onPress={handleExplore}><Text>Explore more</Text></Pressable>
            </View>
        </View>
    )
}
