// components/notifications/BidCard.jsx.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const BidCard = ({ notification, onPress }) => {
  const config = {
    icon: 'hand-left',
    gradient: ['#6366F1', '#8B5CF6'],
    title: 'New Bid Received',
    subtitle: ' wants to work on your task'
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl overflow-hidden mb-4"
      onPress={() => onPress(notification)}
      activeOpacity={0.9}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      {/* Top Gradient Bar */}
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="h-1 w-full"
      />
      
      <View className="p-5">
        <View className="flex-row items-start">
          {/* Icon with Gradient Background */}
          <LinearGradient
            colors={config.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          >
            <Ionicons name={config.icon} size={24} color="#ffffff" />
          </LinearGradient>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800 mb-1">
              {config.title}
            </Text>
            <Text className="text-slate-600 text-sm mb-2">
              <Text className="font-semibold text-slate-800">
                {notification.seekerName}
              </Text>
              {config.subtitle}
            </Text>

            {/* Task Title */}
            <View className="bg-slate-50 rounded-xl px-3 py-2 mb-3 border border-slate-200">
              <Text className="text-slate-700 font-semibold text-sm">
                "{notification.taskTitle}"
              </Text>
            </View>

            {/* Seeker Stats */}
            <View className="flex-row items-center space-x-4 mb-3">
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text className="text-slate-600 text-xs ml-1 font-semibold">
                  {notification.seekerRating}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                <Text className="text-slate-600 text-xs ml-1 font-semibold">
                  {notification.completedTasks} completed
                </Text>
              </View>
            </View>

            {/* Bid Details */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="cash" size={16} color="#059669" />
                <Text className="text-green-600 font-bold text-sm ml-1">
                  {notification.bidAmount}
                </Text>
                <Text className="text-slate-500 text-xs ml-2">
                  • {notification.timeline}
                </Text>
              </View>
              <View className="bg-amber-100 px-3 py-1 rounded-full">
                <Text className="text-amber-700 text-xs font-bold">
                  NEW BID
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BidCard;