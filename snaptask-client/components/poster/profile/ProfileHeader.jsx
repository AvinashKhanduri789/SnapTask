// components/profile/ProfileHeader.js
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const ProfileHeader = () => {
  return (
    <View className="bg-white">
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" translucent />
      <View className="relative">
        {/* Gradient Background */}
        <LinearGradient
          colors={['#6366F1', '#3B82F6', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 200,
            paddingTop: 60,
          }}
        >
          <SafeAreaView>
            <View className="px-6">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-3xl font-bold text-white mb-2">
                    Profile
                  </Text>
                  <Text className="text-purple-100 text-base font-medium">
                    Manage your personal information
                  </Text>
                </View>
                
                <View className="bg-white/20 rounded-2xl p-3">
                  <Text className="text-white text-lg">👤</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
        
        {/* Curved Bottom Overlay */}
        <View 
          style={{
            position: 'absolute',
            bottom: -40,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: 'white',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        />
      </View>
    </View>
  );
};

export default ProfileHeader;