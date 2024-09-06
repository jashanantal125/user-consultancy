import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import useStore from '@/app/store';

const man = require("../assets/images/man.png");
import FeatherIcon from 'react-native-vector-icons/Feather';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const [profileName, setProfileName] = useState('Jashan Antal');
  const FullName = useStore((state) => state.FullName);

  useEffect(() => {
    loadProfileName();
  }, []);

  const loadProfileName = async () => {
    try {
      const savedFirstName = await AsyncStorage.getItem('firstName');
      const savedLastName = await AsyncStorage.getItem('lastName');
      if (savedFirstName && savedLastName) {
        setProfileName(`${savedFirstName} ${savedLastName}`);
      }
    } catch (error) {
      console.error('Failed to load profile name.', error);
    }
  };
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Image
          source={man}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{profileName}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => props.navigation.navigate('editprofile')}>
          <Text style={styles.editText}>
            Edit Profile
          </Text>
          <FeatherIcon color="#FF1D58" name="edit" size={16} />
        </TouchableOpacity>
      </View>
      <View style={styles.drawerItemList}> 
        {/* Custom Drawer Items */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('Home')}>
          <MaterialIcons name="home" size={24} color="black" style={styles.drawerIcon} />
          <Text style={styles.drawerItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('Chat')}>
          <MaterialIcons name="chat" size={24} color="black" style={styles.drawerIcon} />
          <Text style={styles.drawerItemText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('Call')}>
          <MaterialIcons name="call" size={24} color="black" style={styles.drawerIcon} />
          <Text style={styles.drawerItemText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('Remedies')}>
          <MaterialIcons name="healing" size={24} color="black" style={styles.drawerIcon} />
          <Text style={styles.drawerItemText}>Remedies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('History')}>
          <MaterialIcons name="history" size={24} color="black" style={styles.drawerIcon} />
          <Text style={styles.drawerItemText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate('index')}>
          <MaterialIcons name="logout" size={24} color="black" style={styles.drawerIcon} />
          <Text style={styles.drawerItemText}>Log out</Text>
        </TouchableOpacity>
        {/* End Custom Drawer Items */}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#FF1D58',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  editText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#FF1D58',
  },
  drawerItemList: {
    flex: 1,
    backgroundColor: 'white', // Background color for the drawer items
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  drawerIcon: {
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 16,
    
  },
});

export default CustomDrawerContent;

