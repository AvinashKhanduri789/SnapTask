import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NewTaskForm from "../../../components/poster/TaskPageComponents/NewTaskForm";
import { useApi } from "../../../util/useApi";
import { api } from "../../../util/requester";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
// Increased height for better content visibility
const BOTTOM_SHEET_HEIGHT = Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.92 : SCREEN_HEIGHT * 0.95;

const NewTaskBottomSheet = ({ visible, onClose, onTaskCreated }) => {
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { request, data, isLoading, error } = useApi();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 350,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleBackgroundPress = () => {
    if (!isLoading) onClose();
  };

  const handleTaskCreated = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      mode: formData.mode,
      deadline: formData.deadline,
      isUnpaid: !formData.isPaid,
      budget: parseFloat(formData.budget) || 0,
    };

    const response = await request(api.post("/poster/create", payload));

    if (response.ok) {
      onTaskCreated?.({
        status: response.status,  
        title: "Success",
        message: "Task posted successfully 🎉",
      });
      onClose();
    } else {
      onTaskCreated?.({
        status: response.status || 0, 
        title: response.error?.title || "Error",
        message:
          response.error?.detail ||
          response.error?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: fadeAnim,
        }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={handleBackgroundPress}
        />
        <Animated.View
          style={{
            height: BOTTOM_SHEET_HEIGHT,
            transform: [{ translateY }],
            width: '100%',
          }}>
          <View
            style={{
              flex: 1,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              backgroundColor: '#fff',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
            }}>
            {/* Header with Gradient */}
            <LinearGradient
              colors={['#3B82F6', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingHorizontal: 24,
                paddingVertical: Platform.OS === 'ios' ? 28 : 24,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: SCREEN_WIDTH < 375 ? 20 : 24, 
                    fontWeight: '800', 
                    color: '#ffffff',
                    marginBottom: 4,
                  }}>
                    Create New Task
                  </Text>
                  <Text style={{ 
                    fontSize: SCREEN_WIDTH < 375 ? 12 : 14, 
                    color: 'rgba(255,255,255,0.9)',
                  }}>
                    Fill in the details to post your task
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 16,
                  }}
                >
                  <Ionicons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Content with minimal padding */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
              <View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 34 : 20 }}>
                <ScrollView 
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ 
                    flexGrow: 1,
                    // Reduced horizontal padding for wider input fields
                    paddingHorizontal: 12,
                    paddingTop: 16,
                    paddingBottom: 20,
                  }}
                  keyboardShouldPersistTaps="handled"
                >
                  <NewTaskForm
                    onTaskCreated={handleTaskCreated}
                    isLoading={isLoading}
                    isInBottomSheet={true}
                  />
                </ScrollView>
              </View>
            </KeyboardAvoidingView>

            {/* Loading Overlay */}
            {isLoading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 24,
                    borderRadius: 16,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5,
                  }}
                >
                  <Ionicons name="time" size={32} color="#3B82F6" />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: '#1e293b', 
                    marginTop: 12,
                    textAlign: 'center',
                  }}>
                    Creating your task...
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#64748b', 
                    marginTop: 4,
                    textAlign: 'center',
                  }}>
                    Please wait a moment
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default NewTaskBottomSheet;  