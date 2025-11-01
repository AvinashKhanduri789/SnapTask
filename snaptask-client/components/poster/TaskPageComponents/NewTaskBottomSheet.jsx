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


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

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
        status: response.status,  // ✅ use numeric status code (e.g., 200)
        title: "Success",
        message: "Task posted successfully 🎉",
      });
      onClose();
    } else {
      onTaskCreated?.({
        status: response.status || 0, // ✅ fallback if network error
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
          }}>
          <View
            style={{
              flex: 1,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              backgroundColor: '#fff',
              overflow: 'hidden',
            }}>
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 24,
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#f1f5f9',
              }}>
              <View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>
                  Create New Task
                </Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                  Fill in the details to post your task
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f1f5f9',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            {/* Content */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <NewTaskForm
                  onTaskCreated={handleTaskCreated}
                  isLoading={isLoading}
                  isInBottomSheet={true}
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
export default NewTaskBottomSheet;