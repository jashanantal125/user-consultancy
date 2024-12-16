// import { NavigationContainer } from "@react-navigation/native";
// import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
// import React from "react";
// import { dashboardStyles } from "./global";
// import {
//   TextInput,
//   Button,
//   Pressable,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { useState, useEffect } from "react";
// import { Link, router } from "expo-router";
// import ImagedCarouselCard from "react-native-imaged-carousel-card";
// import { remediesStyles } from "./remedies";
// const banner = require("../../assets/images/banner.png");
// import ProductCard from "@/components/productCards";
// import { useNavigation } from "@react-navigation/native";
// import Carousel from "@/components/caraousel";
// import useStore from "../store";

// export default function Remedies() {
//   const sid = useStore((state) => state.sid);
//   const [blogCard, setBlogCard] = useState([{}]);
//   const navigation = useNavigation();
//   const images = [
//     "file:///Users/jashanantal/Downloads/17D9A222-AADE-437C-BDA3-5A3EA1C968B2.JPEG",
//     "file:///Users/jashanantal/Downloads/E14ECB7D-B342-4A44-8BCC-BA7AFD48A6C9.JPEG",
//     "file:///Users/jashanantal/Downloads/6848FE8E-3197-41EA-8575-B7A7932A56D2.JPEG",
//   ];

//   const handleSubmit = (productName: string) => {
//     navigation.navigate("productdetails", { productName });
//   };

//   useEffect(() => {
//     getblogCardData();
//   }, []);

//   const getblogCardData = async () => {
//     const res = await fetch(
//       `http://65.0.52.105:8006/api/resource/Remedies%20Screen/8s9n8lvq04?sid=${sid}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         credentials: "same-origin",
//       }
//     );

//     const data = await res.json();
//     // console.log(data.data.upper_icons);
//     setBlogCard(data.data.table_efxx);
//   };

//   return (
//     <View style={remediesStyles.Container}>
//       <ScrollView
//         style={remediesStyles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         <Carousel images={images} height={100} />
//         <View style={remediesStyles.cardsContainer}>
//           {blogCard.map((row) => (
//             <ProductCard
//               imageSource="https://images.unsplash.com/photo-1601045569976-699bac2727ff?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//               title={row.title}
//               description={row.description}
//               onPress={() => handleSubmit(row.title)}
//             ></ProductCard>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
