import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState, useEffect } from 'react';
import { formatDate } from '../../../util/helper';
import { useApi } from '../../../util/useApi';
import { api } from '../../../util/requester';
import { Alert } from 'react-native';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT =
  Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.92 : SCREEN_HEIGHT * 0.95;

const EditTaskBottomSheet = ({ visible, onClose, taskData, onSave }) => {
  const insets = useSafeAreaInsets(); 

  const [formData, setFormData] = useState({
    title: taskData?.title || '',
    description: taskData?.description || '',
    budget: taskData?.budget?.toString() || '',
    duration: taskData?.duration || '',
    category: taskData?.category || 'Design',
    deadline: taskData?.deadline ? new Date(taskData.deadline) : new Date(),
    mode: taskData?.mode || 'Remote',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { request, isLoading } = useApi();
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const categories = ['Design', 'Development', 'Writing', 'Marketing', 'Other'];
  const modes = ['Remote', 'On-site', 'Hybrid'];

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

  const formatDateToISO = (date) => date.toISOString();

  const formatDateForDisplay = (date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleSave = async () => {
    const payload = {
      taskId: taskData?.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      budget: parseFloat(formData.budget) || 0,
      deadline: formatDateToISO(formData.deadline),
    };

    console.log('📦 Sending update payload:', payload);

    const result = await request(api.put('/poster/update', payload));

    if (result.ok) {
      Alert.alert('Success', 'Task updated successfully!');
      onSave && onSave();
      onClose();
    } else {
      Alert.alert('Error', result.error?.detail || 'Failed to update task. Try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        deadline: selectedDate,
      }));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = formData.deadline;
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      setFormData((prev) => ({
        ...prev,
        deadline: newDate,
      }));
    }
  };

  const renderInputField = (label, field, placeholder, multiline = false, keyboardType = 'default') => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: SCREEN_WIDTH < 375 ? 13 : 14,
          fontWeight: '700',
          color: '#111',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: '#f5f5f5',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          paddingHorizontal: 16,
          paddingVertical: multiline ? 12 : 0,
          minHeight: multiline ? 100 : 50,
        }}
      >
        <TextInput
          style={{
            fontSize: SCREEN_WIDTH < 375 ? 15 : 16,
            color: '#111',
            fontWeight: '500',
            textAlignVertical: multiline ? 'top' : 'center',
            minHeight: multiline ? 80 : 50,
          }}
          placeholder={placeholder}
          placeholderTextColor="#777"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          multiline={multiline}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  const renderDateField = () => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: SCREEN_WIDTH < 375 ? 13 : 14,
          fontWeight: '700',
          color: '#111',
          marginBottom: 8,
        }}
      >
        Deadline
      </Text>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            paddingHorizontal: 16,
            paddingVertical: 15,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: SCREEN_WIDTH < 375 ? 14 : 16,
              color: '#111',
              fontWeight: '500',
            }}
          >
            {formatDateForDisplay(formData.deadline)}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#6366F1" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{
            width: 60,
            backgroundColor: '#f5f5f5',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            paddingHorizontal: 12,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="time-outline" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.deadline}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.deadline}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );

  const renderSelectField = (label, field, options, selectedValue) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: SCREEN_WIDTH < 375 ? 13 : 14,
          fontWeight: '700',
          color: '#111',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleInputChange(field, option)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: selectedValue === option ? '#6366F1' : '#f5f5f5',
                borderWidth: 1,
                borderColor: selectedValue === option ? '#6366F1' : '#e0e0e0',
              }}
            >
              <Text
                style={{
                  fontSize: SCREEN_WIDTH < 375 ? 13 : 14,
                  fontWeight: '600',
                  color: selectedValue === option ? '#fff' : '#111',
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const handleBackgroundPress = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', opacity: fadeAnim }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleBackgroundPress} />
        <Animated.View
          style={{
            height: BOTTOM_SHEET_HEIGHT,
            transform: [{ translateY }],
            width: '100%',
          }}
        >
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
            }}
          >
            {/* Header */}
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
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: SCREEN_WIDTH < 375 ? 20 : 22,
                      fontWeight: '800',
                      color: '#ffffff',
                      marginBottom: 4,
                    }}
                  >
                    Edit Task
                  </Text>
                  <Text
                    style={{
                      fontSize: SCREEN_WIDTH < 375 ? 12 : 14,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    Update your task details
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

            {/* Content */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.05),
                  paddingTop: 20,
                  paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderInputField('Task Title', 'title', 'Enter task title...')}
                {renderInputField('Description', 'description', 'Describe your task...', true)}
                <View style={{ flexDirection: SCREEN_WIDTH < 375 ? 'column' : 'row', gap: 12 }}>
                  <View style={{ flex: 1, marginBottom: SCREEN_WIDTH < 375 ? 20 : 0 }}>
                    {renderInputField('Budget (₹)', 'budget', 'Enter amount', false, 'number-pad')}
                  </View>
                  <View style={{ flex: 1 }}>{renderInputField('Duration', 'duration', 'e.g., 3 days')}</View>
                </View>
                {renderSelectField('Category', 'category', categories, formData.category)}
                {renderSelectField('Work Mode', 'mode', modes, formData.mode)}
                {renderDateField()}
              </ScrollView>
            </KeyboardAvoidingView>

            {/* Fixed Bottom Buttons */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#f1f5f9',
                paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.05),
                paddingVertical: 16,
                paddingBottom:
                  Platform.OS === 'ios'
                    ? Math.max(20, insets.bottom + 20)
                    : Math.max(16, insets.bottom + 16), // ✅ Safe inset padding fix
              }}
            >
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: '#cbd5e1',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}
                >
                  <Text
                    style={{
                      fontSize: SCREEN_WIDTH < 375 ? 15 : 16,
                      fontWeight: '700',
                      color: '#64748b',
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isLoading}
                  style={{
                    flex: 2,
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  <LinearGradient
                    colors={['#6366F1', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8,
                      shadowColor: '#6366F1',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text
                      style={{
                        fontSize: SCREEN_WIDTH < 375 ? 15 : 16,
                        fontWeight: '700',
                        color: '#fff',
                      }}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default EditTaskBottomSheet;
