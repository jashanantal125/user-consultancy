import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

export const mainPageStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  container: {
    padding: 6,
    paddingHorizontal: 26,
    paddingTop: "30%",
    paddingBottom: "10%",
    gap: 28,
    backgroundColor: "#d3d3d3",
  },

  imageContainer: {
    width: 250,
    height: 90,
    alignSelf: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  secondContainer: {
    gap: 20,
    padding: 6,
    paddingTop: "10%",
    flex: 1,
  },

  loginText: {
    fontSize: 20,
    fontFamily: "serif",
  },

  title: {
    fontSize: 28,
    fontWeight: "400",
  },

  //   firstChat: {
  //     fontSize: 16,
  //   },

  //   firstChatContainer: {
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     backgroundColor: "white",
  //     width: "75%",
  //     borderColor: "black",
  //     borderWidth: 1,
  //     borderRadius: 20,
  //     height: "5%",
  //     zIndex: 1,
  //     position: "absolute",
  //     top: "32.5%",
  //     left: "12%",
  //   },

  inputContainer: {
    gap: 16,
    paddingHorizontal: 14,
  },
  phoneContainer: {
    backgroundColor: "white",
    position: "relative",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    padding: 4,
  },

  button: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "red",
    flexDirection: "row",
    gap: 10,
  },

  textInButton: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  bottomContain: {
    height: "10%",
    position: "absolute",
    display: "flex-end",
    flexDirection: "row",
    top: "80%",
    width: "20%",
    left: "15%",
    alignContent: "center",
    alignItems: "center",
  },
  adviseImageContainer: {
    width: 300,
    height: 200,
    alignSelf: "center",
  },
  lowerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  numberHeading: {
    alignContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },

  firstText2: {
    alignContent: "center",
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },

  secondText2: {
    width: 110,
    alignContent: "center",
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },

  thirdText2: {
    alignContent: "center",
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },

  line: {
    height: "100%",
    width: 1,
    backgroundColor: "white",
    marginHorizontal: 15,
  },
  flag: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },

  formButton: {
    opacity: 0,
  },

  crewImageContainer: {
    width: 170,
    height: 100,
    alignSelf: "center",
  },
  crew: {
    width: "100%",
    height: "100%",
  },
});
