import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Header = () => {
  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  return (
    <LinearGradient
      colors={['#3B82F6', '#60A5FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Your Tasks</Text>
          <Text style={styles.subtitle}>
            Find new tasks or manage your current ones
          </Text>
        </View>
        {/* <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Ionicons name="filter" size={20} color="#1E3A8A" />
        </TouchableOpacity> */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40, // more top padding for status bar
    paddingBottom: 24,
    borderBottomLeftRadius: 54,
    borderBottomRightRadius: 54,
    marginBottom:5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0F2FE',
    marginTop: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default Header;
