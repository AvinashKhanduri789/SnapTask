import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const Notifications = () => {
  const router = useRouter();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Example notifications for Seeker
  const notifications = [
    {
      id: '1',
      type: 'bid',
      taskId: '101',
      posterName: 'Ananya Verma',
      taskTitle: 'Design Landing Page for Portfolio',
      time: '1 hour ago',
      posterRating: 4.9,
      postedOn: 'Oct 17, 2025',
      message:
        'New bid opportunity available for "Design Landing Page for Portfolio". Check out details and apply soon!',
      budget: '₹2,000',
      deadline: '3 days left',
      status: 'new',
    },
    {
      id: '2',
      type: 'update',
      taskId: '102',
      posterName: 'Rohit Mehta',
      taskTitle: 'App UI Revamp Project',
      time: '5 hours ago',
      message:
        'Poster has updated the deadline for your assigned task. Please review the new timeline before submission.',
      updateInfo: 'New deadline: Oct 20, 2025',
      status: 'updated',
    },
    {
      id: '3',
      type: 'update',
      taskId: '103',
      posterName: 'Sneha Kapoor',
      taskTitle: 'E-commerce API Integration',
      time: '1 day ago',
      message:
        'Poster added additional feature requirements for the checkout flow. Kindly review the new description.',
      updateInfo: 'Added “Discount Code” and “Wishlist” modules.',
      status: 'updated',
    },
  ];

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'bid':
        return {
          icon: 'briefcase',
          gradient: ['#6366F1', '#8B5CF6'],
          title: 'New Bid Available',
          subtitle: 'A new task is open for bidding',
        };
      case 'update':
        return {
          icon: 'refresh',
          gradient: ['#10B981', '#059669'],
          title: 'Task Update',
          subtitle: 'Poster made some updates to your task',
        };
      default:
        return {
          icon: 'notifications',
          gradient: ['#6B7280', '#4B5563'],
          title: 'Notification',
          subtitle: '',
        };
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-8 px-6 rounded-b-3xl mb-5"
        style={{ zIndex: 10 }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">
              Notifications
            </Text>
            <Text className="text-purple-100 text-base font-medium">
              Updates and new bids
            </Text>
          </View>
          <View className="bg-white/20 rounded-2xl p-3">
            <Ionicons name="notifications" size={24} color="#ffffff" />
          </View>
        </View>
      </LinearGradient>

      {/* Notifications List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
        style={{ marginTop: -20, zIndex: 1 }}
      >
        <View className="px-4 space-y-4">
          {notifications.map((notification) => {
            const config = getNotificationConfig(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                className="bg-white rounded-2xl overflow-hidden"
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.9}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                <LinearGradient
                  colors={config.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-1 w-full"
                />
                <View className="p-5 flex-row items-start">
                  {/* Icon */}
                  <LinearGradient
                    colors={config.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  >
                    <Ionicons name={config.icon} size={22} color="#fff" />
                  </LinearGradient>

                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-800 mb-1">
                      {config.title}
                    </Text>
                    <Text className="text-slate-600 text-sm mb-2">
                      <Text className="font-semibold text-slate-800">
                        {notification.posterName}
                      </Text>{' '}
                      {config.subtitle}
                    </Text>
                    <View className="bg-slate-50 rounded-xl px-3 py-2 mb-3 border border-slate-200">
                      <Text className="text-slate-700 font-semibold text-sm">
                        "{notification.taskTitle}"
                      </Text>
                    </View>
                    <Text className="text-slate-600 text-xs">
                      {notification.time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View
            className="w-full bg-white rounded-t-3xl absolute bottom-0 left-0 right-0"
            style={{
              height: '100%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 8,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            {/* Close Bar */}
            <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
              <View className="items-center flex-1">
                <View className="w-12 h-1 bg-slate-300 rounded-full" />
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="w-10 h-10 items-center justify-center rounded-full bg-slate-100"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedNotification && (
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
              >
                <View className="px-6 pb-6">
                  {/* Header */}
                  <View className="flex-row items-center mb-6">
                    <LinearGradient
                      colors={getNotificationConfig(selectedNotification.type).gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    >
                      <Ionicons
                        name={getNotificationConfig(selectedNotification.type).icon}
                        size={28}
                        color="#ffffff"
                      />
                    </LinearGradient>
                    <View className="flex-1">
                      <Text className="text-2xl font-bold text-slate-800">
                        {getNotificationConfig(selectedNotification.type).title}
                      </Text>
                      <Text className="text-slate-500 text-sm mt-1">
                        {selectedNotification.time}
                      </Text>
                    </View>
                  </View>

                  {/* Task Info */}
                  <View className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200">
                    <Text className="text-slate-800 font-bold text-lg mb-2">
                      {selectedNotification.taskTitle}
                    </Text>
                    <Text className="text-slate-600 text-base leading-6">
                      {selectedNotification.message}
                    </Text>

                    {/* Bid Details */}
                    {selectedNotification.type === 'bid' && (
                      <View className="flex-row justify-between mt-4 pt-3 border-t border-slate-200">
                        <View>
                          <Text className="text-slate-500 text-sm">
                            Budget
                          </Text>
                          <Text className="text-green-600 text-xl font-bold">
                            {selectedNotification.budget}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-slate-500 text-sm">
                            Deadline
                          </Text>
                          <Text className="text-slate-800 text-xl font-bold">
                            {selectedNotification.deadline}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Update Details */}
                    {selectedNotification.type === 'update' && (
                      <View className="mt-4 pt-3 border-t border-slate-200">
                        <Text className="text-slate-500 text-sm mb-1">
                          Update Info
                        </Text>
                        <Text className="text-slate-800 font-semibold text-base">
                          {selectedNotification.updateInfo}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Button (Only for Bid) */}
                  {selectedNotification.type === 'bid' && (
                    <TouchableOpacity
                      className="w-full bg-indigo-500 py-4 rounded-xl items-center"
                      onPress={() => {
                        setModalVisible(false);
                        router.push(`/seeker/taskDetail/${selectedNotification.taskId}`);
                      }}
                    >
                      <Text className="text-white font-bold text-base">
                        View Details
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notifications;
