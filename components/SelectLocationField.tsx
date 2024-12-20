import { Pressable, Text, TouchableOpacity, View } from "react-native";

import { useEffect, useRef, useState } from "react";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../components/Header";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import TypographyBold from "./TypographyBold";
import Container from "../components/Container";
import { useLocalSearchParams } from "expo-router";

const UpdateLocation = () => {
  const locationInputRef = useRef(null);
  // const userDetails = useSelector((state) => state.user);
  // const [location, setLocation] = useState({
  //     lat: userDetails?.user?.location?.coordinates[0],
  //     lng: userDetails?.user?.location?.coordinates[1],
  // });
  const [data, setData] = useState();
  const [details, setDetails] = useState();
  const isButtonDisabled = !data || !details;
  const { selectLocation } = useLocalSearchParams();

  useEffect(() => {
    // Focus on the location input field when component mounts
    if (locationInputRef?.current) {
      locationInputRef?.current?.focus();
    }
  }, []);

  const handlePlaceSelect = (data, details = null) => {
    setData(data);
    setDetails(details);
  };

  const handleDoneButton = () => {
    selectLocation(data, details);
  };
  return (
    <ScrollView
      bounces={false}
      keyboardShouldPersistTaps={"handled"}
      horizontal={true}
      contentContainerStyle={{
        flexDirection: "column",
        // justifyContent: 'flex-start',
        flex: 1,
        width: "100%",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View style={{ height: "40%", width: "95%" }}>
        <GooglePlacesAutocomplete
          disableScroll={true}
          ref={locationInputRef}
          placeholder="Find Location"
          query={{
            key: "AIzaSyA8FpVCTR_ciWar7HST_gAy1hEw7muFWh0",
            language: "en",
          }}
          fetchDetails={true}
          // onPress={(data, details) => route.params.selectLocation(data, details)}
          // value={selectedLocation}
          onPress={(data, details) => handlePlaceSelect(data, details)}
          textInputProps={{
            clearButtonMode: "never",
            placeholderTextColor: "#606063",
          }}
          styles={{
            container: {
              marginTop: 8,
              borderRadius: 8,
              height: 10,
              flex: 1,
            },
            textInput: {
              backgroundColor: "#F6F6F6",
              // Style for the autocomplete input field
              // For example:
              // height: 40,
              // color: 'blue',
              // fontSize: 16,
            },
            listView: {
              // Style for the dropdown list of autocomplete suggestions
              // For example:
              // backgroundColor: 'lightgray',
              // borderWidth: 1,
              // borderColor: 'gray',
              // borderRadius: 5,
            },
            poweredContainer: {
              height: 0,
              borderColor: "white",
            },
            powered: {
              height: 0,
            },
            separator: {
              height: 0,
            },
            row: {
              // Style for each item in the dropdown list
              // For example:
              // paddingVertical: 10,
              // paddingHorizontal: 15,
            },
          }}
        />
      </View>
    </ScrollView>
  );
};

export default UpdateLocation;
