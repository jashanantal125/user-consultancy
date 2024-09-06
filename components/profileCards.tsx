import React from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
export interface ProfileCardProps {
  imageUri: string;
  profileName: string;
  department: string;
  hourlyRate: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageUri, profileName, department, hourlyRate }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: imageUri }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{profileName}</Text>
              <Text style={styles.profileDepartment}>{department}</Text>
              <View style={styles.ratingContainer}>
                <FeatherIcon color="#FF1D58" name="star" size={20} />
                <FeatherIcon color="#FF1D58" name="star" size={20} />
                <FeatherIcon color="#FF1D58" name="star" size={20} />
                <FeatherIcon color="#FF1D58" name="star" size={20} />
                <FeatherIcon color="#FF1D58" name="star" size={20} />
              </View>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.hourlyRateText}>₹ {hourlyRate} / min</Text>
          </View>
          <TouchableOpacity
            style={styles.profileAction}
            onPress={() => {
              navigation.navigate('chatscreen');
            }}
          >
            <Text style={styles.profileActionText}>Chat Now</Text>
            <MaterialIcons name="chat" size={24} color="white"  />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  profile: {
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    position: 'relative',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 15,
    borderColor: '#FF1D58',
    borderWidth: 2
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  profileDepartment: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  priceContainer: {    
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 50,
    marginLeft: 270,
    
  },
  hourlyRateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  profileAction: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF1D58',
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProfileCard;
