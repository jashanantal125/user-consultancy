import { Text, StyleSheet, View, Pressable, Alert } from 'react-native';
import { mainPageStyles } from './main';
import { Link, router } from "expo-router";
import { useState, useRef } from 'react';
import { Image } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { useNavigation } from '@react-navigation/native';
const logo = require("../assets/images/favicon.png")
const whiteArrow = require("../assets/images/whiteArrow.png")
import useStore from './store';



export default function Index() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigation = useNavigation();
    const setSid = useStore((state) => state.setSid);
    // const verifyOtp = () => { 
    //     if (phoneNumber.length >13 ) {
    //         Alert.alert('Please Enter the correct number!')
    //     } else
    //     navigation.navigate('otpverify', {phoneNumber: phoneNumber}); 
    //   };  

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value)
    }

    const handleSubmit = async (event) => {
        var d = {

            "usr": phoneNumber.replace(/\D/g, '').slice(-10),
            "pwd": "Abcd@1234",
        };
        const res = await fetch("http://65.0.52.105:8006/api/method/consultant.api.loginOtp", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': localStorage.setItem('token')
            },
            body: JSON.stringify(d)
        });

        const data = await res.json();

        if (data.message.success_key == 1) {
            console.log(data.message)
            setSid(data.message.sid)
            // localStorage.setItem('token', JSON.stringify(data.message.api_key+":"+data.message.api_secret));
            console.log('otp has been sent!')
            navigation.navigate('otpverify', { phoneNumber: phoneNumber });
        }
        else {
            console.log('Sorry wrong number!')
        }
    }


    return (
        <View style={mainPageStyles.mainContainer}>
            <View style={mainPageStyles.container}>
                <Image style={mainPageStyles.logo} source={logo} />
                <Text style={mainPageStyles.title}>Astrotalk</Text>
            </View>
            <View style={mainPageStyles.firstChatContainer}>
                <Text style={mainPageStyles.firstChat}>
                    First chat with astrologer is FREE!
                </Text>
            </View>
            <View style={mainPageStyles.secondContainer}>
                <View style={mainPageStyles.phoneContainer}>
                    <PhoneInput
                        placeholder="Enter"
                        value={phoneNumber}
                        onChangePhoneNumber={handlePhoneNumber}
                        // defaultCountry = "in"
                        flagStyle={mainPageStyles.flag}
                        initialValue='91'

                    />
                </View>

                <Pressable onPress={handleSubmit} style={[
                    mainPageStyles.button,
                    { opacity: phoneNumber.length === 13 ? 1 : 0.5 }
                ]}
                    disabled={phoneNumber.length !== 13}>
                    <Text style={mainPageStyles.textInButton}>Get OTP</Text>
                </Pressable>

                <Image style={mainPageStyles.whiteArrow} source={whiteArrow} />
            </View>
            <View style={mainPageStyles.bottomContain} >
                <View style={mainPageStyles.firstTextContainer}>
                    <Text style={mainPageStyles.numberHeading}>
                        100%
                    </Text>
                    <Text style={mainPageStyles.firstText2}>
                        Privacy
                    </Text>
                </View>
                <View style={mainPageStyles.line}>
                </View>
                <View>
                    <Text style={mainPageStyles.numberHeading}>
                        10000+
                    </Text>
                    <Text style={mainPageStyles.secondText2}>
                        Top astrologers
                        of India
                    </Text>
                </View>
                <View style={mainPageStyles.line}>
                </View>
                <View>
                    <Text style={mainPageStyles.numberHeading}>
                        3cr+
                    </Text>
                    <Text style={mainPageStyles.thirdText2}>
                        Happy
                        Customers
                    </Text>

                </View>

            </View>
        </View>
    );
}
