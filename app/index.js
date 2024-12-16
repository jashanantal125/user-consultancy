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

import { Link, router, useSegments } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Image } from "react-native";
import PhoneInput from "react-native-phone-input";
import { useNavigation } from "@react-navigation/native";
const logo = require("../assets/images/krewlogo.png");

import socket from "../Socket/socket";
import { useSocket } from "../Socket/socket";
import { useLogin } from "../hooks/useLogin";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useAuthStore } from "../stores/authStore";
import * as SplashScreen from "expo-splash-screen";
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
  const { userEmail, hydrated } = useUserStore((state) => ({
    userEmail: state.userEmail,
    hydrated: state.hydrated,
  }));
  const { apiKey } = useAuthStore.getState();
  const segments = useSegments();
  const [isMounted, setIsMounted] = useState(false);
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
        // router.push("/dashboard");
        console.log(response.data.data.email);
        useUserStore
          .getState()
          .setUserEmail(response.data.data.email.toString());
      }
    } catch (error) {
      console.error(error.response.data);
      Alert.alert(error.response.data.message);
    }
  };

  useEffect(() => {
    // Mark as mounted after the app layout is ready
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (userEmail) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isMounted, router, segments, userEmail]);

  return null;
}
