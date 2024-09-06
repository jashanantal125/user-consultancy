import React from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export interface ProfileCardProps {
  imageUri: string;
  profileName: string;
  department: string;
  minRate: number;
}

const HomeProfileCard: React.FC<ProfileCardProps> = ({ imageUri, profileName, department, minRate }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.profile}>
            <Image
              source={{ uri: imageUri }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
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
            <Text style={styles.hourlyRateText}>₹ {minRate} / min</Text>
          </View>
          <TouchableOpacity
            style={styles.callAction}
            onPress={() => {
              navigation.navigate('chatscreen');
            }}
          >
            <Text style={styles.callActionText}>Call Now</Text>
            <FeatherIcon color="#fff" name="phone" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 200,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderColor: '#FF1D58',
    borderWidth: 2
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#090909',
  },
  profileDepartment: {
    fontSize: 14,
    fontWeight: '400',
    color: '#848484',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  priceContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourlyRateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  callAction: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FF1D58',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 6,
  },
});

export default HomeProfileCard;