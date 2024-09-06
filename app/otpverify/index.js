import { Text, StyleSheet, View, Pressable, TextInput, Button,Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Link, router } from "expo-router";
import { useState, useRef, useEffect } from 'react';
import { Image } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { otpVerifyStyles } from './registration'
import { OtpInput } from "react-native-otp-entry";
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtpVerify() {
  const [otp, setOtp] = useState("")
  const route = useRoute();
  const phoneNumber = route.params.phoneNumber;
  const [countdown, setCountdown] = useState(60);
  const Navigation = useNavigation();

  // const handleSubmit = () => {
  //   if (otp.length !== 4) {
  //     Alert.alert('Incomplete OTP', 'Please enter all 4 numbers!');
  //   } else {
  //     Navigation.navigate('afterlogin');
  //   }
  // }

  const handleSubmit = async (event) => {
    var d = {
      "usr": phoneNumber.replace(/\D/g, '').slice(-10),
      "pwd": "Abcd@1234",
    };
    const res = await fetch("http://65.0.52.105:8006/api/method/consultant.api.login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': localStorage.setItem('token')
      },
      body: JSON.stringify(d)
    });

    const data = await res.json();

    if(data.message.success_key==1){
        console.log(data.message.message)
        await AsyncStorage.setItem('token', JSON.stringify(data.message.api_key+":"+data.message.api_secret));
        AsyncStorage.setItem('sid', JSON.stringify(data.message.sid));
        console.log("Login successfull")
        Navigation.navigate('afterlogin');
    }else{
      alert("please enter correct username password")
    }
  };

  useEffect(() => {4
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      // Clean up the timer
      return () => clearTimeout(timer);
    }
  }, [countdown]);



  return (
    <View>
      <Text style={otpVerifyStyles.otpSentText}>OTP has been sent to {phoneNumber}</Text>
      <View style={otpVerifyStyles.otpView}>
        <OtpInput
          textInputProps={otp}
          numberOfDigits={4}
          focusColor='#FF1D58'
          onTextChange={setOtp}
        />
      </View>
      <Pressable onPress={handleSubmit} style={[
          otpVerifyStyles.button,
          { opacity: otp.length=== 4 ? 1 : 0.5 }
        ]}
        disabled={otp.length !== 4}>
        <Text style={otpVerifyStyles.buttonText}>SUBMIT</Text>
      </Pressable>
      {countdown >0 ? (<Text style={otpVerifyStyles.resendText}>
        Resend OTP available in {countdown}
      </Text>
      ) : (
        <Pressable style={otpVerifyStyles.resendButton}>
          <Text>
            Resend OTP
          </Text>
        </Pressable>
      )}
    </View>
  
  )
}
