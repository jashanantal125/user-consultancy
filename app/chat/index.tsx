import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Animated,
  ScrollView,
  Keyboard,
  FlatList,
} from "react-native";
import { GiftedChat, Message } from "react-native-gifted-chat";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import { io } from "socket.io-client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSendMessage } from "../../hooks/useSendMessage";
import { useAuthStore } from "@/stores/authStore";
import ChatHeader from "@/components/ChatHeader";
import { useGetChatHistory } from "../../hooks/useGetChatHistory";
import { useUserStore } from "@/stores/userStore";
import { useEndChat } from "../../hooks/useEndChat";
import { ConstantStrings } from "@/constants/ConstantStrings";
import Modal from "react-native-modal"; // For modal functionality
import Button from "@/components/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { useChatDeduction } from "../../hooks/useChatDeduction";
import { useCheckWalletBalance } from "@/hooks/useCheckWalletBalance";
import { ActivityIndicator } from "react-native-paper";
import { useRechargeApi } from "../../hooks/useRechargeApi";
import { useSendChatRequest } from "@/hooks/useSendChatRequest";
import ReviewModal from "../../components/ReviewModal";
import { useSubmitReview } from "../../hooks/useSubmitReview";
import { TouchableWithoutFeedback } from "react-native";
import { useGetPricingList } from "@/hooks/useGetPricingList";
import { useFareBreakup } from "@/hooks/useFareBreakup";
import AntDesign from "@expo/vector-icons/AntDesign";
import GooglePayIcon from "../../assets/icons/googlepay_icon.svg";
import PhonePeIcon from "../../assets/icons/phonepe-icon.svg";
import BhimIcon from "../../assets/icons/bhim_icon.svg";
import UpiIcon from "../../assets/icons/upi-icon.svg";
import DebitCardIcon from "../../assets/icons/debitCardIcon.svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LottieView from "lottie-react-native";

const ChatScreen = () => {
  const {
    room = "Krew",
    consultantEmail,
    minimumChat,
    endAlertTime,
    rechargeAlertTime,
    chatPrice,
    consultantDetails,
    consultantImage,
    consultantName,
    isComingFromHistory = "false",
  } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [timerIsRunning, setTimerIsRunning] = useState(true);
  const [alreadyDeducted, setAlreadyDeducted] = useState(false);
  const [newConversation, setNewConversation] = useState(false);
  const [isRechargeScreenVisible, setIsRechargeScreenVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [comingFromHistory, setComingFromHistory] = useState(
    isComingFromHistory == "true" ? true : false
  );
  const [amount, setAmount] = useState();
  const bottomSheetRef = useRef(null);
  const [bottomModalVisible, setBottomModalVisible] = useState(false);
  const [fareBreakdownModalVisible, setFareBreakdownModalVisible] =
    useState(false);
  const [pricingList, setPricingList] = useState();
  const getPricingList = useGetPricingList();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [fareBreakdown, setFareBreakdown] = useState();
  const [isRechargeSuccessful, setRechargeSuccessful] = useState(false);

  const handleGetPricingList = async () => {
    const response = await getPricingList.mutateAsync();
    setPricingList(response.data.data);
  };

  useEffect(() => {
    handleGetPricingList();
  }, []);
  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const openTimeRemainingSheet = () => {
    setModalVisible(true);
  };
  const closeTimeRemainingSheet = () => {
    setModalVisible(false);
  };
  const toggleRechargeScreen = () => {
    setRechargeTimer(Number(rechargeAlertTime));
    setIsRechargeScreenVisible(!isRechargeScreenVisible);
  };
  const toggleRechargeModal = () => {
    setRechargeModalVisible(!isRechargeModalVisible);
  };

  const openRechargeScreenSheet = () => {
    setBottomModalVisible(true);
  };
  const closeRechargeScreenSheet = () => {
    setBottomModalVisible(false);
  };

  const handleSelection = (method) => {
    setSelectedPaymentMethod(method);
  };
  const consultantFullDetails = JSON.parse(consultantDetails);

  const router = useRouter();
  const sendMessage = useSendMessage();
  const { apiKey } = useAuthStore.getState();
  const { apiSecret } = useAuthStore.getState();
  const getChatHistory = useGetChatHistory();
  const endChat = useEndChat();
  const [isChatEnd, setIsChatEnd] = useState(
    isComingFromHistory == "true" ? true : false
  );
  const sendChatRequest = useSendChatRequest();
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const [timeLeft, setTimeLeft] = useState(
    isComingFromHistory == "true" ? 0 : Number(minimumChat) * 60
  );
  const [rechargeTimer, setRechargeTimer] = useState(Number(rechargeAlertTime));
  const [consumedTime, setConsumedTime] = useState(0);
  const chatDeduction = useChatDeduction();
  const checkWalletBalance = useCheckWalletBalance();
  const rechargeApi = useRechargeApi();
  const getFareBreakup = useFareBreakup();
  const handleGetChatHistory = useCallback(async () => {
    const payload = {
      room: room,
      email: userEmail,
    };

    const response = await getChatHistory.mutateAsync(payload);

    if (response?.data?.data) {
      const allMessages = response.data.data.flatMap((session) => {
        const sessionStartDate = moment(session.session_date);

        return session.messages.map((msg, index, sessionMessages) => {
          const previousMessage = index > 0 ? sessionMessages[index - 1] : null;

          const showDayHeader =
            index === 0 || // Show header for the first message of the session
            !previousMessage || // Or if there is no previous message
            moment(msg.timestamp).isAfter(previousMessage.timestamp, "day"); // Or if the day changes

          return {
            _id: msg._id,
            text: msg.text,
            createdAt: moment(msg.timestamp).toDate(),
            user: {
              _id: msg.user._id,
              name: msg.user.name,
              avatar: ConstantStrings.url.base_url + consultantImage,
            },
            showDayHeader,
            sessionStartDate, // Attach session start date for further use
          };
        });
      });

      // Sort messages by date (if necessary)
      allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMessages(allMessages);
    }
  }, [getChatHistory, room, userEmail]);

  useEffect(() => {
    if (isModalVisible) {
      // Start the animation to slide the bottom sheet up
      Animated.timing(animation, {
        toValue: 1,
        duration: 300, // Duration of the animation
        useNativeDriver: false,
      }).start();
    } else {
      // Reverse the animation to slide the bottom sheet down
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (isRechargeModalVisible) {
      // Start the animation to slide the bottom sheet up
      Animated.timing(animation, {
        toValue: 1,
        duration: 300, // Duration of the animation
        useNativeDriver: false,
      }).start();
    } else {
      // Reverse the animation to slide the bottom sheet down
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isRechargeModalVisible]);
  useEffect(() => {
    if (isRechargeScreenVisible) {
      // Start the animation to slide the bottom sheet up
      Animated.timing(animation, {
        toValue: 1,
        duration: 300, // Duration of the animation
        useNativeDriver: false,
      }).start();
    } else {
      // Reverse the animation to slide the bottom sheet down
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isRechargeScreenVisible]);

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 170], // Height of the bottom sheet
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Slide effect (from bottom to top)
  });
  const handleStop = () => {
    setTimerIsRunning(false); // Stop the time
  };

  const handleChatDeduction = async (isEndChatPressed) => {
    const remainingTime = minimumChat - timeLeft / 60;

    try {
      const payload = {
        room: room,
        amount: chatPrice,
        user: userEmail,
        consultant: consultantEmail,
        time: minimumChat,
      };
      const response = await chatDeduction.mutateAsync(payload);
      if (response.data.Success) {
        handleEndSession();
      }
    } catch (error) {
      console.log("deduction api error", error);
    }
  };

  const handleFareBreakup = async (
    amount,
    offerAmount,
    offerAmountPercentage
  ) => {
    const payload = {
      amount: amount,
      offer: offerAmount,
      offerPercent: offerAmountPercentage,
    };
    const response = await getFareBreakup.mutateAsync(payload);
    if (response.data.data) {
      setFareBreakdown(response.data.data);
      setBottomModalVisible(false);
      setFareBreakdownModalVisible(true);
    }
  };
  useEffect(() => {
    let intervalId;

    // Only proceed if isComingFromHistory is not "true"
    if (!comingFromHistory) {
      if (timeLeft > 0 && timerIsRunning) {
        intervalId = setTimeout(() => {
          setTimeLeft((prevTime) => prevTime - 1); // Decrement timeLeft
        }, 1000);

        if (timeLeft === Number(endAlertTime)) {
          openTimeRemainingSheet();
        }
      } else if (timeLeft === 0) {
        handleTimerEnd();
      }
    }

    return () => clearTimeout(intervalId); // Cleanup timer on unmount
  }, [timeLeft, timerIsRunning, comingFromHistory]);

  const pauseTimer = () => {
    setTimerIsRunning(false); // Pause the timer
  };

  const resumeTimer = () => {
    setTimerIsRunning(true); // Resume the timer
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };
  useEffect(() => {
    handleGetChatHistory();
  }, [userEmail]);

  const socket = io("http://192.168.1.240:9000/krew.localhost", {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
      },
    },
  });

  // const handleRecharge = async () => {
  //   const payload = {
  //     amount: amount,
  //     user: userEmail,
  //   };
  //   const response = await rechargeApi.mutateAsync(payload);
  //   if (response.data.Success) {
  //     closeRechargeScreenSheet();
  //     handleWalletCheckBalance(isChatEnd ? true : false);
  //     resumeTimer();

  //     console.log(response.data);
  //   }
  // };
  const handleRecharge = async () => {
    const payload = {
      amount: fareBreakdown?.amount,
      user: userEmail,
      tax_amount: fareBreakdown?.tax_amount,
      tax_percent: fareBreakdown?.tax_percent,
      cashback: fareBreakdown?.offer_amount,
    };
    const response = await rechargeApi.mutateAsync(payload);
    if (response.data.Success) {
      // handleRechargeModal();
      setRechargeSuccessful(true);
    }
  };
  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => {
        // Check if the message already exists to avoid duplicates
        if (prevMessages.some((m) => m?._id === message?._id)) {
          return prevMessages;
        }
        return GiftedChat.append(prevMessages, [message]);
      });
    };

    socket.on(room.toString(), handleNewMessage);

    return () => {
      socket.off(room.toString(), handleNewMessage); // Cleanup listener
    };
  }, [socket, room]);

  const handleTimerEnd = async () => {
    closeTimeRemainingSheet();
    if (alreadyDeducted) {
      handleEndSession();
      closeRechargeScreenSheet();
    } else {
      handleChatDeduction();
    }
  };

  const handleEndSession = async () => {
    try {
      const payload = {
        room_name: room, // room variable is used here
        consultant: consultantEmail,
      };
      const response = await endChat.mutateAsync(payload); // API call
      if (response.data.Success) {
        setIsChatEnd(true);
        setIsReviewModalVisible(true);
      } else {
        console.log("Error ending the chat");
      }
    } catch (error) {
      console.log("End chat API error", error); // Log errors if any
    }
  };
  const onSend = async () => {
    if (inputText.trim().length > 0) {
      // Append user message
      const userMessage = {
        _id: Math.random().toString(36).substring(7), // Generate a unique ID
        text: inputText,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "You",
        },
      };
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, [userMessage])
      );
      setInputText(""); // Clear the input field

      const messagePayload = {
        content: inputText,
        room: room,
        sender: userEmail,
        receiver: consultantEmail,
        sender_image: ConstantStrings.url.base_url + consultantImage,
      };

      const messageResponse = await sendMessage.mutateAsync(messagePayload);
    }
  };

  // Custom input toolbar
  const renderInputToolbar = () => {
    if (isChatEnd) {
      return null;
    }
    return (
      <View style={styles.inputToolbar}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          multiline
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity
          onPress={onSend}
          style={[styles.sendButton]}
          disabled={inputText.trim().length === 0 || isRechargeScreenVisible}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim().length > 0 ? Colors.primary : "#ccc"}
          />
          {/* <Text style={styles.sendButtonText}>Send</Text> */}
        </TouchableOpacity>
      </View>
    );
  };
  const renderPricingCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.priceCardContainer}
        onPress={() =>
          handleFareBreakup(
            item.amount,
            item.offer_amount,
            item.offer_amount_percentage
          )
        }
      >
        <Text>Recharge</Text>
        <View style={{ flexDirection: "row", gap: 2 }}>
          <Text>with</Text>
          <Text style={styles.priceCardText}>{item.amount}</Text>
        </View>
        {item.offer_amount != 0 && (
          <View style={styles.promotionalMoneyContainer}>
            <Text>and get</Text>

            <Text style={styles.priceCardText}>{item.total_amount}</Text>
          </View>
        )}
        {/* Ribbon */}
        {item.offer_amount != 0 && (
          <View style={styles.ribbonContainer}>
            <View style={styles.ribbon}>
              <Text style={styles.ribbonText}>
                {item.offer_amount_percentage}% Extra
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  const handleEndChat = async () => {
    Alert.alert(
      "Are you sure you want to end the chat?", // Title
      "",
      [
        {
          text: "Cancel", // Button text for cancel
          onPress: () => {
            console.log("Chat end canceled");
          },
          style: "cancel", // Optional style for the cancel button
        },
        {
          text: "Yes", // Button text for confirm
          onPress: async () => {
            handleStop();
            handleChatDeduction(true);
          },
        },
      ],
      { cancelable: false } // Makes the alert non-dismissable by tapping outside
    );
  };

  const renderDay = (props) => {
    const { currentMessage } = props;

    if (!currentMessage.showDayHeader) {
      return null; // Don't render the header if not needed
    }

    const sessionStartDate = moment(currentMessage.sessionStartDate);
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    let displayDate;
    if (sessionStartDate.isSame(today, "day")) {
      displayDate = "Today";
    } else if (sessionStartDate.isSame(yesterday, "day")) {
      displayDate = "Yesterday";
    } else {
      displayDate = sessionStartDate.format("MMMM D, YYYY");
    }

    return (
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{displayDate}</Text>
      </View>
    );
  };

  const handleDeductionWithoutSessionEnd = async () => {
    setAlreadyDeducted(false);
    try {
      const payload = {
        room: room,
        amount: chatPrice,
        user: userEmail,
        consultant: consultantEmail,
        time: minimumChat,
      };
      const response = await chatDeduction.mutateAsync(payload);
      if (response.data.Success) {
        handleWalletCheckBalance();
        setAlreadyDeducted(true);
      }
    } catch (error) {
      console.log("deduction api error", error);
    }
  };

  const handleStartConversation = (startType) => {
    handleWalletCheckBalance(startType);
  };
  const handleSendConversation = async () => {
    try {
      const payload = {
        consultant: consultantEmail,
        type: "Direct",
        user: userEmail,
        conversation_type: "Chat",
      };
      const response = await sendChatRequest.mutateAsync(payload);
      if (response.data.Success) {
        setTimeLeft(Number(minimumChat) * 60);
        setIsChatEnd(false);
        setComingFromHistory(false);
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
      console.log(error, "send request api error");
    }
  };
  const handleWalletCheckBalance = async (startType) => {
    const payload = {
      email: userEmail,
      price: chatPrice,
      minutes: minimumChat,
    };
    const response = await checkWalletBalance.mutateAsync(payload);
    if (response.data.message.status == "success") {
      if (startType) {
        handleSendConversation();
      }
      closeTimeRemainingSheet();
      if (!isChatEnd) {
        setTimeLeft((prevTime) => prevTime + Number(minimumChat) * 60);
      }
    } else {
      closeTimeRemainingSheet();
      openRechargeScreenSheet();
    }
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ChatHeader
          background="#fff"
          title={consultantName}
          onBackPress={router.back}
          image={consultantImage}
          endChat={handleEndChat}
          timer={formatTime(timeLeft)}
        />

        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: "10%" }}>
          <GiftedChat
            messages={messages}
            user={{
              _id: 1, // User I
              name: "You",
            }}
            renderDay={renderDay}
            renderInputToolbar={renderInputToolbar} // Use custom input toolbar
            // renderMessage={renderMessage}
          />
        </View>
        {isChatEnd && (
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.button}>
              <>
                <Ionicons name="call" size={16} color="white" />
                <Text style={styles.counsellorRate}>Call</Text>
                <Text style={styles.counsellorRate}>
                  {consultantFullDetails.call_price}/min
                </Text>
              </>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleStartConversation(true)}
            >
              <>
                <Ionicons name="chatbubble" size={16} color="white" />
                <Text style={styles.counsellorRate}>Chat</Text>
                <Text style={styles.counsellorRate}>
                  {consultantFullDetails.chat_price}/min
                </Text>
              </>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
      {isModalVisible && (
        <Animated.View
          style={{
            height: animatedHeight,
            transform: [{ translateY }],
            gap: 12,
            alignItems: "center",
            padding: 10,
            backgroundColor: "#fff",
            borderTopWidth: 2,
            borderColor: "#d3d3d3",
            marginTop: 10,
          }}
        >
          {checkWalletBalance.isPending ? (
            <>
              <ActivityIndicator size={24} color={Colors.primary} />
              <Text>Please Wait...</Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginRight: 20,
                  fontWeight: "600",
                }}
              >
                You have {formatTime(timeLeft)} remaining. Do you want to
                continue?
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: "2%", top: "2%" }}
                onPress={() => closeTimeRemainingSheet()}
              >
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
              <Button
                title={"Continue"}
                onPress={handleDeductionWithoutSessionEnd}
                style={{ width: "100%" }}
              />
            </>
          )}
        </Animated.View>
      )}

      {isRechargeModalVisible && (
        <Animated.View
          style={{
            height: animatedHeight,
            transform: [{ translateY }],
            gap: 12,
            alignItems: "center",
            padding: 10,
            backgroundColor: "#fff",
            borderTopWidth: 2,
            borderColor: "#d3d3d3",
            marginTop: 10,
          }}
        >
          <>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                marginRight: 20,
                fontWeight: "600",
              }}
            >
              You Don't have Enough Balance to Chat, Please Recharge
            </Text>
            <TouchableOpacity
              style={{ position: "absolute", right: "2%", top: "2%" }}
              onPress={() => {
                toggleRechargeModal(), resumeTimer();
              }}
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
            <Button
              title={"Recharge"}
              onPress={() => {
                pauseTimer(), toggleRechargeModal(), toggleRechargeScreen();
              }}
              style={{ width: "100%" }}
            />
          </>
        </Animated.View>
      )}
      {isRechargeScreenVisible && (
        <Animated.View
          style={{
            height: animatedHeight,
            transform: [{ translateY }],
            gap: 22,
            alignItems: "center",
            padding: 10,
            backgroundColor: "#fff",
            borderTopWidth: 2,
            borderColor: "#d3d3d3",
            marginTop: 10,
          }}
        >
          <>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                marginRight: 20,
                fontWeight: "600",
              }}
            >
              You Don't have Enough Balance to Chat, Please Recharge
            </Text>
            <View style={{ flexDirection: "row", width: "100%", gap: 16 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  flex: 1,
                  paddingHorizontal: 14,
                  fontSize: 16,
                  borderRadius: 10,
                  borderColor: "#d3d3d3",
                }}
                placeholder="Enter an amount"
                onChangeText={(text) => setAmount(text)}
                value={amount}
                keyboardType="numeric"
              />
              <Button title={"recharge"} onPress={() => handleRecharge()} />
            </View>
          </>
        </Animated.View>
      )}
      {isReviewModalVisible && (
        <ReviewModal
          visible={isReviewModalVisible}
          onClose={() => setIsReviewModalVisible(false)}
          consultantEmail={consultantEmail}
          userEmail={userEmail}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bottomModalVisible}
        onRequestClose={() => setBottomModalVisible(false)}
        style={{ margin: 0 }}
      >
        {/* Background overlay to close modal */}

        <View style={styles.overlay}>
          {/* Prevent tap propagation inside the bottom sheet */}

          <View style={styles.bottomSheet}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                Please choose a price
              </Text>
            </View>
            <FlatList
              data={pricingList}
              renderItem={renderPricingCard}
              numColumns={2}
              style={{ height: "100%" }}
              keyExtractor={(item) => item.amount.toString()}
              columnWrapperStyle={{
                justifyContent: "space-between", // Adjust spacing between columns
                gap: 20,
                paddingVertical: 4,
              }}
              showsVerticalScrollIndicator={false}
            />
            <Button
              title="Close"
              onPress={() => setBottomModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={fareBreakdownModalVisible}
        onRequestClose={() => setFareBreakdownModalVisible(false)}
        style={{ margin: 0 }}
      >
        {/* Background overlay to close modal */}

        <View style={styles.overlay}>
          {/* Prevent tap propagation inside the bottom sheet */}

          <View style={styles.bottomSheet}>
            {isRechargeSuccessful ? (
              <>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <LottieView
                    source={require("../../assets/lotties/tick_lottie.json")} // Path to your Lottie file
                    autoPlay
                    loop={true}
                    style={styles.lottie}
                    speed={0.5}
                  />
                  <Text style={styles.modalTitle}>Recharge Successful</Text>
                  <Text style={styles.message}>
                    Your recharge has been completed successfully!
                  </Text>
                  <Button
                    title="close"
                    onPress={() => {
                      setFareBreakdownModalVisible(false),
                        handleWalletCheckBalance(isChatEnd ? true : false),
                        resumeTimer();
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{ position: "absolute", left: 0 }}
                    onPress={() => {
                      setBottomModalVisible(true),
                        setFareBreakdownModalVisible(false);
                    }}
                  >
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>

                  <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    Payment Information
                  </Text>
                </View>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.scrollViewMainContainer}>
                    <View style={styles.paymentCard}>
                      {/* Header */}
                      <View style={styles.paymentCardHeader}>
                        <Text style={styles.paymentCardHeaderText}>
                          Payment Details
                        </Text>
                      </View>

                      {/* Payment Details */}
                      <View style={styles.paymentCardDetails}>
                        <View style={styles.paymentCardDetailRow}>
                          <Text style={styles.paymentCardLabel}>
                            Total Amount
                          </Text>
                          <Text style={styles.paymentCardValue}>
                            ₹{fareBreakdown?.amount}
                          </Text>
                        </View>
                        <View style={styles.paymentCardDetailRow}>
                          <Text style={styles.paymentCardLabel}>
                            Tax ({fareBreakdown?.tax_percent}%)
                          </Text>
                          <Text style={styles.paymentCardValue}>
                            ₹{fareBreakdown?.tax_amount.toFixed(1)}
                          </Text>
                        </View>
                        <View style={styles.paymentCardDetailRow}>
                          <Text
                            style={[
                              styles.paymentCardLabel,
                              styles.paymentCardTotalLabel,
                            ]}
                          >
                            Total Payable
                          </Text>
                          <Text
                            style={[
                              styles.paymentCardValue,
                              styles.paymentCardTotalValue,
                            ]}
                          >
                            ₹{fareBreakdown?.total_payable_amount.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {fareBreakdown?.offer_amount != 0 && (
                      <View style={styles.dottedCardContainer}>
                        <View
                          style={{
                            backgroundColor: "#4c8fc6",
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {fareBreakdown?.offer_percent}% extra on recharge of{" "}
                            {fareBreakdown?.amount}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <AntDesign
                            name="checkcircle"
                            size={22}
                            color="#28a745"
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              flex: 1,
                              color: Colors.grey.medium,
                              fontWeight: "600",
                            }}
                          >
                            ₹ {fareBreakdown?.offer_amount} cashback in Krew
                            wallet with this recharge.
                          </Text>
                        </View>
                      </View>
                    )}
                    <View style={styles.upiCard}>
                      <View style={{ gap: 14 }}>
                        <Text style={styles.title}>
                          Pay directly with favourite UPI app
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 28,
                          }}
                        >
                          <View style={{ alignItems: "center", gap: 10 }}>
                            <TouchableOpacity
                              style={{
                                borderRadius: 10,
                                backgroundColor: "#fff",
                                elevation: 3,
                                shadowColor: "#000",
                                shadowOpacity: 0.1,
                                shadowOffset: { width: 0, height: 2 },
                                shadowRadius: 5,
                                padding: 8,
                                width: 60,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <GooglePayIcon width={40} height={40} />
                            </TouchableOpacity>
                            <Text>Gpay</Text>
                          </View>
                          <View style={{ alignItems: "center", gap: 10 }}>
                            <TouchableOpacity
                              style={{
                                borderRadius: 10,
                                backgroundColor: "#fff",
                                elevation: 3,
                                shadowColor: "#000",
                                shadowOpacity: 0.1,
                                shadowOffset: { width: 0, height: 2 },
                                shadowRadius: 5,
                                padding: 8,
                                width: 60,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <PhonePeIcon width={40} height={40} />
                            </TouchableOpacity>
                            <Text>phonePe</Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{ height: 1, backgroundColor: "#d3d3d3" }}
                      ></View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <BhimIcon />
                          <Text style={{ fontSize: 16, fontWeight: "600" }}>
                            Pay with other UPI app
                          </Text>
                        </View>

                        <AntDesign
                          name="right"
                          size={24}
                          color={Colors.grey.normal}
                        />
                      </View>
                    </View>
                    <View style={styles.otherOptionsCard}>
                      <Text style={styles.title}>Other Payment Methods</Text>

                      <TouchableOpacity
                        style={styles.option}
                        onPress={() => handleSelection("UPI")}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <UpiIcon width={40} height={40} />
                          <Text style={styles.optionText}>UPI</Text>
                        </View>

                        <View style={styles.radio}>
                          {selectedPaymentMethod === "UPI" && (
                            <View style={styles.selectedRadio} />
                          )}
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.option}
                        onPress={() => handleSelection("Credit/Debit Card")}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <DebitCardIcon width={40} height={40} />
                          <Text style={styles.optionText}>
                            Credit/Debit Card
                          </Text>
                        </View>
                        <View style={styles.radio}>
                          {selectedPaymentMethod === "Credit/Debit Card" && (
                            <View style={styles.selectedRadio} />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
                <View>
                  <Button
                    title={"Proceed to pay"}
                    onPress={() => handleRecharge()}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  inputToolbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    // borderTopLeftRadius: 20, // Rounded corne
    // borderTopRightRadius: 20, // Rounded corner
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: -2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 10, // Shadow radius
    elevation: 5, // Elevation for Android shado
  },
  input: {
    flex: 1,
    minHeight: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  sendButton: {
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageContainer: {
    paddingVertical: 10, // Reduced vertical padding for more compact messages
    paddingHorizontal: 10, // Reduced horizontal padding
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    marginHorizontal: 16,
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: "#E0E0E0",
    color: "#555",
    fontSize: 12,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  bottomButtons: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    // borderTopLeftRadius: 20, // Rounded corners
    // borderTopRightRadius: 20, // Rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: -2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 10, // Shadow radius
    elevation: 5, // Elevation for Android shadow
    gap: 10,
  },
  counsellorRate: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
  },
  button: {
    backgroundColor: Colors.primary,
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    gap: 3,
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  overlay: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: "flex-end", // Aligns modal to the bottom
    // backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "50%", // Adjust the height as needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  ribbonContainer: {
    position: "absolute",
    top: 15,
    right: -20,
    overflow: "hidden",
    transform: [{ rotate: "45deg" }],
  },
  ribbon: {
    backgroundColor: "#FF5722",
    height: 20,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  ribbonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  promotionalMoneyContainer: {
    flexDirection: "row",
    gap: 2,
  },
  priceCardContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "47%",
    height: 100,
    marginTop: 20,
    overflow: "hidden",
    gap: 4,
  },
  priceCardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  scrollView: {
    paddingTop: "12%",
    backgroundColor: "#fff",
  },
  parentComponent: {
    flex: 1,
  },
  scrollViewMainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: "40%",
  },
  paymentCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  paymentCardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 15,
  },
  paymentCardHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.grey.medium,
  },
  paymentCardDetails: {
    gap: 10,
  },
  paymentCardDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  paymentCardLabel: {
    fontSize: 16,
    color: "#555",
  },
  paymentCardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  paymentCardTotalLabel: {
    fontWeight: "bold",
    fontSize: 18,
  },
  paymentCardTotalValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  dottedCardContainer: {
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    backgroundColor: "#fff",
  },
  dottedCardHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  dottedCardContentText: {
    fontSize: 16,
    color: "#555",
  },
  upiCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    gap: 28,
  },
  otherOptionsCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#1169bb",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadio: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "#1169bb",
  },
  optionText: {
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
