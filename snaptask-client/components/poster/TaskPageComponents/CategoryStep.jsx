import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const CategoryStep = ({ formData, updateFormData }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const categories = [
    { name: 'Design & Creative', icon: 'color-palette' },
    { name: 'Development & IT', icon: 'code' },
    { name: 'Writing & Translation', icon: 'create' },
    { name: 'Marketing', icon: 'megaphone' },
    { name: 'Administrative', icon: 'document-text' },
    { name: 'Customer Service', icon: 'headset' },
    { name: 'Other', icon: 'ellipsis-horizontal' }
  ];

  const modes = [
    { name: 'REMOTE', icon: 'laptop-outline' },
    { name: 'ONSITE', icon: 'business-outline' }
  ];

  const formatDate = (date) => {
    if (!date) return 'Select deadline';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateFormData('deadline', selectedDate);
    }
  };

  return (
    <ScrollView className="flex-1 px-6">
      {/* Header */}
      <View className="mb-8">
        <View className="flex-row items-center mb-3">
          <View className="w-6 h-6 bg-purple-600 rounded-full items-center justify-center mr-2">
            <Text className="text-white text-xs font-bold">2</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-800">
            Category & Deadline
          </Text>
        </View>
        <Text className="text-base text-slate-500">
          Choose category and set timeline
        </Text>
      </View>

      {/* Category Selection */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-800 mb-4">
          Category *
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              className={`flex-row items-center px-4 py-3 rounded-2xl border-2 ${
                formData.category === category.name
                  ? 'bg-purple-50 border-purple-500'
                  : 'bg-white border-slate-200'
              }`}
              onPress={() => updateFormData('category', category.name)}
            >
              <Ionicons 
                name={category.icon} 
                size={18} 
                color={formData.category === category.name ? '#6366f1' : '#64748b'} 
              />
              <Text
                className={`font-semibold ml-2 ${
                  formData.category === category.name
                    ? 'text-purple-700'
                    : 'text-slate-700'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mode Selection */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-800 mb-4">
          Mode *
        </Text>
        <View className="flex-row gap-3">
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.name}
              className={`flex-1 flex-row items-center justify-center px-4 py-3 rounded-2xl border-2 ${
                formData.mode === mode.name
                  ? 'bg-purple-50 border-purple-500'
                  : 'bg-white border-slate-200'
              }`}
              onPress={() => updateFormData('mode', mode.name)}
            >
              <Ionicons 
                name={mode.icon} 
                size={18} 
                color={formData.mode === mode.name ? '#6366f1' : '#64748b'} 
              />
              <Text
                className={`font-semibold ml-2 ${
                  formData.mode === mode.name
                    ? 'text-purple-700'
                    : 'text-slate-700'
                }`}
              >
                {mode.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Deadline Selection */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-slate-800 mb-3">
          Deadline
        </Text>
        <TouchableOpacity
          className="bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 flex-row justify-between items-center"
          onPress={() => setShowDatePicker(true)}
        >
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={20} color="#6366f1" />
            <Text
              className={`ml-3 text-base font-medium ${
                formData.deadline ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {formatDate(formData.deadline)}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#94a3b8" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.deadline || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Help Text */}
      <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-4">
        <Text className="text-blue-800 font-bold text-sm mb-1">
          💡 Pro Tip
        </Text>
        <Text className="text-blue-700 text-sm">
          Setting a realistic deadline helps you get better quality submissions from seekers.
        </Text>
      </View>
    </ScrollView>
  );
};

export default CategoryStep;