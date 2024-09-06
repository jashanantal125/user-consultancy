import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import Home from '../home';
import Chat from '../chat';
import Call from '../call';
import Remedies from '../remedies';
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/customdrawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import History from '../history';
import EditProfile from '../editprofile';
import ProDetails from '../productdetails';
import Dailyhoroscope from '../dailyhoroscope';
import ChatScreen from '../chatscreen';
import Index from '../index'
import OtpVerify from '../otpverify';
import AfterLogin from '../afterlogin';
import blogDetails from '../blogscreen';
import FloatingButton from '@/components/floatingbutton';



const Tab = createBottomTabNavigator();

// Create stack navigator for screens with headers
const Stack = createNativeStackNavigator();

// Create drawer navigator
const Drawer = createDrawerNavigator();

// Define types for tabBarIcon options
type TabBarIconProps = {
  color: string;
  size: number;
};

function HomePage() {

  const handlePress = () => {
    console.log('Floating button pressed');
    // Add your navigation or other logic here
  };

  return (
    <Drawer.Navigator
    
      screenOptions={screenOptions}
      drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
    >

      <Drawer.Screen name="Home" component={BottomTabs} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Call" component={Call} />
      <Drawer.Screen name="Remedies" component={Remedies} />
      <Drawer.Screen name="History" component={History} />

    </Drawer.Navigator>
  )
}
// Bottom tab navigator for main screens
function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home} // Use HomeStack instead of Home directly
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Call"
        component={Call}
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="call" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Remedies"
        component={Remedies}
        options={{
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="healing" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}





// Toggle button for drawer
const DrawerToggleButton = ({ navigation }: { navigation: any }) => (
  <MaterialIcons
    name="menu"
    size={24}
    color="black"
    onPress={() => navigation.toggleDrawer()}
    style={{ marginLeft: 10 }}
  />
);

// Screen options for drawer navigator
const screenOptions = ({ navigation }: { navigation: any }) => ({
  headerLeft: () => <DrawerToggleButton navigation={navigation} />,
  headerTitle: '',
});



export default function Dashboard() {

  

  return (
    
    <NavigationContainer independent={true} >
      <Stack.Navigator>
      
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomePage}
        /> 
        <Stack.Screen name="editprofile" component={EditProfile} />
        <Stack.Screen name="dailyhoroscope" component={Dailyhoroscope} />
        <Stack.Screen name="productdetails" component={ProDetails} />
        <Stack.Screen name="chatscreen" component={ChatScreen} />
        <Stack.Screen name="index" component={Index} options={{ headerShown: false }} />
        <Stack.Screen name="otpverify" component={OtpVerify} />
        <Stack.Screen name="afterlogin" component={AfterLogin} />
        <Stack.Screen name="blogscreen" component={blogDetails} />
        <Stack.Screen name="dashboard" component={Dashboard} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
    
  );
}