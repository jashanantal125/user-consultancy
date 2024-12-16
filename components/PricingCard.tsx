import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const PricingCard = () => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <Text style={styles.cardText}>500</Text>
      {/* Ribbon */}
      <View style={styles.ribbonContainer}>
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>100%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default PricingCard;

const styles = StyleSheet.create({
  cardContainer: {
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
    width: "40%",
    height: 100,
    marginTop: 20,
    overflow: "hidden",
  },

  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
