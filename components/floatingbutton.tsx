import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FloatingButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  icon?: string;
  size?: number;
  color?: string;
  label?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon = 'add',
  size = 24,
  color = '#FFFFFF',
  label
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialIcons name={icon} size={size} color={color} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF1D58',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    marginTop: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default FloatingButton;
