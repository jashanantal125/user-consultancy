import { Text, StyleSheet, View, Image, ScrollView,} from 'react-native';
import React from 'react';
import { TextInput, Button, Pressable, TouchableOpacity, Alert } from 'react-native';
import { useState,useEffect } from 'react';
import { Link, router } from "expo-router";
import { Searchbar } from 'react-native-paper';
import { homeStyles } from './home';
import { IconButton, MD3Colors } from 'react-native-paper';
const horoscopeIcon = require("../../assets/images/horoscope.png")
const ringIcon = require("../../assets/images/ring.png")
const chatIcon = require("../../assets/images/chaticon.png")
const otherHomeBanner = require('../../assets/images/homebanner2.png')
const homeBanner = require("../../assets/images/homebanner.png")
import HomeExample from '@/components/homeProfiles';
import BlogCard from '@/components/blogCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router/build/useNavigation';
import FloatingButton from '@/components/floatingbutton';
import ChatScreen from '../chatscreen';
import HomeProfileCard from '@/components/homeProfiles';
import useStore from '../store';

 
export default function Home() {
    const [search, setSearch] = useState('')
    const [homeData, setHomeData] = useState([{}])
    const [blogData,setblogData] = useState([{}])
    const [bannerData,setBannerData] = useState([{}])
    const [consultantData,setConsultantData] = useState([{}])
    const navigation = useNavigation()
    const sid = useStore((state) => state.sid);

    const handleSubmit = (blogName) => {
        navigation.navigate('blogscreen', { blogName });
      }

    const handlePress = () => {
        navigation.navigate('chatscreen')
        Alert.alert('You are now connected to an astrologer!')
      };

      useEffect(() => {

        getHomeData();
        getConsultantsData();
        
      }, []);

      const getHomeData = async () => {
        const res = await fetch(`http://65.0.52.105:8006/api/resource/Screen/661fgqspd1?sid=${sid}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: "same-origin",
        });

        const data = await res.json();
        // console.log(data.data.upper_icons);
        setHomeData(data.data.upper_icons);
        setblogData(data.data.blog_card);
        setBannerData(data.data.banner)
    }

      const getConsultantsData = async () => {
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
        setConsultantData(data.data);
        
    }



    return (
        <View style={homeStyles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false} style={homeStyles.container}>
            <View style={homeStyles.searchContainer}>
                <Searchbar
                    placeholder='search'
                    onChangeText={setSearch}
                    value={search}
                />
            </View>
            <View style={homeStyles.iconContainer}>
            {homeData.map((row) => (
            <TouchableOpacity style={homeStyles.drawerItem} onPress={() => navigation.navigate('dailyhoroscope')}> 
            <IconButton
                    icon={horoscopeIcon}
                    iconColor='white'
                    containerColor='#FF1D58'
                    mode='outlined'
                    size={60}
                />
          <Text style={homeStyles.drawerItemText}>{row.title}</Text>
        </TouchableOpacity>
            ))}
            </View>
            {bannerData.map((row) => (
            <Pressable style={homeStyles.bannerContainer}>
                <Image style={homeStyles.bannerImage} source={homeBanner} />
            </Pressable>
             ))}
            <Text style={homeStyles.astrologersText}>
                Astrologers
            </Text>
            <ScrollView  horizontal style={homeStyles.scrollContainer} showsHorizontalScrollIndicator={false}>
            {consultantData.map((row) => (
                <HomeProfileCard 
                imageUri='https://media.istockphoto.com/id/1216426542/photo/portrait-of-happy-man-at-white-background-stock-photo.jpg?s=612x612&w=0&k=20&c=uBRYnfso8wOEGobEeRtOVZkl9IARpr4mo4_70VqEPxI='
                profileName={row.full_name}
                department={row.skill}
                minRate={row.chat_price}
                />
                ))}
               
            </ScrollView>
            <Pressable style={homeStyles.bannerContainer}>
                <Image style={homeStyles.bannerImage} source={otherHomeBanner} />
            </Pressable>
            <Text style={homeStyles.astrologersText}>
                Latest from Blog
            </Text>
            <ScrollView  horizontal style={homeStyles.scrollContainer} showsHorizontalScrollIndicator={false}>
                {blogData.map((row) => (
                    <BlogCard
                    imageUri='https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFzdHJvbG9neXxlbnwwfHwwfHx8MA%3D%3D'
                    title={row.blog_title}
                    description={row.description}
                    onPress={() => handleSubmit(row.blog_title)}
                    />
                ))}
               
               {/* <BlogCard
               imageUri='https://plus.unsplash.com/premium_photo-1699967437640-17ec76db90d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXN0cm9sb2d5fGVufDB8fDB8fHww'
               title='Understanding your Zodiac: A Comprehensive Guide'
               description='Click here to read more!'
               />
               <BlogCard
               imageUri='https://images.unsplash.com/photo-1521920592574-49e0b121c964?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXN0cm9sb2d5fGVufDB8fDB8fHww'
               title='Astrology and Meditation: Aligning with the Cosmos'
               description='Click here to read more!'
               /> */}
               
            </ScrollView>
        </ScrollView>
        <FloatingButton onPress={handlePress} icon="chat" size={28} color="#FFF" label="Chat" />
        </View>
    );
}

