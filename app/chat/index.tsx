import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Animated,
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
    setIsRechargeScreenVisible(true);
  };
  const closeRechargeScreenSheet = () => {
    setIsRechargeScreenVisible(false);
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
        time: isEndChatPressed ? remainingTime.toFixed(1) : minimumChat,
      };
      const response = await chatDeduction.mutateAsync(payload);
      if (response.data.Success) {
        handleEndSession();
      }
    } catch (error) {
      console.log("deduction api error", error);
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
        console.log("this is ");
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

  const handleRecharge = async () => {
    const payload = {
      amount: amount,
      user: userEmail,
    };
    const response = await rechargeApi.mutateAsync(payload);
    if (response.data.Success) {
      closeRechargeScreenSheet();
      handleWalletCheckBalance(isChatEnd ? true : false);
      resumeTimer();

      console.log(response.data);
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
      console.log("not working");
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
});
