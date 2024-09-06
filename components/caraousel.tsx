import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface CarouselProps {
  images: string[];
  height?: number;
}

const CustomCarousel: React.FC<CarouselProps> = ({ images, height = 150 }) => {
  const PAGE_WIDTH = Dimensions.get('window').width;
  const progress = useSharedValue<number>(0);
  const ref = useRef<Carousel<any>>(null);
  const [autoPlay, setAutoPlay] = React.useState(true);

  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      if (autoPlay) {
        ref.current?.scrollTo({
          count: 1,
          animated: true,
        });
      }
    }, 3000); // 3 seconds

    return () => clearInterval(autoPlayInterval);
  }, [autoPlay]);

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={ref}
        width={PAGE_WIDTH}
        height={height}
        loop
        autoPlay={autoPlay}
        autoPlayInterval={3000}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={images}
        renderItem={({ item }: { item: string }) => (
          <Image source={{ uri: item }} style={[styles.image, { height }]} />
        )}
      />
      <View style={styles.paginationContainer}>
        {images.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            return {
              opacity: progress.value === index ? 1 : 0.5,
            };
          });
          return (
            <View
              key={index}
              style={index === Math.round(progress.value) % images.length
                ? styles.activeDot
                : styles.dot}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    margin: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'black',
    margin: 4,
  },
});

export default CustomCarousel;










