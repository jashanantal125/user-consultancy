import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ConstantStrings } from "@/constants/ConstantStrings";

const ChatHeader = ({
  title,
  onBackPress,
  style,
  background,
  image,
  endChat,
  timer,
}) => {
  return (
    <View style={[styles.header, style, { backgroundColor: background }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable onPress={() => onBackPress()} style={styles.backButton}>
          <AntDesign
            name="arrowleft"
            size={20}
            color="black"
            onPress={() => onBackPress()}
          />
          {/* <Text style={styles.backText}>Back</Text> */}
        </Pressable>

        <View style={styles.consultantImageContainer}>
          <Image
            source={{
              uri: ConstantStrings.url.base_url + image,
            }}
            style={styles.consultantImage}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.timer}>{timer}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={endChat}>
        <Text style={styles.endChat}>End chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    justifyContent: "space-between",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: Platform.OS == "android" ? 20 : 40,
    height: Platform.OS == "android" ? 80 : 100,
    borderBottomWidth: 1,
    borderColor: "#d5d5d5",
  },
  backButton: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  consultantImageContainer: {
    width: 30,
    height: 30,
  },
  consultantImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 15,
    borderColor: "#d3d3d3",
    borderWidth: 1,
  },
  endChat: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  titleContainer: {
    alignItems: "flex-start",
    marginLeft: 10,
  },
  timer: {
    color: Colors.primary,
  },
});

export default ChatHeader;
