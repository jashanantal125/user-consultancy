import Button from "@/components/Button";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { ConstantStrings } from "@/constants/ConstantStrings";
import { useUserStore } from "@/stores/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Image, Platform, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Dropdown from "@/components/Dropdown";
import { useGetLanguage } from "@/hooks/useGetLanguage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import Entypo from "@expo/vector-icons/Entypo";

const MyProfile = () => {
  const router = useRouter();
  const userDetails = useUserStore((state) => state.userDetails);
  const initialDOB = userDetails?.birth_date
    ? new Date(userDetails.birth_date)
    : null;

  const initialTime = userDetails?.birth_time
    ? (() => {
        const [hours, minutes, seconds] = userDetails.birth_time
          .split(":")
          .map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return date;
      })()
    : null;

  const [firstName, setFirstName] = useState(userDetails?.first_name);
  const [secondName, setSecondName] = useState(userDetails?.last_name);
  const [selectedDate, setSelectedDate] = useState(initialDOB);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const hideDatePicker = () => setDatePickerVisibility(false);
  const hideTimePicker = () => setTimePickerVisibility(false);
  const [currentAddress, setCurrentAddress] = useState();
  const [currentCoords, setCurrentCoords] = useState();
  const [birthPlace, setBirthPlace] = useState();
  const [birthPlaceCoords, setBirthPlaceCoords] = useState();
  const [languageOptions, setLanguageOptions] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [image, setImage] = useState(userDetails?.user_image);
  const locationInputRef = useRef(null);
  const getLanguage = useGetLanguage();
  const uploadFile = useUploadFile();
  const updateProfile = useUpdateProfile();

  const handleUpdateProfile = async () => {
    const payload = {
      user_image: image,
      email: userDetails?.email,
      birth_time: moment(selectedTime).format("HH:mm:ss"),
      place_of_birth: birthPlace,
      current_place: currentAddress,
      birth_date: moment(selectedDate).format("YYYY-MM-DD"),
      first_name: firstName,
      last_name: secondName,
    };
    const response = await updateProfile.mutateAsync(payload);

    if (response.data) {
      Alert.alert("", "Profile updated successfully");
    }
  };

  const googleApiKey = Constants.expoConfig.extra.googleApiKey;
  const showDatePicker = () => {
    setDatePickerVisibility(true);
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  };

  const confirmDateSelection = () => {
    setSelectedDate(tempDate);
    hideDatePicker();
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

  const showTimePicker = () => {
    setTimePickerVisibility(true);
    if (!selectedTime) {
      setSelectedTime(new Date());
    }
  };
  const confirmTimeSelection = () => {
    setSelectedTime(tempTime);
    hideTimePicker();
  };
  const handleBirthPlace = (data, details) => {
    setBirthPlace(data?.description);
    setBirthPlaceCoords(details?.geometry?.location);
  };
  const handleCurrentAddress = (data, details) => {
    setCurrentAddress(data?.description);
    setCurrentCoords(details?.geometry?.location);
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
    fetchLanguage();
  }, [fetchLanguage]);

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

          // handleUpdateProfile();
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

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="My Profile"
        onBackPress={() => router.back()}
        background="#fff"
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
      >
        <View
          style={{
            backgroundColor: "white",
            marginTop: "30%",
            alignItems: "center",
            paddingBottom: "40%",
          }}
        >
          <TouchableOpacity onPress={() => handleUploadMedia()}>
            <Image
              source={{
                uri: ConstantStrings.url.base_url + image,
              }}
              style={styles.headerImage}
            />
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 10,
                backgroundColor: Colors.primary,
                padding: 8,
                borderRadius: "50%",
              }}
            >
              <Entypo name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

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
                style={[styles.inputField, { color: Colors.grey.medium }]}
                placeholderTextColor={Colors.grey.light}
                value={userDetails?.email}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text>Phone</Text>
              <TextInput
                style={[styles.inputField, { color: Colors.grey.medium }]}
                placeholderTextColor={Colors.grey.light}
                value={userDetails?.mobile_no}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text>DOB</Text>

              <View>
                <TouchableOpacity
                  style={styles.dateInputField}
                  onPress={showDatePicker}
                >
                  <Text style={styles.inputText}>
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
                      display={Platform.OS === "ios" ? "spinner" : "default"}
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
              <View style={styles.inputContainer}>
                <Text>TOB</Text>
                <TouchableOpacity
                  style={styles.dateInputField}
                  onPress={showTimePicker} // Show the time picker when pressed
                >
                  <Text style={styles.inputText}>
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
                  placeholder={userDetails?.place_of_birth}
                  ref={locationInputRef}
                  onPress={handleBirthPlace}
                  query={{
                    key: googleApiKey,
                    language: "en",
                    region: "in",
                  }}
                  textInputProps={{
                    placeholderTextColor: "#000",
                  }}
                  value={birthPlace}
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
                  placeholder={userDetails?.current_place}
                  onPress={handleCurrentAddress}
                  query={{
                    key: googleApiKey,
                    language: "en",
                    region: "in",
                  }}
                  textInputProps={{
                    placeholderTextColor: "#000",
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
              {/* <View style={styles.inputContainer}>
                <Text>Language</Text>
                <Dropdown
                  data={languageOptions}
                  placeholder="Choose an option"
                  onSelect={setSelectedLanguage}
                />
              </View> */}
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          height: 100,
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          paddingTop: "6%",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowOffset: { width: 0, height: 0 },
          elevation: 3,
        }}
      >
        <Button
          title="Update profile"
          onPress={handleUpdateProfile}
          style={{ width: "80%" }}
        />
      </View>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular image
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.grey.medium,
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
  inputContainer: {
    gap: 8,
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
  iosControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,

    alignSelf: "flex-end",
  },
});
