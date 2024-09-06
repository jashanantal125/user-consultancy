import { Text, StyleSheet, View, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import { TextInput, Button, Pressable, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { passwordStyles } from './password';
const arrowImage = require("../../assets/images/Vector.png")
const googleImage = require("../../assets/images/Google.png")
const facebookImage = require("../../assets/images/Facebook.png")
import Example from '@/components/profileCards';
import VerticalCarousel from '@/components/blogCard';
import Carousel from '@/components/caraousel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const man = require("../../assets/images/man.png")
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useStore from '../store';




export default function Chat() {
  const [consultants, setConsultants] = useState([{}])
  const sid = useStore((state) => state.sid);
  const images = [
  'file:///Users/jashanantal/Downloads/EB6B44F5-544C-4507-966C-252D3589F3C2.jpg',
  'file:///Users/jashanantal/Downloads/D5D51562-C788-4FCC-80D2-3077EBF8C6E6.jpg',
  'file:///Users/jashanantal/Downloads/8EC501E7-6E78-444A-935E-F709B190EF4B.jpg'
  ];

  useEffect(() => {

    getConsultantData();
    
  }, []);

  const getConsultantData = async () => {
    const res = await fetch(`http://65.0.52.105:8006/api/resource/User?filters=[["category", "=", "Astrologer"]]&fields=["*"]&sid=${sid}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: "same-origin",
    });

    const data = await res.json();
    // console.log(data.data);
    setConsultants(data.data);
    
}

  return (
    <View >
      <ScrollView horizontal style={passwordStyles.scrollContainer} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={passwordStyles.button}>
        <MaterialIcons name="check" size={24} color="white" style={passwordStyles.buttonIcon} />
          <Text style={passwordStyles.textInButton}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={passwordStyles.button}>
        <MaterialIcons name="local-offer" size={24} color="white" style={passwordStyles.buttonIcon} />
          <Text style={passwordStyles.textInButton}>
            Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={passwordStyles.button}>
        <MaterialCommunityIcons name="book-education" size={24} color="white" style={passwordStyles.buttonIcon} />
          <Text style={passwordStyles.textInButton}>
            Education
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={passwordStyles.button}>
        <MaterialIcons name="shopping-bag" size={24} color="white" style={passwordStyles.buttonIcon} />
          <Text style={passwordStyles.textInButton}>
            Career
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={passwordStyles.button}>
        <MaterialIcons name="join-inner" size={24} color="white" style={passwordStyles.buttonIcon} />
          <Text style={passwordStyles.textInButton}>
            Marriage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={passwordStyles.button}>
        <MaterialIcons name="health-and-safety" size={24} color="white" style={passwordStyles.buttonIcon} />
          <Text style={passwordStyles.textInButton}>
            Health
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={passwordStyles.button}>
        <MaterialIcons name="attach-money" size={24} color="white" style={passwordStyles.buttonIcon} />
          <Text style={passwordStyles.textInButton}>
            Wealth
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
      <ScrollView >
        {/* <ScrollView horizontal style={passwordStyles.bannerContainer} showsHorizontalScrollIndicator={false}> */}
          <Carousel
          images={images}
          height={100}
          />
          {consultants.map((row) => (
        <Example
        imageUri='https://media.istockphoto.com/id/1256156743/photo/handsome-man-stock-photo.jpg?s=612x612&w=0&k=20&c=J7DRxxxhl_Umb_GEm2uiBW6RNdEe2yoZn8pIqqaPOho='
        profileName={row.full_name}
        department={row.skill}
        hourlyRate={row.chat_price}
        />
        ))}
       {/* <Example
        imageUri='https://media.istockphoto.com/id/1307385045/photo/close-up-of-indian-mature-men-stock-photo.jpg?s=612x612&w=0&k=20&c=ppyqkc3B8n1HMzHZ5a_GyykBwBHjdXy_3Kim_12L7cg='
        profileName='Virat Dhingra'
        department='Tarot'
        hourlyRate={20}
        />
        <Example
        imageUri='https://media.istockphoto.com/id/911901526/photo/portrait-of-a-traditionally-dressed-happy-south-indian-woman.jpg?s=612x612&w=0&k=20&c=dF7bsN1HmLdLh74kj-s7RYh-x3bGnuSj8BvRs0F5Zeg='
        profileName='Anupamma Velakarma'
        department='Numerology'
        hourlyRate={15}
        />
        <Example
        imageUri='https://media.istockphoto.com/id/1293903541/photo/young-woman-stock-photo.jpg?s=612x612&w=0&k=20&c=AvQGpGDrH-0nUNAL-uHuc1uidcTiiLbovyKJjsN_mOk='
        profileName='Durganshi'
        department='Vedic, Numerology'
        hourlyRate={22}
        /> */}
      </ScrollView>
    </View>


  );
}

