import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import GooglePayIcon from "../../assets/icons/googlepay_icon.svg";
import PhonePeIcon from "../../assets/icons/phonepe-icon.svg";
import BhimIcon from "../../assets/icons/bhim_icon.svg";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFareBreakup } from "../../hooks/useFareBreakup";
import { useRechargeApi } from "@/hooks/useRechargeApi";
import { useUserStore } from "@/stores/userStore";
import LottieView from "lottie-react-native";
import UpiIcon from "../../assets/icons/upi-icon.svg";

const PaymentInformation = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [fareBreakdown, setFareBreakdown] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { amount, offerAmount, offerAmountPercentage } = useLocalSearchParams();
  const getFareBreakup = useFareBreakup();
  const rechargeApi = useRechargeApi();
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));

  const handleRechargeModal = () => {
    setModalVisible(true);
  };

  const handleFareBreakup = async () => {
    const payload = {
      amount: amount,
      offer: offerAmount,
      offerPercent: offerAmountPercentage,
    };
    const response = await getFareBreakup.mutateAsync(payload);
    console.log(response.data.data);
    setFareBreakdown(response.data.data);
  };

  const handleSelection = (method) => {
    setSelectedPaymentMethod(method);
  };

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
      handleRechargeModal();
    }
  };

  useEffect(() => {
    handleFareBreakup();
  }, []);

  return (
    <SafeAreaView style={styles.parentComponent}>
      <Header
        title={"Payment Information"}
        background={"#fff"}
        onBackPress={router.back}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewMainContainer}>
          <View style={styles.paymentCard}>
            {/* Header */}
            <View style={styles.paymentCardHeader}>
              <Text style={styles.paymentCardHeaderText}>Payment Details</Text>
            </View>

            {/* Payment Details */}
            <View style={styles.paymentCardDetails}>
              <View style={styles.paymentCardDetailRow}>
                <Text style={styles.paymentCardLabel}>Total Amount</Text>
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
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
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
              <AntDesign name="checkcircle" size={22} color="#28a745" />
              <Text
                style={{
                  fontSize: 14,
                  flex: 1,
                  color: Colors.grey.medium,
                  fontWeight: "600",
                }}
              >
                ₹ {fareBreakdown?.offer_amount} cashback in Krew wallet with
                this recharge.
              </Text>
            </View>
          </View>
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
            <View style={{ height: 1, backgroundColor: "#d3d3d3" }}></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BhimIcon />
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  Pay with other UPI app
                </Text>
              </View>

              <AntDesign name="right" size={24} color={Colors.grey.normal} />
            </View>
          </View>
          <View style={styles.otherOptionsCard}>
            <Text style={styles.title}>Other Payment Methods</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelection("UPI")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
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
              <Text style={styles.optionText}>Credit/Debit Card</Text>
              <View style={styles.radio}>
                {selectedPaymentMethod === "Credit/Debit Card" && (
                  <View style={styles.selectedRadio} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: 100,
          width: "100%",
          backgroundColor: "#fff",
          justifyContent: "center",
          paddingVertical: 14,
          paddingHorizontal: 18,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
        }}
      >
        <Button title={"Proceed to pay"} onPress={() => handleRecharge()} />
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleRechargeModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default PaymentInformation;

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.grey.medium,
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
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
  button: {
    backgroundColor: "#1169bb",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
