import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FloatingActionButton = ({ onPress }) => {
  const handlePress = () => {
    console.log('FAB pressed');
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Ionicons name="refresh" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Approximation of blue gradient
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, 
  },
});

export default FloatingActionButton;
