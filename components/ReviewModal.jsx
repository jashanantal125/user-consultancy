import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { Colors } from "@/constants/Colors";

const ReviewModal = ({ visible, onClose, consultantEmail, userEmail }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const submitReview = useSubmitReview();

  const handleSubmitReview = async () => {
    const payload = {
      consultant: consultantEmail,
      user: userEmail,
      rating: rating * 0.2,
      comment: review,
    };
    try {
      const response = await submitReview.mutateAsync(payload);
      console.log(response.data);
      Alert.alert("Thank you for your feedback!");
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to submit feedback. Please try again later.");
    }
  };

  const handleSubmit = () => {
    if (rating === 0 && review.trim() === "") {
      Alert.alert(
        "Please provide either a rating or a review before submitting."
      );
      return;
    }
    onClose();
    handleSubmitReview();
  };

  const handleCancel = () => {
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Rate Our Chat</Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <AntDesign
                  name={star <= rating ? "star" : "staro"}
                  size={30}
                  color={star <= rating ? "#FFD700" : "#CCC"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Write your review here..."
            multiline
            value={review}
            onChangeText={setReview}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  textInput: {
    height: 80,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#DDD",
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ReviewModal;
