import * as React from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface MyComponentProps {
  imageSource: string;
  title: string;
  description: string;
  onPress: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({
  imageSource,
  title,
  description,
  onPress,
}) => (
  <Card style={styles.card}>
    <Card.Cover source={{ uri: imageSource }} />
    <Card.Content>
      <Text variant="titleLarge" style={styles.title}>{title}</Text>
      <Text variant="bodyMedium" style={styles.description}>{description}</Text>
    </Card.Content>
    <Card.Actions>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={onPress}
          color="#FF1D58"
          style={styles.button}
        >
          View Details
        </Button>
      </View>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
  },
  title: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  description: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF1D58'
  },
});

export default MyComponent;




