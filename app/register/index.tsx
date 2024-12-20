import Header from "@/components/Header";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import DefaultProfile from "../../assets/images/default_profile_blue.jpg";
import { useRegister } from "../../hooks/useRegister";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import PhoneInput from "react-native-phone-input";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import Dropdown from "@/components/Dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUploadFile } from "../../hooks/useUploadFile";
import { ConstantStrings } from "@/constants/ConstantStrings";
import { useGetLanguage } from "../../hooks/useGetLanguage";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";

const Register = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [image, setImage] = useState();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const router = useRouter();
  const showTimePicker = () => {
    setTimePickerVisibility(true);
    if (!selectedTime) {
      setSelectedTime(new Date());
    }
  }; // Show time picker```javascript

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  };
  const hideTimePicker = () => setTimePickerVisibility(false);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState();
  const [currentAddress, setCurrentAddress] = useState();
  const [currentCoords, setCurrentCoords] = useState();
  const [birthPlace, setBirthPlace] = useState();
  const [birthPlaceCoords, setBirthPlaceCoords] = useState();
  const [languageOptions, setLanguageOptions] = useState();

  const googleApiKey = Constants.expoConfig.extra.googleApiKey;
  const setApiKey = useAuthStore((state) => state.setApiKey);
  const setApiSecret = useAuthStore((state) => state.setApiSecret);
  const uploadFile = useUploadFile();

  const handleCurrentAddress = (data, details) => {
    setCurrentAddress(data?.description);
    setCurrentCoords(details?.geometry?.location);
  };

  const handleBirthPlace = (data, details) => {
    setBirthPlace(data?.description);
    setBirthPlaceCoords(details?.geometry?.location);
  };

  const register = useRegister();
  const getLanguage = useGetLanguage();
  const validateEmail = (email) => {
    1;
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
  const handleDOB = (event, date) => {
    if (Platform.OS === "ios") {
      // On iOS, update tempDate while the spinner is active
      if (date) setTempDate(date);
    } else {
      // On Android, directly set the selectedDate
      setSelectedDate(date || selectedDate);
      hideDatePicker();
    }
  };

  const handleDOT = (event, data) => {
    if (Platform.OS === "ios") {
      if (data) setTempTime(data);
    } else {
      setSelectedTime(data || selectedTime);
      hideTimePicker();
    }
  };
  const confirmDateSelection = () => {
    setSelectedDate(tempDate);
    hideDatePicker();
  };

  const confirmTimeSelection = () => {
    setSelectedTime(tempTime);
    hideTimePicker();
  };
  const handleUploadMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    const uri = result?.assets[0].uri;
    if (result.canceled) return;

    // dispatch(setMediaFile(uploadResponse.data.data.location));
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (fileInfo && fileInfo.size !== undefined) {
        const fileSizeInBytes = fileInfo.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

        if (fileSizeInMB <= 3) {
          const body = new FormData();
          body.append("file", {
            uri: uri,
            name: "photo.png",
            filename: "imageName.png",
            type: "image/png",
          });
          body.append("fileType", "MEDIA");

          const uploadResponse = await uploadFile.mutateAsync(body);

          setImage(uploadResponse.data.message.file_url);
          //  setMedia((prevMedia) => [
          //    ...prevMedia,
          //    uploadResponse.data.data.location,
          //  ]);
        } else {
          Alert.alert(
            "File Size Exceeded",
            "Please select an image file with a size less than or equal to 3 MB."
          );
          return;
        }
      } else {
        console.error("File info or file size is undefined.");
      }
    } catch (error) {
      console.error("Error occurred while getting file info:", error);
    }
  };
  const fetchLanguage = useCallback(async () => {
    try {
      const response = await getLanguage.mutateAsync();

      setLanguageOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching language data:", error);
    }
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "We need permission to access your gallery to pick an image."
          );
        }
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      setConfirmPasswordError(
        "Password must be at least 8 characters, contain at least one number, and one special character."
      );
    } else if (password && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    fetchLanguage();
  }, [fetchLanguage]);

  const buttonDisable =
    !firstName ||
    !email ||
    !birthPlace ||
    !selectedDate ||
    !selectedTime ||
    !currentAddress ||
    !phone ||
    emailError ||
    !password ||
    password !== confirmPassword ||
    !selectedLanguage ||
    selectedLanguage == "null" ||
    !image;

  const handleSubmit = async () => {
    // router.navigate("/dashboard");
    try {
      const registerData = {
        first_name: firstName,
        last_name: secondName,
        email: email,
        mobile_no: phone,
        birth_date: moment(selectedDate).format("YYYY-MM-DD"),
        place_of_birth: birthPlace,
        current_place: currentAddress,
        language: selectedLanguage?.language_name,
        birth_time: moment(selectedTime).format("HH:mm:ss"),
        password: password,
        user_image: image,
      };

      const response = await register.mutateAsync(registerData);
      // if(response.status)
      if (response.status == 200) {
        setApiKey(response.data.data.api_key.toString());
        setApiSecret(response.data.data.api_secret.toString());
        useUserStore
          .getState()
          .setUserEmail(response.data.data.email.toString());
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error.response.data.message);
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Register" background="#fff" onBackPress={router.back} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.contentContainer}>
            <View style={styles.scrollViewChild}>
              <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                  {image ? (
                    <Image
                      source={{ uri: ConstantStrings.url.base_url + image }}
                      style={styles.image}
                    />
                  ) : (
                    <Image source={DefaultProfile} style={styles.image} />
                  )}
                </View>
                <Feather
                  name="edit"
                  size={24}
                  color={Colors.primary}
                  style={styles.editIcon}
                  onPress={() => handleUploadMedia()}
                />
              </View>

              <View style={styles.inputFieldContainers}>
                <View style={styles.inputContainer}>
                  <Text>First Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="enter first name"
                    placeholderTextColor={Colors.grey.light}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text>Last Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="enter second name"
                    placeholderTextColor={Colors.grey.light}
                    value={secondName}
                    onChangeText={setSecondName}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text>Email</Text>
                  <TextInput
                    style={[
                      styles.inputField,
                      emailError ? styles.errorInput : null, // Highlight border if there's an error
                    ]}
                    placeholder="enter email id"
                    placeholderTextColor={Colors.grey.light}
                    value={email}
                    onChangeText={validateEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text>Phone</Text>

                  <PhoneInput
                    value={phone}
                    onChangePhoneNumber={setPhone}
                    initialValue="91"
                    textProps={{
                      placeholder: "Enter a phone number...",
                    }}
                    textStyle={{
                      fontSize: 16,
                    }}
                    style={styles.phoneContainer}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text>DOB</Text>

                  <View>
                    <TouchableOpacity
                      style={styles.dateInputField}
                      onPress={showDatePicker}
                    >
                      <Text
                        style={
                          selectedDate ? styles.inputText : styles.placeHolder
                        }
                      >
                        {selectedDate
                          ? moment(selectedDate).format("YYYY-MM-DD") // Display selected date
                          : "select date of birth"}
                      </Text>
                      <MaterialIcons
                        name="calendar-today"
                        size={24}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                    {isDatePickerVisible && (
                      <>
                        <DateTimePicker
                          mode="date"
                          onChange={handleDOB}
                          value={selectedDate}
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
                          maximumDate={new Date()}
                        />
                        {Platform.OS === "ios" && (
                          <View style={styles.iosControls}>
                            <Button
                              title="Confirm"
                              onPress={confirmDateSelection}
                              textStyle={{ fontSize: 12 }}
                              style={{
                                paddingVertical: 8,
                                paddingHorizontal: 10,
                              }}
                            />
                            <Button
                              title="Cancel"
                              onPress={() => hideDatePicker()}
                              textStyle={{ fontSize: 12 }}
                              style={{
                                paddingVertical: 8,
                                paddingHorizontal: 10,
                              }}
                            />
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text>TOB</Text>
                  <TouchableOpacity
                    style={styles.dateInputField}
                    onPress={showTimePicker} // Show the time picker when pressed
                  >
                    <Text
                      style={
                        selectedTime ? styles.inputText : styles.placeHolder
                      }
                    >
                      {selectedTime
                        ? moment(selectedTime).format("hh:mm A") // Display formatted time
                        : "select time of birth"}
                      {/* Show only time */}
                    </Text>
                    <MaterialIcons
                      name="calendar-today"
                      size={24}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                  {isTimePickerVisible && (
                    <>
                      <DateTimePicker
                        mode="time"
                        onChange={handleDOT}
                        value={selectedTime}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                      />
                      {Platform.OS === "ios" && (
                        <View style={styles.iosControls}>
                          <Button
                            title="Confirm"
                            onPress={confirmTimeSelection}
                            textStyle={{ fontSize: 12 }}
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 10,
                            }}
                          />
                          <Button
                            title="Cancel"
                            onPress={() => hideTimePicker()}
                            textStyle={{ fontSize: 12 }}
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 10,
                            }}
                          />
                        </View>
                      )}
                    </>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Text>Place of birth</Text>

                  <GooglePlacesAutocomplete
                    placeholder="enter place of birth"
                    onPress={handleBirthPlace}
                    query={{
                      key: googleApiKey,
                      language: "en",
                      region: "in",
                    }}
                    fetchDetails={true}
                    styles={{
                      container: {
                        zIndex: 1,
                        flex: 1,
                      },
                      textInput: {
                        flex: 1,
                        borderWidth: 2,
                        borderColor: Colors.primary,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 12,
                        fontSize: 16,
                      },
                      listView: {
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,

                        elevation: 5,
                        backgroundColor: "#fff",
                      },
                      poweredContainer: {
                        height: 0,
                        borderColor: "#fff",
                      },
                      powered: {
                        height: 0,
                      },
                      separator: {
                        height: 0,
                      },
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text>Current address</Text>

                  <GooglePlacesAutocomplete
                    placeholder="enter current address"
                    onPress={handleCurrentAddress}
                    query={{
                      key: googleApiKey,
                      language: "en",
                      region: "in",
                    }}
                    fetchDetails={true}
                    styles={{
                      container: {
                        zIndex: 1,
                        flex: 1,
                      },
                      textInput: {
                        flex: 1,
                        borderWidth: 2,
                        borderColor: Colors.primary,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 12,
                        fontSize: 16,
                      },
                      listView: {
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,

                        elevation: 5,
                        backgroundColor: "#fff",
                      },
                      poweredContainer: {
                        height: 0,
                        borderColor: "#fff",
                      },
                      powered: {
                        height: 0,
                      },
                      separator: {
                        height: 0,
                      },
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text>Language</Text>
                  <Dropdown
                    data={languageOptions}
                    placeholder="Choose an option"
                    onSelect={setSelectedLanguage}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text>Password</Text>
                  <View style={styles.passWordContainer}>
                    <TextInput
                      style={styles.passwordField}
                      placeholder="enter password"
                      placeholderTextColor={Colors.grey.light}
                      secureTextEntry={!isPasswordVisible}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <Pressable
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      style={styles.iconContainer}
                    >
                      <Ionicons
                        name={isPasswordVisible ? "eye-off" : "eye"} // Toggle between eye and eye-off
                        size={24}
                        color="#aaa"
                      />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text>Confirm Password</Text>

                  <View style={styles.passWordContainer}>
                    <TextInput
                      style={styles.passwordField}
                      placeholder="confirm your password"
                      placeholderTextColor={Colors.grey.light}
                      secureTextEntry={!isConfirmPasswordVisible} // Toggle visibility
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <Pressable
                      onPress={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                      style={styles.iconContainer}
                    >
                      <Ionicons
                        name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                        size={24}
                        color="#aaa"
                      />
                    </Pressable>
                  </View>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
                <Button
                  style={styles.button}
                  textStyle={styles.buttonText}
                  title={"Submit"}
                  onPress={handleSubmit}
                  disabled={buttonDisable}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? "20%" : "14%",
    // backgroundColor: "red",
  },

  scrollViewChild: {
    alignItems: "center",
    gap: 28,
    paddingBottom: "30%",
  },
  inputField: {
    width: "100%",
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderColor: Colors.primary,
    borderRadius: 8,
    fontSize: 16,
  },

  inputFieldContainers: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: "6%",
    gap: 16,
  },
  dateInputField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  placeHolder: {
    flex: 1,
    fontSize: 16,
    color: Colors.grey.light,
  },
  button: {
    width: "100%",
    marginTop: "4%",
  },

  buttonText: {
    fontSize: 16,
    color: Colors.secondary,
  },
  editIcon: {
    position: "absolute",
    right: 0,
  },
  profileContainer: {
    marginTop: Platform.OS == "android" ? "10%" : "6%",
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  label: { fontSize: 18, marginBottom: 10 },
  picker: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    fontSize: 16,
  },
  languagePlaceholder: {
    color: "red",
  },
  passWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: Colors.primary,
    borderRadius: 8,
  },
  iconContainer: {},
  passwordField: {
    flex: 1,
    color: "#000",
    fontSize: 16,
  },
  selectIcon: {
    marginRight: 10,
    marginTop: "30%",
  },
  phoneContainer: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  inputContainer: {
    gap: 8,
  },
  iosControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,

    alignSelf: "flex-end",
  },
});

export default Register;
