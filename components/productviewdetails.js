import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
const spellImage = require('../assets/images/spell.png');

const ProductViewDetails = ({ productContent }) => {
  if (!productContent) {
    return <ActivityIndicator size="large" color="#FF1D58" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={spellImage} style={styles.image} />
        <Text style={styles.heading}>{productContent.title_of_product}</Text>
        <Text style={styles.description}>{productContent.description}</Text>
        <Text style={styles.heading}>Rs.{productContent.product_amount}</Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Book Now!</Text>
        </Pressable>

        <View style={styles.contentContainer}>
          <Text style={styles.description}>{productContent.product_content}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'flex-start',
    padding: 20,
    justifyContent: 'flex-start',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    width: 100,
    height: 35,
    backgroundColor: '#FF1D58',
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
});

export default ProductViewDetails;
