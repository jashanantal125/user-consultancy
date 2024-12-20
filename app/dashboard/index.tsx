import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
  Pressable,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo
import Home from "../home";
import Chat from "../chat";
import Wallet from "../wallet";
import DefaultProfile from "../../assets/images/default_profile_blue.jpg";
import Logo from "../../assets/images/krewlogo.png";
import { Modal } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/stores/authStore";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useUserStore } from "@/stores/userStore";
import { useGetWalletInfo } from "../../hooks/useGetWalletInfo";
import { ConstantStrings } from "@/constants/ConstantStrings";
import ChatHistory from "../chathistory";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TransactionHistory from "../transactionhistory";
import Feather from "@expo/vector-icons/Feather";
import PrivacyPolicy from "../privacypolicy";
import TermsAndCondition from "../termsandconditions";
import AboutUs from "../aboutus";
import HelpAndSupport from "../helpandsupport";
import FAQ from "../faq";
import Constants from "expo-constants";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  // const version = Constants.expoConfig?.version;
  // console.log(version);
  const router = useRouter();
  const { clearAuth } = useAuthStore.getState();
  const getUserInfo = useGetUserInfo();
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const setUserDetails = useUserStore((state) => state.setUserDetails);
  const { clearEmail } = useUserStore.getState();
  const userDetails = useUserStore((state) => state.userDetails);

  const handleLogout = () => {
    clearAuth();
    clearEmail();
    setLogoutVisible(false);
    router.replace("/");
    // Perform logout actions here (e.g., clearing tokens)
    // Alert.alert("Logged Out", "You have been successfully logged out.", [
    //   {
    //     text: "Ok",
    //     onPress: () => {
    //       router.replace("/");
    //     },
    //   },
    // ]);
  };

  const handleGetUserInfo = useCallback(async () => {
    try {
      const response = await getUserInfo.mutateAsync(userEmail);

      setUserDetails(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [userEmail]);

  useEffect(() => {
    handleGetUserInfo();
  }, []);
  return (
    <DrawerContentScrollView {...props}>
      {/* Header Section */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/myprofile")}>
          <Image
            source={{
              uri: ConstantStrings.url.base_url + userDetails?.user_image,
            }}
            style={styles.headerImage}
          />

          <Feather
            name="edit"
            size={24}
            color="white"
            style={{ right: "-6%", position: "absolute", bottom: "10%" }}
          />
        </Pressable>
        <Text style={styles.headerText}>
          Welcome, {userDetails?.first_name}
        </Text>
        <Pressable
          onPress={() => props.navigation.closeDrawer()}
          style={{ position: "absolute", right: "6%", top: "6%" }}
        >
          <Entypo name="cross" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>

      {/* <View style={styles.additionalOptions}>
        {[
          {
            title: "Terms & Conditions",
            onPress: () => router.push("/termsandconditions"),
          },
          { title: "About Us", onPress: () => router.push("/aboutus") },
          {
            title: "Privacy Policy",
            onPress: () => router.push("/privacypolicy"),
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={item.onPress}
          >
            <Text style={styles.optionText}>{item.title}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={Colors.grey.medium}
            />
          </TouchableOpacity>
        ))}
      </View> */}

      <TouchableOpacity
        style={styles.logoutContainer}
        onPress={() => setLogoutVisible(true)}
      >
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* <View>
        <Text>{version}</Text>
      </View> */}
      {/* Logout Popup */}
      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setLogoutVisible(false)} />
              <Button title="Logout" onPress={handleLogout} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

const DashboardScreen = () => {
  const [walletInfo, setWalletInfo] = useState();
  const getWalletInfo = useGetWalletInfo();
  const router = useRouter();
  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const handleGetWalletInfo = useCallback(async () => {
    try {
      const response = await getWalletInfo.mutateAsync(userEmail);
      setWalletInfo(response.data.data);
      useUserStore
        .getState()
        .setWalletBalance(response.data.data.available_balance);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    handleGetWalletInfo();
  }, []);
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: "",
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            {/* Drawer Toggle Icon */}
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>

            {/* Logo Right Next to Icon */}
            <View style={styles.logoContainer}>
              <Image source={Logo} style={styles.logo} />
            </View>
          </View>
        ),

        headerRight: () => (
          <TouchableOpacity
            style={styles.walletContainer}
            onPress={() => router.push("/wallet")}
          >
            <AntDesign name="wallet" size={20} color={Colors.primary} />
            <Text style={styles.walletText}>
              {walletInfo?.available_balance}
            </Text>
          </TouchableOpacity>
        ),
        drawerItemStyle: {
          borderBottomWidth: 1,
          borderBottomColor: "#d3d3d3",
          borderRadius: 0,
          marginHorizontal: 0,
        },
        drawerLabelStyle: {
          marginLeft: -22, // Move the label closer to the icon
          fontSize: 16, // Optional: Adjust font size
        },
        drawerIconContainerStyle: {
          marginRight: -5, // Reduce margin between icon and label
        },
        drawerActiveTintColor: Colors.primary, // Color when the item is selected (active)
        drawerInactiveTintColor: "gray",
        drawerStyle: {
          width: "60%",
        },
        drawerActiveBackgroundColor: "#fff",
      })}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatHistory}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
          drawerLabel: "Chat History",

          headerTitle: "Chat History", // Set the custom title
          headerStyle: {
            backgroundColor: "#fff", // Optional: Customize header background color
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333", // Optional: Customize title color
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Navigate back to the Home screen
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => {
            null;
          },
        })}
      />
      <Drawer.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
          drawerLabel: "Transactions History",

          headerTitle: "Transactions History", // Set the custom title
          headerStyle: {
            backgroundColor: "#fff", // Optional: Customize header background color
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333", // Optional: Customize title color
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Navigate back to the Home screen
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        })}
      />
      <Drawer.Screen
        name="HelpAndSupport"
        component={HelpAndSupport}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="support-agent" size={size} color={color} />
          ),
          drawerLabel: "Help and Support",

          headerTitle: "Help and Support", // Set the custom title
          headerStyle: {
            backgroundColor: "#fff", // Optional: Customize header background color
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333", // Optional: Customize title color
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Navigate back to the Home screen
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        })}
      />
      <Drawer.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <Feather name="lock" size={size} color={color} />
          ),
          drawerLabel: "Privacy Policy",

          headerTitle: "Privacy Policy", // Set the custom title
          headerStyle: {
            backgroundColor: "#fff", // Optional: Customize header background color
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333", // Optional: Customize title color
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Navigate back to the Home screen
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        })}
      />
      <Drawer.Screen
        name="Terms&Conditions"
        component={TermsAndCondition}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <AntDesign name="filetext1" size={size} color={color} />
          ),
          drawerLabel: "Terms & Conditions",

          headerTitle: "Terms & Conditions", // Set the custom title
          headerStyle: {
            backgroundColor: "#fff", // Optional: Customize header background color
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333", // Optional: Customize title color
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Navigate back to the Home screen
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        })}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="info-outline" size={size} color={color} />
          ),
          drawerLabel: "About Us",

          headerTitle: "About Us", // Set the custom title
          headerStyle: {
            backgroundColor: "#fff", // Optional: Customize header background color
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333", // Optional: Customize title color
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Navigate back to the Home screen
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        })}
      />
      <Drawer.Screen
        name="faq"
        component={FAQ}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <AntDesign name="questioncircleo" size={20} color={color} />
          ),
          drawerLabel: "FAQ",

          headerTitle: "FAQ", // Set the custom title
          headerStyle: {
            backgroundColor: "#fff", // Optional: Customize header background color
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333", // Optional: Customize title color
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Navigate back to the Home screen
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        })}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: "flex-start",
    backgroundColor: Colors.primary, // Background color for the header
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular image
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  headerLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  logoContainer: {
    width: 80, // Adjust size of the small image container
    height: 30,
    marginLeft: 10,
  },
  logo: {
    width: "100%",
    height: "100%",
    marginLeft: 10,
  },
  drawerItem: {
    borderBottomWidth: 1,
    // Set the border color
  },
  drawerItemsContainer: {
    paddingTop: 10,
  },

  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: "20%",
    alignSelf: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginRight: 10,
    borderRadius: 6,
    borderColor: Colors.primary,
  },

  walletText: {
    fontSize: 14,
    color: Colors.primary,
  },
  additionalOptions: {
    marginVertical: 16,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
    color: Colors.grey.medium,
  },
});

export default DashboardScreen;
