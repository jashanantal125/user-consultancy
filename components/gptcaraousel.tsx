import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  'https://via.placeholder.com/400x150/FF1D58',
  'https://via.placeholder.com/400x150/FF6347',
  'https://via.placeholder.com/400x150/FFD700',
];

const GptCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View key={index} style={[styles.dot, activeIndex === index ? styles.activeDot : null]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  image: {
    width,
    height: 150,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: '#888',
    borderRadius: 5,
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#FF1D58',
  },
});

export default GptCarousel;
