import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './index';
import OtpVerify from './otpverify/index';
import Home from './home';
import Chat from './chat';
import Dashboard from './dashboard';
import AfterLogin from './afterlogin';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import drawer from 'expo-router/drawer';
import Dailyhoroscope from './dailyhoroscope';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({

    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="index">
          <Stack.Screen name="index" component={Index}  options={{headerShown: false}}/>
          <Stack.Screen name="otpverify" component={OtpVerify} options={{headerShown: false}}/>
          <Stack.Screen name="afterlogin" component={AfterLogin} options={{headerShown: false}}/>
          <Stack.Screen name="dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="dailyhoroscope" component={Dailyhoroscope} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>  //check now

  );
}







