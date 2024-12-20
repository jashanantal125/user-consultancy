import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/stores/userStore";
import { ScrollView } from "react-native";
import PricingCard from "@/components/PricingCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useGetPricingList } from "../../hooks/useGetPricingList";
import { FlatList } from "react-native-gesture-handler";

const Wallet = () => {
  const [amount, setAmount] = useState();
  const router = useRouter();
  const userDetails = useUserStore((state) => state.userDetails);
  const walletBalance = useUserStore((state) => state.walletBalance);
  const [pricingList, setPricingList] = useState();
  const { width } = Dimensions.get("window");

  const getPricingList = useGetPricingList();

  const handleGetPricingList = async () => {
    const response = await getPricingList.mutateAsync();
    setPricingList(response.data.data);
  };

  const handleNavigateToPaymentInformation = (
    amount,
    offerAmount,
    offerAmountPercentage,
    total
  ) => {
    router.push({
      pathname: "/paymentinformation",
      params: {
        amount: amount,
        offerAmount: offerAmount,
        offerAmountPercentage: offerAmountPercentage,
        total: total,
      },
    });
  };

  useEffect(() => {
    handleGetPricingList();
  }, []);

  const renderPricingCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.priceCardContainer}
        onPress={() =>
          handleNavigateToPaymentInformation(
            item.amount,
            item.offer_amount,
            item.offer_amount_percentage,
            item.total_amount
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

  return (
    <View style={styles.mainContainer}>
      <Header title="Wallet" background="#fff" onBackPress={router.back} />
      <View style={styles.contents}>
        <LinearGradient
          colors={["#1169bb", "#0e4a8e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.availableBalanceCard}
        >
          <View style={styles.availableBalanceContainer}>
            <FontAwesome name="rupee" size={20} color="white" />
            <Text style={styles.availableBalanceText}>{walletBalance}</Text>
          </View>

          <Text style={styles.balance}>Available Balance</Text>
        </LinearGradient>
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
          <Button
            title={"Recharge"}
            onPress={() => handleNavigateToPaymentInformation(amount)}
            disabled={!amount || amount === "0"}
          />
        </View>
        <View>
          {/* <View style={styles.pricingContainer}></View> */}
          <FlatList
            data={pricingList}
            renderItem={renderPricingCard}
            numColumns={2}
            style={{ height: "100%" }}
            keyExtractor={(item) => item.amount.toString()}
            columnWrapperStyle={{
              justifyContent: "space-between", // Adjust spacing between columns
              gap: 20,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  contents: {
    paddingVertical: "10%",
    paddingHorizontal: "3%",
    gap: 28,
  },
  availableBalanceCard: {
    backgroundColor: Colors.primary,
    marginTop: "20%",
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    gap: 10,
  },
  availableBalanceText: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  balance: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  pricingContainer: {
    backgroundColor: "red",
  },
  scrollView: {
    paddingBottom: 40,
  },
  availableBalanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
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
});
