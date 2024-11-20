import { Text, StyleSheet, View, Pressable, Alert } from "react-native";
import { mainPageStyles } from "./main";
import { Link, router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Image } from "react-native";
import PhoneInput from "react-native-phone-input";
import { useNavigation } from "@react-navigation/native";
const logo = require("../assets/images/krewlogo.png");
const whiteArrow = require("../assets/images/whiteArrow.png");
const lowerText = require("../assets/images/firstText.png");
const crew = require("../assets/images/workers.png");
import useStore from "./store";
import socket from "../Socket/socket";
import { useSocket } from "../Socket/socket";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Index() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();
  const setSid = useStore((state) => state.setSid);
  const socket = useSocket();
  // const verifyOtp = () => {
  //     if (phoneNumber.length >13 ) {
  //         Alert.alert('Please Enter the correct number!')
  //     } else
  //     navigation.navigate('otpverify', {phoneNumber: phoneNumber});
  //   };

  // useEffect(() => {
  //     if (socket?.connected) {
  // 		socket?.on("latest_chat_updates", (data) => {
  // 			// eslint-disable-next-line @typescript-eslint/no-unused-vars
  // 			const { room, ...chat } = data;
  //             console.log()

  // 		})};
  // })

  const handlePhoneNumber = (value) => {
    setPhoneNumber(value);
  };

  const handleSubmit = async (event) => {
    var d = {
      // "mobile_no": "0101010101"
      usr: phoneNumber.replace(/\D/g, "").slice(-10),
      pwd: "Abcd@1234",
    };
    const res = await fetch(
      "http://65.0.52.105:8006/api/method/consultant.api.loginOtp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': localStorage.setItem('token')
        },
        body: JSON.stringify(d),
      }
    );

    const data = await res.json();
    if (data.message.success_key === 1) {
      setSid(data.message.sid);
      // localStorage.setItem('token', JSON.stringify(data.message.api_key+":"+data.message.api_secret));
      navigation.navigate("otpverify", { phoneNumber: phoneNumber });
    } else {
      console.log("Sorry wrong number!");
    }
  };

  return (
    <View style={mainPageStyles.mainContainer}>
      <View style={mainPageStyles.container}>
        <View style={mainPageStyles.imageContainer}>
          <Image style={mainPageStyles.logo} source={logo} />
        </View>
      </View>

      <View style={mainPageStyles.secondContainer}>
        <View style={mainPageStyles.inputContainer}>
          <Text style={mainPageStyles.loginText}>Please enter your number</Text>
          <View style={mainPageStyles.phoneContainer}>
            <PhoneInput
              textProps={{
                placeholder: "Enter a phone number...",
              }}
              textStyle={{
                fontSize: 18,
                color: "#000",
              }}
              value={phoneNumber}
              onChangePhoneNumber={handlePhoneNumber}
              // defaultCountry = "in"
              flagStyle={mainPageStyles.flag}
              initialValue="91"
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            style={[
              mainPageStyles.button,
              { opacity: phoneNumber.length === 13 ? 1 : 0.5 },
            ]}
            disabled={phoneNumber.length !== 13}
          >
            <Text style={mainPageStyles.textInButton}>Get OTP</Text>
            <AntDesign name="arrowright" size={24} color="white" />
          </Pressable>
        </View>
        <View style={mainPageStyles.adviseImageContainer}>
          <Image style={mainPageStyles.lowerImage} source={lowerText} />
        </View>
        <View style={mainPageStyles.crewImageContainer}>
          <Image style={mainPageStyles.crew} source={crew} />
        </View>
      </View>

      {/* <View style={mainPageStyles.bottomContain} >

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

                </View> */}

      {/* </View> */}
    </View>
  );
}
