import React, { forwardRef, useState, useImperativeHandle } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

const BottomSheetModal = forwardRef(({ children }, ref) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = new Animated.Value(screenHeight); // Start off-screen

  // Methods exposed to the parent component
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to the bottom of the screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    close: () => {
      Animated.timing(slideAnim, {
        toValue: screenHeight, // Slide off-screen
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    },
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <TouchableWithoutFeedback onPress={() => ref.current?.close()}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.bottomSheet}>{children}</View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
  },
  bottomSheetContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    minHeight: 200,
  },
});

export default BottomSheetModal;
