import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
const background = require('../assets/images/backgroundimage.png')

const DailyHoroDetails = ({ sign, horoData }) => {
  const content = horoData.find(item => item.zodiac_sign === sign);

  if (!content) {
    return <View style={[styles.loadingContainer, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FF1D58" />
    </View>
    // return <Text>No data available</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.image}>
        <Image source={background} style={styles.image} />
        <Text style={{ position: 'absolute', top: 10, left: 130, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>----{content.date}----</Text>
        <Text style={{ position: 'absolute', top: 50, left: 15, bottom: 0, justifyContent: 'flex-start', alignItems: 'flex-start', color: 'white', fontWeight: '900', fontStyle: 'italic' }}>Here is your Horoscope for today!</Text>

        <View style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: 90, left: 15, }}>
          <Text style={{ color: 'white', fontWeight: 'bold', }}>Lucky Colours</Text>
          <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic' }}>{content.lucky_colour_1},{content.lucky_colour_2}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: 90, right: 15, }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Mood for today</Text>
          <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic' }}>{content.mood}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: 140, left: 15, }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Lucky Number</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{content.lucky_number}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: 140, right: 40, }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Lucky Time</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{content.lucky_time}</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Text style={styles.heading}>Love</Text>
        <Text style={styles.description}>{content.description}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.heading}>Career</Text>
        <Text style={styles.description}>{content.career_description}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.heading}>Money</Text>
        <Text style={styles.description}>{content.money_description}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.heading}>Health</Text>
        <Text style={styles.description}>{content.health_description}</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  loadingContainer: {
    flex:1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 15,
  },
  card: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
  imagedata: {
    position: 'absolute',
    justifyContent: 'center',
  }
});

export default DailyHoroDetails;



