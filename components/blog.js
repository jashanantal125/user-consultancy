import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
const spellImage = require('../assets/images/spell.png');

const BlogViewDetails = ({ blogContent }) => {
  if (!blogContent) {
    return <Text>No data available</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={spellImage} style={styles.image} />
        <Text style={styles.heading}>{blogContent.blog_title}</Text>
        <Text style={styles.description}>{blogContent.blog_content}</Text>
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
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
});

export default BlogViewDetails;
