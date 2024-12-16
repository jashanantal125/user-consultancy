// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
// } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { useSocket } from "@/Socket/socket";
// import axios from "axios";
// import useStore from "../store";
// import { socket, io } from "socket.io-client";

// // Header component for chat screen
// const ChatHeader = ({ userName, profilePic }) => {
//   return (
//     <View style={styles.headerContainer}>
//       <Image source={profilePic} style={styles.profileImage} />
//       <Text style={styles.userName}>{userName}</Text>
//     </View>
//   );
// };

// const ChatScreen = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   const roomName = "Pandit call";
//   const user = "hs pranoy";
//   const email = "hspranoy@gmail.com";
//   const sid = useStore((state) => state.sid);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (sid) {
//       console.log("Initializing socket with SID:", sid);

//       const newSocket = io("http://65.0.52.105:9005/astrology", {
//         withCredentials: true,
//         extraHeaders: {
//           sid: sid,
//         },
//       });

//       setSocket(newSocket);

//       // Log socket events
//       newSocket.on("connect", () => {
//         console.log("Socket connected with ID:", newSocket.id); // Logs when connected
//       });

//       newSocket.on("connect_error", (error) => {
//         console.error("Socket connection error:", error); // Logs connection error
//       });

//       newSocket.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });

//       return () => {
//         newSocket.disconnect(); // Disconnect on cleanup
//         console.log("Socket disconnected on cleanup");
//       };
//     } else {
//       console.log("SID is missing, socket not initialized");
//     }
//   }, [sid]);

//   const sendMessage = async () => {
//     if (message.trim() !== "") {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { content: message, sender: user },
//       ]);
//       setMessage("");
//       try {
//         const response = await axios.post(
//           "http://65.0.52.105:9005/api/method/chat.api.message.send",
//           {
//             content: message,
//             user,
//             room: roomName,
//             email,
//           }
//         );

//         if (response.status === 200) {
//           console.log("Message sent successfully");
//         }
//       } catch (error) {
//         console.error("Failed to send message:", error);
//       }
//     }
//   };

//   // Hardcoded values for demonstration
//   const userName = "Astrologer"; // Replace with actual user's name
//   const profilePic = require("../../assets/images/man.png"); // Replace with actual profile picture source

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // adjust the value here if keyboard covers your input
//     >
//       <ChatHeader userName={userName} profilePic={profilePic} />

//       <FlatList
//         data={messages}
//         renderItem={({ item }) => (
//           <View
//             style={
//               item.sender === user
//                 ? styles.myMessageContainer
//                 : styles.theirMessageContainer
//             }
//           >
//             <Text style={styles.messageSender}>{item.sender}</Text>
//             <Text style={styles.messageText}>{item.content}</Text>
//           </View>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//         style={styles.messagesContainer}
//         contentContainerStyle={styles.messagesContent}
//       />

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type your message..."
//           value={message}
//           onChangeText={setMessage}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#FF1D58",
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEE",
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FFF",
//   },
//   messagesContainer: {
//     flex: 1,
//   },
//   messagesContent: {
//     paddingHorizontal: 10,
//     paddingBottom: 10,
//   },
//   myMessageContainer: {
//     alignSelf: "flex-end",
//     backgroundColor: "#FF1D58",
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 8,
//     maxWidth: "80%",
//   },
//   theirMessageContainer: {
//     alignSelf: "flex-start",
//     backgroundColor: "#EEE",
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 8,
//     maxWidth: "80%",
//   },
//   messageSender: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   messageText: {
//     fontSize: 16,
//     color: "white",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 30,
//     borderTopWidth: 1,
//     borderTopColor: "#CCCCCC",
//     backgroundColor: "#FFFFFF",
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#CCCCCC",
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: "#FF1D58",
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   sendButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default ChatScreen;
