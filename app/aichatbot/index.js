import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // Store all messages in the chat

  const handleInput = async () => {
    if (!input.trim()) return; // Prevent empty input submission

    const userMessage = input;
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'User', message: userMessage },
    ]);

    setInput('');

    try {
      console.log('Sending request...');
      const response = await axios.post(
        'https://api.openai.com/v1/completions', // Correct endpoint for chat-based models
        {
          model: 'gpt-3.5-turbo', // You can use gpt-3.5-turbo or gpt-4
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userMessage },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
          },
        }
      );

      console.log('Response:', response.data); // Log the response for debugging
      const aiMessage = response.data.choices[0].message.content.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'AI', message: aiMessage },
      ]);
    } catch (error) {
      console.error('Error fetching from OpenAI API', error.response ? error.response.data : error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'AI', message: 'Sorry, something went wrong.' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Chatbot</Text>
      <View style={styles.chatContainer}>
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View key={index} style={msg.sender === 'User' ? styles.userMessage : styles.aiMessage}>
              <Text style={msg.sender === 'User' ? styles.userText : styles.aiText}>
                {msg.message}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here"
            onChangeText={(text) => setInput(text)}
            value={input}
            returnKeyType="send"
            onSubmitEditing={handleInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleInput}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatContainer: {
    width: '90%',
    height: '70%',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    maxWidth: '80%',
  },
  aiMessage: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    maxWidth: '80%',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  aiText: {
    color: '#000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Chatbot;
