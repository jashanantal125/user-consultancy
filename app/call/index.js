import { Text, StyleSheet, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { TextInput, Button, Pressable, TouchableOpacity, Alert } from 'react-native';
import { useState,useEffect } from 'react';
import { Link, router } from "expo-router";
const banner = require("../../assets/images/banner.png")
import { ImageSlider } from "react-native-image-slider-banner";
import ImagedCarouselCard from "react-native-imaged-carousel-card";
import Example from '@/components/profileCards';
import Carousel from '@/components/caraousel';
import CallProfileCard from '@/components/callprofiles';
import useStore from '../store';




export default function Call() {
    const [consul, setConsul] = useState([{}])
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
            setConsul(data.data);
            
        }

    return (
        <ScrollView>
             <Carousel
          images={images}
          height={100}
          />
             {consul.map((row) => (
            <CallProfileCard
            imageUri='https://media.istockphoto.com/id/958064228/photo/portrait-of-happy-young-man.jpg?s=612x612&w=0&k=20&c=lZoxAGwQd_IL1p50R6FCXwbKtofoSuknmAKJod6OkzQ='
            profileName={row.full_name}
            department={row.skill}
            minRate={row.call}
            />
            ))}
            {/* <CallProfileCard
            imageUri='https://media.istockphoto.com/id/1136413215/photo/young-man-at-street-market.jpg?s=612x612&w=0&k=20&c=obnaR5III0jRxHKd4ZPl3LRC2pI792KbHYR2eBzKKe8='
            profileName='Manish Pandey'
            department='Numerology'
            minRate={18}
            />
            <CallProfileCard
            imageUri='https://media.istockphoto.com/id/1298117910/photo/mature-woman-at-home-stock-photo.jpg?s=612x612&w=0&k=20&c=PjE_OLlf9aa1Z2f3J-fsNmKvTCO1D_01q7UQ1QvphZk='
            profileName='Deepanshi Garg'
            department='Tarot, Vedic'
            minRate={24}
            />
            <CallProfileCard
            imageUri='https://media.istockphoto.com/id/1254176393/photo/portrait-of-a-happy-woman-of-indian-ethnicity.jpg?s=612x612&w=0&k=20&c=In7iJKJ0GXYatpVnLbSRqN-bbqwnXJqy4C0AjGgyUzE='
            profileName='Mithali Rakoli'
            department='Vastu'
            minRate={20}
            /> */}
        </ScrollView>
    );
} 