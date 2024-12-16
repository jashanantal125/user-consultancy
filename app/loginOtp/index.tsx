import Header from "@/components/Header";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput } from "react-native";
import { SafeAreaView, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useUserStore } from "../../stores/userStore";

const LoginOtp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [completeOtp, setCompleteOtp] = useState();
  const { username, userTempNumber } = useUserStore();

  const handleSubmit = (otpCode) => {
    Keyboard.dismiss();
    console.log("OUUPP", otpCode);
    router.push("/register");
  };

  const handleInputChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp); // Update state asynchronously

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus(); // Shift to the next input
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Shift to the previous input if backspaced
    }

    if (newOtp.every((digit) => digit !== "") && index === 3) {
      const otpCode = newOtp.join("");

      setCompleteOtp(otpCode);
      handleSubmit(otpCode); // Submit after all fields are filled
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Global Header Component */}
      <Header title="Verify OTP" onBackPress={router.back} background="#fff" />
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to your phone
        </Text>
        <Text>{userTempNumber}</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)} // Set input refs
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              returnKeyType="done"
            />
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={() => handleSubmit(completeOtp)}
        style={styles.submitButton}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: -20,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
    color: Colors.primary,
  },
  submitButton: {
    position: "absolute",
    bottom: "30%",
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 22,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 12,
  },
});

export default LoginOtp;
