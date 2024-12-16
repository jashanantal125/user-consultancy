import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

export const mainPageStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
  },

  topView: {
    backgroundColor: Colors.primary,
    height: "8%",
  },

  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginHorizontal: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    // borderRadius: 10,
  },

  secondContainer: {
    backgroundColor: Colors.secondary,
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 200,
    resizeMode: "contain",
  },
  titlecontainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    padding: 20,
    paddingHorizontal: 30,
  },

  logintitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.tertiary,
    marginHorizontal: 18,
  },

  loginsubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.tertiary,
    marginHorizontal: 18,
  },

  firstChatContainer: {
    backgroundColor: Colors.secondary,
    marginTop: "10%",
    gap: 12,
  },

  phoneContainer: {
    borderColor: Colors.tertiary,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 20,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 22,
    marginTop: 12,
  },

  textInButton: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },

  whiteArrow: {
    width: "7%",
    position: "relative",
    height: "4%",
    bottom: "33%",
    left: "32%",
  },

  bottomContain: {
    flexDirection: "row",
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    gap: 10,
    flex: 1,
  },

  numberHeading: {
    alignContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.secondary,
  },

  firstText2: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.secondary,
  },

  secondText2: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.secondary,
  },

  thirdText2: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.secondary,
  },

  line: {
    height: "100%",
    width: 1,
    backgroundColor: Colors.secondary,
  },
  flag: {
    width: 40,
    height: 35,
    borderRadius: 6,
  },

  formButton: {
    opacity: 0,
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

  emailContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: "5%",
    gap: 14,
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
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
  inputContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 20,
  },
  signupContainer: {
    flexDirection: "row",
    gap: 4,
    alignSelf: "center",
    marginTop: "6%",
  },
  signUpMetaText: {
    fontSize: 14,
  },
  signUpText: {
    fontSize: 14,
    color: Colors.primary,
  },
});
