import React, { useEffect, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  Easing,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StatusModal = ({
  visible,
  onClose,
  status,
  title,
  message,
  showCloseButton = true,
  vibration = true,
  primaryActionLabel = 'OK',
  onPrimaryAction,
}) => {
  const router = useRouter();
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const slideValue = useRef(new Animated.Value(50)).current;

  // Handle both string status and HTTP status codes
  const isSuccess = status === 'success' || status === 200 || status === 201;
  const isError = status === 'error' || (status >= 400 && status !== 401);
  const isWarning = status === 'warning';
  const isInfo = status === 'info' || (status >= 300 && status < 400);
  const isUnauthorized = status === 401;

  console.log('IN STATUS MODAL CURRENT STATUS IS', status);

  // Get configuration based on status
  const getConfig = () => {
    if (isUnauthorized) {
      return {
        icon: 'log-out',
        colors: {
          primary: '#ef4444',
          light: '#fee2e2',
          dark: '#dc2626'
        },
        iconColor: '#ef4444'
      };
    }

    if (isSuccess) {
      return {
        icon: 'checkmark-circle',
        colors: {
          primary: '#10b981',
          light: '#d1fae5',
          dark: '#059669'
        },
        iconColor: '#10b981'
      };
    }

    if (isError) {
      return {
        icon: 'close-circle',
        colors: {
          primary: '#ef4444',
          light: '#fee2e2',
          dark: '#dc2626'
        },
        iconColor: '#ef4444'
      };
    }

    if (isWarning) {
      return {
        icon: 'warning',
        colors: {
          primary: '#f59e0b',
          light: '#fef3c7',
          dark: '#d97706'
        },
        iconColor: '#f59e0b'
      };
    }

    // Default info style
    return {
      icon: 'information-circle',
      colors: {
        primary: '#3b82f6',
        light: '#dbeafe',
        dark: '#2563eb'
      },
      iconColor: '#3b82f6'
    };
  };

  const config = getConfig();

  useEffect(() => {
    if (visible) {
      // Vibrate on show for error types
      if (vibration && (isError || isWarning || isUnauthorized)) {
        Vibration.vibrate(400);
      }

      // Reset values before starting animations
      scaleValue.setValue(0);
      fadeValue.setValue(0);
      slideValue.setValue(50);

      // Entrance animations
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when modal closes
      scaleValue.setValue(0);
      fadeValue.setValue(0);
      slideValue.setValue(50);
    }
  }, [visible]);

  const handleClose = () => {
    // Exit animations
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handlePrimaryAction = () => {
    if (isUnauthorized) {
      // Navigate to login and close modal
      handleClose();
      setTimeout(() => {
        router.replace('/auth/login');
      }, 300); // Wait for modal close animation
    } else if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      handleClose();
    }
  };

  // For 401 status, only show one button and auto-set label
  const shouldShowCloseButton = showCloseButton && !isUnauthorized;
  const actionLabel = isUnauthorized ? 'Sign In' : primaryActionLabel;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/70">
        <Animated.View 
          style={{
            opacity: fadeValue,
            transform: [
              { scale: scaleValue },
              { translateY: slideValue }
            ]
          }}
          className="bg-white w-11/12 max-w-sm rounded-3xl p-6 shadow-2xl items-center border border-gray-100"
        >
          {/* Animated Icon Container */}
          <Animated.View 
            style={{
              transform: [{
                scale: scaleValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                })
              }],
              backgroundColor: config.colors.light
            }}
            className="p-5 rounded-2xl mb-5"
          >
            <Ionicons
              name={config.icon}
              size={52}
              color={config.iconColor}
            />
          </Animated.View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-center text-gray-600 mb-6 text-base leading-6">
            {message}
          </Text>

          {/* Action Buttons */}
          <View className={`w-full ${shouldShowCloseButton ? 'space-y-3' : ''}`}>
            <TouchableOpacity
              onPress={handlePrimaryAction}
              className={`w-full py-4 rounded-2xl shadow-lg`}
              style={{ backgroundColor: config.colors.primary }}
            >
              <Text className="text-white font-bold text-center text-base">
                {actionLabel}
              </Text>
            </TouchableOpacity>
            
            {shouldShowCloseButton && (
              <TouchableOpacity
                onPress={handleClose}
                className="w-full py-3 rounded-2xl border border-gray-300"
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};


export default StatusModal;