import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TabButton = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
    >
      <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#6366F1', // blue-600
  },
  inactiveLabel: {
    color: '#9CA3AF', // gray-400
  },
});

export default TabButton;
