import Button from "@/components/Button";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHelpAndSupport } from "../../hooks/useHelpAndSupport";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "expo-router";

const HelpAndSupport = () => {
  const [title, setTitle] = useState();
  const [query, setQuery] = useState("");
  const helpAndSupport = useHelpAndSupport();
  const router = useRouter();
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const handleSubmit = async () => {
    if (!title || !query) {
      Alert.alert("Error", "Please fill in both fields before submitting.");
      return;
    } else {
      try {
        const payload = {
          title: title,
          message: query,
          user: userEmail,
        };
        const response = await helpAndSupport.mutateAsync(payload);
        if (response.data.data) {
          Alert.alert("Success", "Your message has been sent successfully.", [
            {
              text: "OK",
              onPress: () => router.back(), // Navigate to Home
            },
          ]);
        }
      } catch (error) {
        Alert.alert("", error.response.message);
      }
    }
    // Handle the form submission logic here
  };
  const handlePhonePress = () => {
    Linking.openURL("tel:+9199098898989");
  };

  const handleEmailPress = async () => {
    const email = "mailto:support@krew.com";
    try {
      const supported = await Linking.canOpenURL(email);
      if (supported) {
        await Linking.openURL(email);
      } else {
        console.warn("Email client not available");
      }
    } catch (error) {
      console.error("Failed to open email client:", error);
    }
  };

  const handleWebsitePress = () => {
    Linking.openURL("https://www.krew.com");
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginTop: "10%", gap: 10, alignItems: "center" }}>
        <View style={styles.inputContainer}>
          {/* <Text style={{ color: "#333", fontWeight: "700", fontSize: 20 }}>
            Title
          </Text> */}
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={{ paddingHorizontal: 16, width: "100%" }}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your query..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            multiline
            numberOfLines={4}
          />
        </View>
        <Button
          title="Submit"
          style={{ width: "60%" }}
          onPress={() => handleSubmit()}
        />
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#d3d3d3",
            marginTop: "10%",
          }}
        />
        <View
          style={{
            alignItems: "flex-start",
            width: "100%",
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          {/* Phone */}
          <TouchableOpacity
            onPress={handlePhonePress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              width: "100%",
              borderColor: "#d3d3d3",
              paddingVertical: 12,
            }}
          >
            <Ionicons
              name="phone-portrait-outline"
              size={26}
              color={Colors.primary}
            />
            <Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 12 }}>
              +91-99098898989
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            onPress={handleEmailPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              width: "100%",
              borderColor: "#d3d3d3",
              paddingVertical: 12,
            }}
          >
            <Ionicons name="mail-open" size={28} color={Colors.primary} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                marginLeft: 12,
                textDecorationLine: "underline",
                color: Colors.primary, // Link-like color
              }}
            >
              support@krew.com
            </Text>
          </TouchableOpacity>

          {/* Website */}
          <TouchableOpacity
            onPress={handleWebsitePress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              width: "100%",
              borderColor: "#d3d3d3",
              paddingVertical: 12,
            }}
          >
            <Ionicons name="earth" size={28} color={Colors.primary} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                marginLeft: 12,
                textDecorationLine: "underline",
                color: Colors.primary, // Link-like color
              }}
            >
              www.krew.com
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default HelpAndSupport;

const styles = StyleSheet.create({
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
    alignItems: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    width: "100%",
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
});
