import { NavigationContainer } from '@react-navigation/native';
import { Text, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { detailStyles } from './details';
import ProductViewDetails from '../../components/productviewdetails';
import useStore from '../store';

export default function ProDetails({ route }) {
  const [productContent, setProductContent] = useState(null);
  const sid = useStore((state) => state.sid);
  const { productName } = route.params;

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      const res = await fetch(`http://65.0.52.105:8006/api/resource/Product%20Details?filters=[["title_of_product", "=", "${productName}"]]&fields=["*"]&sid=${sid}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: "same-origin",
      });
      const data = await res.json();
      setProductContent(data.data[0]); // Assuming the response contains an array of matching products
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (!productContent) {
    return <ActivityIndicator size="large" color="#FF1D58" />;
  }

  return (
    <View style={detailStyles.container}>
      <ProductViewDetails productContent={productContent} />
    </View>
  );
}
