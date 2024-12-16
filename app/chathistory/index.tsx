import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGetChatHistoryList } from "../../hooks/useGetChatHistoryList";
import { useCallback, useEffect, useState } from "react";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useUserStore } from "@/stores/userStore";
import { ConstantStrings } from "@/constants/ConstantStrings";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import dayjs from "dayjs";

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState();
  const router = useRouter();
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));

  const getChatHistory = useGetChatHistoryList();

  const handleGetChatHistory = async () => {
    try {
      const response = await getChatHistory.mutateAsync(userEmail);
      console.log(response.data.data);
      setChatHistory(response.data.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    handleGetChatHistory();
  }, []);

  const handleNavigateToChat = (
    room,
    name,
    image,
    email,
    minChat,
    endAlertTime,
    rechargeTime,
    chatPrice,
    consultantDetails
  ) => {
    router.push({
      pathname: "/chat",
      params: {
        room: room,
        consultantName: name,
        consultantImage: image,
        consultantEmail: email,
        minimumChat: minChat,
        endAlertTime: endAlertTime,
        rechargeAlertTime: rechargeTime,
        chatPrice: chatPrice,
        consultantDetails: JSON.stringify(consultantDetails),
        isComingFromHistory: "true",
      },
    });
  };
  const renderCategories = ({ item }) => {
    const dateTime = dayjs(item.last_message_time);

    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderColor: "#d3d3d3",
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
          marginHorizontal: 6,
          borderRadius: 12,
        }}
        onPress={() =>
          handleNavigateToChat(
            item.room_name,
            item.consultant_name,
            item.consultant_image,
            item.consultant,
            item.minimum_min_chat,
            item.end_alert_time,
            item.recharge_alert_time,
            item.chat_price,
            item
          )
        }
      >
        <View style={styles.consultantImageContainer}>
          <Image
            source={{
              uri: ConstantStrings.url.base_url + item.consultant_image,
            }}
            style={styles.consultantImage}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {item.consultant_name}
          </Text>
          <Text style={{ color: Colors.grey.medium }}>{item.last_message}</Text>
        </View>
        <View style={{ alignSelf: "flex-end" }}>
          <Text>{dateTime.format("HH:mm")}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingVertical: 10, gap: 14 }}>
        <FlatList
          data={chatHistory}
          keyExtractor={(consultants) => consultants.consultant_name}
          renderItem={renderCategories}
        />
      </View>
    </ScrollView>
  );
};

export default ChatHistory;

const styles = StyleSheet.create({
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
});
