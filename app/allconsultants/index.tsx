import Header from "@/components/Header";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  Touchable,
  View,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useGetAllConsultantList } from "../../hooks/useGetAllConsultantList";
import { ConstantStrings } from "@/constants/ConstantStrings";
import { useUserStore } from "@/stores/userStore";
import { useCheckWalletBalance } from "@/hooks/useCheckWalletBalance";
import { useSendChatRequest } from "@/hooks/useSendChatRequest";

const AllConsultants = () => {
  const { categoryName = "Krew" } = useLocalSearchParams();
  console.log(categoryName);
  const [index, setIndex] = useState(0);
  const getAllConsultantList = useGetAllConsultantList();
  const [consultantData, setConsultantData] = useState();
  const [routes] = useState([
    { key: "first", title: "Chat" },
    { key: "second", title: "Call" },
  ]);
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const checkWalletBalance = useCheckWalletBalance();
  const sendChatRequest = useSendChatRequest();
  const handleGetAllConsultantList = async (payload) => {
    try {
      const response = await getAllConsultantList.mutateAsync(payload);
      setConsultantData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error, "All consultant lists api error");
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const type = index === 0 ? "chat" : "call";
    const payload = {
      type: type,
      category: categoryName,
    };
    handleGetAllConsultantList(payload);
  }, [index]);

  const handleSendChatRequest = async (
    chatPrice,
    endAlertTime,
    rechargeTime,
    consultantData
  ) => {
    const randomRoomNumber = Math.floor(Math.random() * 900) + 100;
    const currentTime = new Date().getTime();
    try {
      const payload = {
        consultant: consultantData?.email,
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
            endAlertTime: endAlertTime,
            rechargeAlertTime: rechargeTime,
            chatPrice: chatPrice,
            consultantDetails: JSON.stringify(consultantData),
          },
        });
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
      console.log(error, "send chat request api error");
    }
  };

  const handleWalletBalanceCheck = async (
    chatPrice,
    minChat,
    endAlertTime,
    rechargeTime,
    consultantData
  ) => {
    try {
      const payload = {
        email: userEmail,
        price: chatPrice,
        minutes: minChat,
      };
      const response = await checkWalletBalance.mutateAsync(payload);
      console.log(response.data);
      if (response.data.message.status == "success") {
        handleSendChatRequest(
          chatPrice,
          endAlertTime,
          rechargeTime,
          consultantData
        );
      } else {
        Alert.alert("You don't have enough balance to chat");
      }
    } catch (error) {
      console.log("check balance api error", error);
    }
  };

  const renderConsultants = ({ item }) => {
    return (
      <View style={styles.consultantCard}>
        <View style={styles.consultantDetailsContainer}>
          <View style={styles.imageAndRatingMainContainer}>
            <View>
              <View style={styles.icon}>
                <Entypo
                  name="dot-single"
                  size={50}
                  color={
                    item.active_status == "OFFLINE" ||
                    item.active_status == "BUSY"
                      ? "#FF4D4D"
                      : "#28a745"
                  }
                />
              </View>

              <View style={styles.imageContainer}>
                <Image
                  style={styles.consultantImage}
                  source={{
                    uri: ConstantStrings.url.base_url + item.user_image,
                  }}
                />
              </View>
            </View>
            <View>
              <AirbnbRating
                isDisabled={true} // Read-only mode
                defaultRating={item.actual_rating}
                showRating={false} // Hides "Tap to rate" text
                size={12} // Star size
              />
            </View>
          </View>
          <View style={styles.consultantInfoContainer}>
            <Text style={styles.consultantText}>{item.first_name}</Text>
            <Text style={styles.consultantText}>{item.language}</Text>
            <Text style={styles.consultantText}>{item.primary_skills}</Text>
            <Text style={styles.consultantText}>
              Experience: {item.experience}
            </Text>
            <Text style={styles.consultantRateText}>
              Rate: {index === 0 ? item.chat_price : item.call_price}/min
            </Text>
          </View>
        </View>
        <View style={styles.chatAndCallContainer}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              index === 0
                ? handleWalletBalanceCheck(
                    item.chat_price,
                    item.minimum_min_chat,
                    item.end_alert_time,
                    item.recharge_alert_time,
                    item
                  )
                : null
            }
          >
            <Text style={styles.buttonText}>
              {index === 0 ? "Chat" : "Call"}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  const FirstRoute = () => (
    <View style={styles.tabScreen}>
      <View style={styles.listContainer}>
        {getAllConsultantList.isPending ? (
          <ActivityIndicator size={300} color={Colors.primary} />
        ) : (
          <FlatList
            data={consultantData}
            renderItem={renderConsultants}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );

  const SecondRoute = () => (
    <View style={styles.tabScreen}>
      <View style={styles.listContainer}>
        {getAllConsultantList.isPending ? (
          <ActivityIndicator size={300} color={Colors.primary} />
        ) : (
          <FlatList
            data={consultantData}
            renderItem={renderConsultants}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={categoryName}
        background="#fff"
        onBackPress={router.back}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        style={styles.tabView}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#1169BB", height: 3 }}
            style={{ backgroundColor: Colors.secondary }}
            labelStyle={{ color: "white", fontSize: 14 }}
            activeColor="#1169BB"
            inactiveColor="#757575"
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  consultantCard: {
    borderWidth: 1,
    marginVertical: 12,
    borderRadius: 12,
    width: "100%",
    borderColor: "#d3d3d3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "white",
    paddingVertical: 12,
    gap: 10,
  },
  consultantDetailsContainer: {
    padding: 10,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  chatAndCallContainer: {
    marginHorizontal: 16,

    gap: 16,
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
  consultantInfoContainer: {
    gap: 6,
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  consultantText: {
    fontSize: 16,
    color: "#4F4F4F",
  },
  imageAndRatingMainContainer: {
    gap: 10,
  },
  consultantRateText: {
    fontSize: 16,
    color: Colors.primary,
  },
  chatButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  icon: {
    position: "absolute",
    right: "-13%",
    zIndex: 1,
    bottom: 0,
  },

  tabView: {
    marginTop: "10%",
  },
  tabScreen: {
    backgroundColor: "#fff",
    flex: 1,
  },
});

export default AllConsultants;
