import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface BlogCardProps {
  imageUri: string;
  title: string;
  description: string;
  onPress: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ imageUri, title, description, onPress }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={{ uri: imageUri }}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
            <TouchableOpacity
             onPress={onPress}>
              <View style={styles.cardAction}>
                <Text style={styles.cardActionText}>Read more</Text>
                <FeatherIcon color="#fff" name="edit" size={16} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    width: 230,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
    marginBottom: 12,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF1D58',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  cardActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BlogCard;

