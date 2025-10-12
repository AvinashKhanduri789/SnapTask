import React, { useState } from 'react';import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';import { Ionicons } from '@expo/vector-icons';import { LinearGradient } from 'expo-linear-gradient';const { height: SCREEN_HEIGHT } = Dimensions.get('window');const NotificationsTab = () => {  const [selectedNotification, setSelectedNotification] = useState(null);  const [modalVisible, setModalVisible] = useState(false);  const notifications = [    {      id: '1',      type: 'bid',      seekerName: 'Rahul Sharma',      taskTitle: 'Design Poster for Club Event',      time: '2 hours ago',      seekerRating: 4.8,      completedTasks: 24,      message: 'Hi! I have extensive experience in graphic design and would love to work on your club event poster. I can deliver high-quality designs within 3 days.',      bidAmount: '₹1,500',      timeline: '3 days',      status: 'new'    },    {      id: '2',      type: 'completed',      seekerName: 'Sneha Patel',      taskTitle: 'Find roommate near XYZ hostel',      time: '1 day ago',      seekerRating: 4.9,      completedTasks: 18,      message: 'Task completed successfully! Found a suitable roommate matching all your criteria near XYZ hostel. They are ready to move in next week.',      status: 'completed'    },    {      id: '3',      type: 'bid',      seekerName: 'Amit Kumar',      taskTitle: 'Website Development for Small Business',      time: '3 hours ago',      seekerRating: 4.7,
      completedTasks: 31,
      message: 'I specialize in small business websites and can create a responsive, SEO-friendly website. I have attached my portfolio for your review.',
      bidAmount: '₹8,000',
      timeline: '7 days',
      status: 'new'
    },
    {
      id: '4',
      type: 'completed',
      seekerName: 'Priya Singh',
      taskTitle: 'Social Media Marketing Campaign',
      time: '5 hours ago',
      seekerRating: 4.6,
      completedTasks: 22,
      message: 'Campaign completed! We achieved 15% engagement rate and 200+ new followers. Analytics report has been shared.',
      status: 'completed'
    }
  ];
  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };
  const getNotificationConfig = (type) => {
    switch (type) {
      case 'bid':
        return {
          icon: 'hand-left',
          gradient: ['#6366F1', '#8B5CF6'],
          title: 'New Bid Received',
          subtitle: 'wants to work on your task'
        };
      case 'completed':
        return {
          icon: 'checkmark-done',
          gradient: ['#10B981', '#059669'],
          title: 'Task Completed',
          subtitle: 'has completed your task'
        };
      default:
        return {
          icon: 'notifications',
          gradient: ['#6B7280', '#4B5563'],
          title: 'Notification',
          subtitle: ''
        };
    }
  };
  return (
    <View className="flex-1 bg-slate-50">
      {/* Header with Gradient Background - Fixed */}
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
              Bids and task updates
            </Text>
          </View>
          {/* Decorative Icon */}
          <View className="bg-white/20 rounded-2xl p-3">
            <Ionicons name="notifications" size={24} color="#ffffff" />
          </View>
        </View>
      </LinearGradient>
      {/* Notifications List - Scrolls behind header */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        style={{ marginTop: -20, zIndex: 1 }}
      >
        <View className="px-4 space-y-4 ">
          {notifications.map((notification) => {
            const config = getNotificationConfig(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                className="bg-white rounded-2xl overflow-hidden mb-4"
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
                      {/* Bid Amount or Status */}
                      {notification.type === 'bid' && (
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
                      )}
                      {notification.type === 'completed' && (
                        <View className="flex-row justify-between items-center">
                          <Text className="text-slate-500 text-xs">
                            {notification.time}
                          </Text>
                          <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-700 text-xs font-bold">
                              COMPLETED
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      {/* Fixed Bottom Sheet Modal */}
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
              backgroundColor: 'white',
              overflow: 'hidden',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24
            }}
          >
            {/* Header with Close Button */}
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
                  {/* Seeker Profile */}
                  <View className="bg-slate-50 rounded-2xl p-4 mb-6">
                    <View className="flex-row items-center">
                      <View className="w-16 h-16 bg-purple-500 rounded-2xl items-center justify-center mr-4">
                        <Text className="text-white text-xl font-bold">
                          {selectedNotification.seekerName.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-slate-800">
                          {selectedNotification.seekerName}
                        </Text>
                        <View className="flex-row items-center space-x-4 mt-2">
                          <View className="flex-row items-center">
                            <Ionicons name="star" size={16} color="#f59e0b" />
                            <Text className="text-slate-600 text-sm ml-1 font-semibold">
                              {selectedNotification.seekerRating} rating
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Ionicons name="checkmark-done" size={16} color="#10b981" />
                            <Text className="text-slate-600 text-sm ml-1 font-semibold">
                              {selectedNotification.completedTasks} tasks
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* Task Details */}
                  <View className="bg-white border-2 border-slate-200 rounded-2xl p-4 mb-6">
                    <Text className="text-slate-800 font-bold text-lg mb-2">
                      Task Details
                    </Text>
                    <Text className="text-slate-700 text-base leading-6">
                      {selectedNotification.taskTitle}
                    </Text>
                    {selectedNotification.type === 'bid' && (
                      <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-slate-100">
                        <View>
                          <Text className="text-slate-500 text-sm">Proposed Budget</Text>
                          <Text className="text-green-600 text-xl font-bold">
                            {selectedNotification.bidAmount}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-slate-500 text-sm">Timeline</Text>
                          <Text className="text-slate-800 text-xl font-bold">
                            {selectedNotification.timeline}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  {/* Message */}
                  <View className="bg-blue-50 rounded-2xl p-4 mb-6">
                    <Text className="text-blue-800 font-bold text-sm mb-3">MESSAGE FROM SEEKER</Text>
                    <Text className="text-slate-700 leading-6 text-base">
                      "{selectedNotification.message}"
                    </Text>
                  </View>
                  {/* Action Buttons */}
                  <View className="flex-row space-x-4">
                    {selectedNotification.type === 'bid' && (
                      <>
                        <TouchableOpacity 
                          className="flex-1 bg-slate-100 py-4 rounded-xl items-center border-2 border-slate-300"
                          onPress={() => setModalVisible(false)}
                        >
                          <Text className="text-slate-700 font-bold text-base">Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="flex-1 bg-green-500 py-4 rounded-xl items-center"
                          onPress={() => setModalVisible(false)}
                        >
                          <Text className="text-white font-bold text-base">Accept Bid</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {selectedNotification.type === 'completed' && (
                      <TouchableOpacity 
                        className="flex-1 bg-purple-500 py-4 rounded-xl items-center"
                        onPress={() => setModalVisible(false)}
                      >
                        <Text className="text-white font-bold text-base">Review Work</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default NotificationsTab;