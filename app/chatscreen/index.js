import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Header component for chat screen
const ChatHeader = ({ userName, profilePic }) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={profilePic} style={styles.profileImage} />
      <Text style={styles.userName}>{userName}</Text>
    </View>
  );
};

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  // Hardcoded values for demonstration
  const userName = 'Astrologer'; // Replace with actual user's name
  const profilePic = require('../../assets/images/man.png'); // Replace with actual profile picture source

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // adjust the value here if keyboard covers your input
    >
      <ChatHeader userName={userName} profilePic={profilePic} />

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FF1D58',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF1D58',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF1D58',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;


