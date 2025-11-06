import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApi } from '../../../util/useApi';
import { api } from '../../../util/requester';
import StatusModal from '../../../components/common/StatusModal';

const Notifications = () => {
  const router = useRouter();
  const { request, isLoading, error } = useApi();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // State for StatusModal
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    status: '',
    title: '',
    message: '',
    primaryActionLabel: 'OK'
  });

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await request(api.get('/seeker/profile/notifications'));
      
      if (response.ok) {
        setNotifications(response.data);
      } else {
        handleApiError(response.error);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      showErrorModal('Failed to load notifications. Please try again.');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, []);

  // Consistent error handler
  const handleApiError = (error) => {
    console.log('API Error:', error);
    
    switch (error?.status) {
      case 401:
        showUnauthorizedModal();
        break;
      case 403:
        showErrorModal(error.detail || "You don't have permission to view notifications.");
        break;
      case 404:
        showErrorModal(error.detail || "No notifications found.");
        break;
      case 500:
        showErrorModal("Server error. Please try again later.");
        break;
      default:
        showErrorModal(error?.detail || "Failed to load notifications. Please try again.");
    }
  };

  const showErrorModal = (errorMessage) => {
    setModalConfig({
      visible: true,
      status: 'error',
      title: 'Error',
      message: errorMessage,
      primaryActionLabel: 'Try Again'
    });
  };

  const showUnauthorizedModal = () => {
    setModalConfig({
      visible: true,
      status: 401,
      title: 'Session Expired',
      message: 'Please sign in again to continue.',
      primaryActionLabel: 'Sign In'
    });
  };

  const handleModalClose = () => {
    setModalConfig(prev => ({ ...prev, visible: false }));
  };

  const handleModalPrimaryAction = () => {
    setModalConfig(prev => ({ ...prev, visible: false }));
    
    if (modalConfig.status === 401) {
      router.replace('/auth/login');
    } else if (modalConfig.status === 'error') {
      fetchNotifications();
    }
  };

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

  // Format time function
  const formatTime = (timestamp) => {
    // You might need to adjust this based on your API response format
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading && !refreshing && notifications.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-slate-600 mt-4">Loading notifications...</Text>
      </View>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center px-6">
        <Ionicons name="notifications-off" size={64} color="#94a3b8" />
        <Text className="text-slate-600 text-lg text-center mb-4">
          Failed to load notifications
        </Text>
        <TouchableOpacity 
          onPress={fetchNotifications}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              {notifications.length} unread notifications
            </Text>
          </View>
          <TouchableOpacity 
            onPress={fetchNotifications}
            className="bg-white/20 rounded-2xl p-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="refresh" size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Notifications List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
        style={{ marginTop: -20, zIndex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
      >
        <View className="px-4 space-y-4">
          {notifications.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center justify-center">
              <Ionicons name="notifications-off" size={48} color="#94a3b8" />
              <Text className="text-slate-600 text-lg text-center mt-4">
                No notifications yet
              </Text>
              <Text className="text-slate-400 text-sm text-center mt-2">
                You'll see notifications here when you have new bids or updates
              </Text>
            </View>
          ) : (
            notifications.map((notification) => {
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
                        {formatTime(notification.timestamp || notification.time)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
                        {formatTime(selectedNotification.timestamp || selectedNotification.time)}
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

      {/* Status Modal */}
      <StatusModal
        visible={modalConfig.visible}
        onClose={handleModalClose}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        primaryActionLabel={modalConfig.primaryActionLabel}
        onPrimaryAction={handleModalPrimaryAction}
        showCloseButton={modalConfig.status !== 401}
      />
    </View>
  );
};

export default Notifications;