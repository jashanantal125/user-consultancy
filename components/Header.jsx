import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Colors } from "../constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

const Header = ({ title, onBackPress, style, background }) => {
  return (
    <View style={[styles.header, style, { backgroundColor: background }]}>
      <Pressable onPress={() => onBackPress()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={20} color="black" />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    justifyContent: "flex-start",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? 20 : 40,
    height: Platform.OS === "android" ? 80 : 100,
    borderBottomWidth: 1,
    borderColor: "#d5d5d5",
    zIndex: 1,
  },
  backButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    flex: 1,
    marginLeft: "-10%",
  },
});

export default Header;
