import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ExperienceIcon from "../../assets/icons/experience_icon_filled.svg";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGetUserInfo } from "@/hooks/useGetUserInfo";
import { useCallback, useEffect, useState } from "react";
import { ConstantStrings } from "@/constants/ConstantStrings";
import { useSendChatRequest } from "@/hooks/useSendChatRequest";
import { useUserStore } from "@/stores/userStore";
import { useCheckWalletBalance } from "@/hooks/useCheckWalletBalance";

const ConsultantProfile = () => {
  const { name, consultant } = useLocalSearchParams();
  const router = useRouter();
  const [consultantFullDetails, setConsultantFullDetails] = useState();
  const consultantDetails = JSON.parse(consultant);
  const sendChatRequest = useSendChatRequest();
  const getUserDetails = useGetUserInfo();
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const checkWalletBalance = useCheckWalletBalance();
  const handleGetUserDetails = useCallback(async () => {
    const response = await getUserDetails.mutateAsync(consultantDetails.email);
    setConsultantFullDetails(response.data.data);
  }, []);

  useEffect(() => {
    handleGetUserDetails();
  }, []);

  const handleSendChatRequest = async () => {
    const randomRoomNumber = Math.floor(Math.random() * 900) + 100;
    const currentTime = new Date().getTime();
    try {
      const payload = {
        consultant: consultantFullDetails?.email,
        type: "Direct",
        user: userEmail,
        conversation_type: "Chat",
      };
      const response = await sendChatRequest.mutateAsync(payload);

      if (response.data.Success) {
        router.push({
          pathname: "/chat",
          params: {
            room: response.data?.data.room_name,
            consultantName: response.data?.data.consultant_first_name,
            consultantImage: response.data?.data.consultant_image,
            consultantEmail: response.data?.data.consultant_email,
            minimumChat: response?.data?.data.minimum_min_chat,
            endAlertTime: consultantFullDetails?.end_alert_time,
            rechargeAlertTime: consultantFullDetails?.recharge_alert_time,
            chatPrice: consultantFullDetails?.chat_price,
            consultantDetails: JSON.stringify(consultantFullDetails),
          },
        });
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
      console.log(error, "send chat request api error");
    }
  };

  const handleWalletBalanceCheck = async () => {
    try {
      const payload = {
        email: userEmail,
        price: consultantFullDetails?.chat_price,
        minutes: consultantFullDetails?.minimum_min_chat,
      };
      const response = await checkWalletBalance.mutateAsync(payload);
      console.log(response.data);
      if (response.data.message.status == "success") {
        handleSendChatRequest();
      } else {
        Alert.alert("You don't have enough balance to chat");
      }
    } catch (error) {
      console.log("check balance api error", error);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <Header title={name} background="#fff" onBackPress={router.back} />

      <ScrollView
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scrollViewChild}>
          <View style={styles.profileDetails}>
            <View style={styles.availability}>
              <View style={styles.icon}>
                <Entypo
                  name="dot-single"
                  size={60}
                  color={
                    consultantFullDetails?.active_status == "OFFLINE" ||
                    consultantFullDetails?.active_status == "BUSY"
                      ? "#FF4D4D"
                      : "#28a745"
                  }
                />
              </View>

              <View style={styles.imageContainer}>
                <Image
                  style={styles.consultantImage}
                  source={{
                    uri:
                      ConstantStrings.url.base_url +
                      consultantFullDetails?.user_image,
                  }}
                />
              </View>
            </View>
            <View style={styles.basicInfo}>
              <Text style={styles.name}>
                {consultantFullDetails?.full_name}
              </Text>

              <Text style={styles.expertise}>
                {consultantFullDetails?.primary_skills}
              </Text>
              <Text style={styles.language}>{consultantDetails.language}</Text>
            </View>

            <View style={styles.experienceContainer}>
              <View style={styles.experienceBox}>
                <ExperienceIcon width={20} height={26} />
                <Text style={styles.experience}>
                  Experience: {consultantFullDetails?.experience}
                </Text>
              </View>
              <View style={styles.experienceBox}>
                <AntDesign name="star" size={20} color="#F9C706" />
                <Text style={styles.experience}>
                  Rating: {consultantFullDetails?.actual_rating.toFixed(1)}
                </Text>
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                {consultantFullDetails?.consultant_bio}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomsheetContainer}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => handleWalletBalanceCheck()}
        >
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Ionicons name="chatbubble" size={20} color="white" />
            <Text style={styles.chat}>Chat</Text>
          </View>

          <Text style={styles.chat}>
            {consultantFullDetails?.chat_price} /min
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.call}>Call</Text>
          </View>

          <Text style={styles.call}>
            {consultantFullDetails?.call_price} /min
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConsultantProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollViewChild: {
    paddingTop: 40,
    paddingBottom: "40%",
    marginTop: 100,
    alignItems: "center",
    height: "100%",
  },
  consultantActivityContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  consultantImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  icon: {
    position: "absolute",
    right: "32%",
    zIndex: 1,
    bottom: 0,
  },

  basicInfo: {
    gap: 6,
    alignItems: "center",
  },

  availability: {
    alignItems: "center",
  },
  profileDetails: {
    gap: 18,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.grey.dark,
  },
  expertise: {
    fontSize: 14,
    color: Colors.grey.dark,
  },
  language: {
    fontSize: 14,
    color: Colors.grey.dark,
  },
  experienceContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.grey.light,
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 26,
    justifyContent: "space-between",
  },
  experienceBox: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grey.dark,
  },
  experience: {
    fontSize: 16,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
  },
  bottomButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "space-between",
    gap: 4,
    flexDirection: "row",
    paddingHorizontal: 30,
    flex: 1,
  },
  bottomsheetContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Offset
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Blur radius
    elevation: 5,
    paddingVertical: 30,
    gap: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
  },

  chat: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  call: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
