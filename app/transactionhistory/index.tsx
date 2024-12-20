import Button from "@/components/Button";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { Dimensions, SafeAreaView, Text, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useGetPaymentLogs } from "../../hooks/useGetPaymentLogs";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import Feather from "@expo/vector-icons/Feather";
import { useGetWalletTransactions } from "../../hooks/useGetWalletTransactions";

const TransactionHistory = () => {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const [paymentLogs, setPaymentLogs] = useState();
  const [walletLogs, setWalletLogs] = useState();
  const walletBalance = useUserStore((state) => state.walletBalance);
  const [routes] = useState([
    { key: "first", title: "Wallet Transactions" },
    { key: "second", title: "Payment Logs" },
  ]);
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const getPaymentLogs = useGetPaymentLogs();
  const getWalletLogs = useGetWalletTransactions();

  const handleGetPaymentLogs = async () => {
    try {
      const response = await getPaymentLogs.mutateAsync(userEmail);
      setPaymentLogs(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetWalletLogs = async () => {
    try {
      const response = await getWalletLogs.mutateAsync(userEmail);
      setWalletLogs(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleNavigateToWallet = () => {
    router.push("/wallet");
  };

  useFocusEffect(
    useCallback(() => {
      if (index === 0) {
        handleGetWalletLogs();
      } else {
        handleGetPaymentLogs(); // Or any logic you want to run
      }
    }, [index])
  );
  const WalletTransactions = () => {
    return (
      <View style={{ flex: 1, marginTop: 16 }}>
        <FlatList
          data={walletLogs}
          renderItem={renderPaymentLogs}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderPaymentLogs = ({ item }) => {
    const formattedDate = moment(item?.transaction_date).format(
      "DD MMM YY, h:mm A"
    );
    const handleCopy = async () => {
      if (item?.transaction_id) {
        await Clipboard.setStringAsync(item.transaction_id);

        // Show the toast message
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Transaction ID copied to clipboard!",
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "No Transaction ID found!",
          visibilityTime: 3000,
        });
      }
    };
    return (
      <View
        style={{
          borderColor: "#d3d3d3",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 5,
          backgroundColor: "white",
          borderRadius: 12,
          padding: 12,
          gap: 8,
          marginHorizontal: 16,
          marginVertical: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 16, color: "#000", fontWeight: "600", flex: 1 }}
          >
            {item?.is_cashback
              ? "Cashback"
              : item?.transaction_type == "DEBIT"
              ? `Chat with ${item?.consultant} for ${item?.total_minutes} minutes`
              : "Recharge"}
          </Text>
          <Text
            style={{
              color: item?.transaction_type == "DEBIT" ? "#FF4D4D" : "#28a745",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {item?.is_cashback
              ? `+ ₹${item?.cashback}`
              : item?.transaction_type == "DEBIT"
              ? `- ₹${item.amount}`
              : `+ ₹${item.amount}`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: Colors.grey.medium }}>{formattedDate}</Text>
          {item.transaction_type !== "DEBIT" && item.is_cashback == false && (
            <Text style={{ color: Colors.grey.medium }}>
              Tax {item?.tax_amount}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={handleCopy} activeOpacity={0.7}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", gap: 2, alignItems: "flex-end" }}
            >
              <Text style={{ color: Colors.grey.medium }}>
                {item?.transaction_id}
              </Text>
              <Feather name="copy" size={14} color={Colors.grey.medium} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const OrdersTransactions = ({ item }) => {
    return (
      <View style={{ flex: 1, marginTop: 16 }}>
        <FlatList
          data={paymentLogs}
          renderItem={renderPaymentLogs}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: "4%",
          alignItems: "center",
        }}
      >
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 16, color: "#333" }}>Available Balance</Text>
          <Text style={{ fontSize: 18, color: "#000", fontWeight: "600" }}>
            ₹ {walletBalance}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 6,
            borderRadius: 5,
          }}
          onPress={() => handleNavigateToWallet()}
        >
          <Text style={{ color: "#fff" }}>Recharge</Text>
        </TouchableOpacity>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: WalletTransactions,
          second: OrdersTransactions,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#1169BB", height: 3 }}
            style={{
              backgroundColor: Colors.secondary,
              borderTopWidth: 1,
              marginTop: "8%",
              borderColor: Colors.grey.veryLight,
            }}
            labelStyle={{ color: "white", fontSize: 14 }}
            activeColor="#1169BB"
            inactiveColor="#757575"
          />
        )}
      />
    </View>
  );
};
export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: "6%",
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

  tabScreen: {
    backgroundColor: "#fff",
    flex: 1,
  },
});
