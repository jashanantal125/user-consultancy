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

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const [logoutVisible, setLogoutVisible] = useState(false);

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
        <Image
          source={{
            uri: ConstantStrings.url.base_url + userDetails?.user_image,
          }}
          style={styles.headerImage}
        />
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

      <TouchableOpacity
        style={styles.logoutContainer}
        onPress={() => setLogoutVisible(true)}
      >
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

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
            <AntDesign name="wallet" size={20} color={Colors.grey.normal} />
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
        })}
      />
      {/* <Drawer.Screen
        name="Wallet"
        component={Wallet}
        options={{
          drawerIcon: ({ color, size }) => (
            <AntDesign name="wallet" size={size} color={color} />
          ),
          drawerLabel: "Wallet",
          drawerItemStyle: { borderWidth: 1, borderColor: "#d3d3d3" },
        }}
      /> */}
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
    marginTop: 20,
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
    borderColor: Colors.grey.normal,
  },

  walletText: {
    fontSize: 14,
    color: Colors.grey.normal,
  },
});

export default DashboardScreen;
