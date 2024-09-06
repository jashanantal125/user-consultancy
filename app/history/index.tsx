import { Text, StyleSheet, View, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import { TextInput, Button, Pressable, Alert, Image } from 'react-native';
import { useState } from 'react';
import { passwordStyles } from './password';
const arrowImage = require("../../assets/images/Vector.png")
const googleImage = require("../../assets/images/Google.png")
const facebookImage = require("../../assets/images/Facebook.png")
import Carousel from 'react-native-banner-carousel';
import Example from '@/components/profileCards';
import VerticalCarousel from '@/components/blogCard';
import ImagedCarouselCard from "react-native-imaged-carousel-card";
const banner = require("../../assets/images/banner.png")
import { historyStyles } from './history'

export default function History() {

  return (
    <View style={historyStyles.container}>
      <ScrollView style={historyStyles.scrollContainer}>
        <Text style={historyStyles.text1}>
            Uh-oh!
        </Text>
        <Text style={historyStyles.text2}>
           You've not taken any chat/call consultations yet!
        </Text>
      </ScrollView>
    </View>
    

  );
} 