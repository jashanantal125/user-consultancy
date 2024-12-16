import {
  Text,
  StyleSheet,
  View,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { mainPageStyles } from "./main";
import { Link, router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Image } from "react-native";
import PhoneInput from "react-native-phone-input";
import { useNavigation } from "@react-navigation/native";
const logo = require("../../assets/images/krewlogo.png");

import { useSocket } from "../../Socket/socket";
import { useLogin } from "../../hooks/useLogin";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useAuthStore } from "../../stores/authStore";

const { height } = Dimensions.get("window");

export default function Index() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  //   const setSid = useStore((state) => state.setSid);
  const socket = useSocket();
  const loginApi = useLogin();
  const { username, setUsername, userTempNumber, setUserTempNumber } =
    useUserStore();
  const router = useRouter();
  const userEmail = useUserStore((state) => state.userEmail);
  const setApiKey = useAuthStore((state) => state.setApiKey);
  const setApiSecret = useAuthStore((state) => state.setApiSecret);
  const { clearAuth } = useAuthStore.getState();
  const handlePhoneNumber = (value) => {
    setUserTempNumber(value);
    // setPhoneNumber(value);98
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError("");
    }
    setEmail(email);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    try {
      const loginCredentials = {
        usr: email,
        pwd: password,
        usertype: "USER",
      };
      const response = await loginApi.mutateAsync(loginCredentials);
      if (response.data) {
        setApiKey(response.data.data.api_key.toString());
        setApiSecret(response.data.data.api_secret.toString());
        useUserStore
          .getState()
          .setUserEmail(response.data.data.email.toString());
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error.response.data);
      Alert.alert(error.response.data.message);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  useEffect(() => {
    clearAuth();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View style={mainPageStyles.topView} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: 20,
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
        automaticallyAdjustKeyboardInsets={true}
      >
        <View>
          <View style={mainPageStyles.container}>
            <Image source={logo} style={mainPageStyles.logo} />
          </View>
          <View style={mainPageStyles.firstChatContainer}>
            <Text style={mainPageStyles.logintitle}>Welcome Back!</Text>
            <Text style={mainPageStyles.loginsubtitle}>
              Log in with your mobile OTP for secure access.
            </Text>
          </View>

          <View style={mainPageStyles.inputContainer}>
            <View>
              <TextInput
                style={[
                  mainPageStyles.inputField,
                  emailError ? mainPageStyles.errorInput : null,
                ]}
                placeholder="Email Id"
                placeholderTextColor={Colors.grey.light}
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={mainPageStyles.errorText}>{emailError}</Text>
              ) : null}
            </View>
            <View style={mainPageStyles.passWordContainer}>
              <TextInput
                style={mainPageStyles.passwordField}
                placeholder="Password"
                placeholderTextColor={Colors.grey.light}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={mainPageStyles.iconContainer}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color={Colors.primary}
                />
              </Pressable>
            </View>
            <Pressable
              onPress={handleSubmit}
              style={[
                mainPageStyles.button,
                { opacity: isEmailValid(email) && password ? 1 : 0.5 },
              ]}
              disabled={!isEmailValid(email) || !password}
            >
              {loginApi.isPending ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <Text style={mainPageStyles.textInButton}>Login</Text>
              )}
            </Pressable>
          </View>
          <View style={mainPageStyles.signupContainer}>
            <Text style={mainPageStyles.signUpMetaText}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => handleRegister()}>
              <Text style={mainPageStyles.signUpText}>Sign Up.</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors.primary,
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
          }}
        >
          <View style={mainPageStyles.bottomContain}>
            <View style={{ flex: 1 }}>
              <Text style={mainPageStyles.numberHeading}>100%</Text>
              <Text style={mainPageStyles.firstText2}>Privacy</Text>
            </View>
            <View style={mainPageStyles.line} />
            <View style={{ flex: 1 }}>
              <Text style={mainPageStyles.numberHeading}>10,000+</Text>
              <Text style={mainPageStyles.secondText2}>
                Top astrologers of India
              </Text>
            </View>
            <View style={mainPageStyles.line} />
            <View style={{ flex: 1 }}>
              <Text style={mainPageStyles.numberHeading}>3cr+</Text>
              <Text style={mainPageStyles.thirdText2}>Happy Customers</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
