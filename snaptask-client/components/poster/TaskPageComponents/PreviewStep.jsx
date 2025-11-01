import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PreviewStep = ({ formData }) => {
  const formatDate = (date) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (field, value) => {
    if (!value || value === 'Not selected' || value === 'Not set') {
      return { icon: 'warning', color: '#ef4444' };
    }
    return { icon: 'checkmark-circle', color: '#10b981' };
  };

  const getModeIcon = (mode) => {
    return mode === 'REMOTE' ? 'laptop-outline' : 'business-outline';
  };

  const InfoRow = ({ label, value, icon, isLast = false }) => {
    const status = getStatusIcon(label, value);
    return (
      <View className={`flex-row justify-between items-center py-4 ${!isLast ? 'border-b border-slate-100' : ''}`}>
        <View className="flex-row items-center flex-1">
          <Ionicons name={icon} size={18} color="#6366f1" className="mr-3" />
          <Text className="text-sm font-semibold text-slate-600 flex-1">{label}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className={`text-slate-700 text-right ${label === 'Budget' ? 'font-bold' : ''}`}>
            {value}
          </Text>
          <Ionicons 
            name={status.icon} 
            size={16} 
            color={status.color} 
            className="ml-2" 
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 px-6">
      {/* Header */}
      <View className="mb-8">
        <View className="flex-row items-center mb-3">
          <View className="w-6 h-6 bg-purple-600 rounded-full items-center justify-center mr-2">
            <Text className="text-white text-xs font-bold">4</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-800">
            Preview & Confirm
          </Text>
        </View>
        <Text className="text-base text-slate-500">
          Review your task before posting
        </Text>
      </View>

      {/* Task Preview Card */}
      <View className="bg-white rounded-2xl border-2 border-slate-200 p-6 mb-6 shadow-sm">
        {/* Task Title */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="document-text" size={20} color="#6366f1" />
            <Text className="text-lg font-bold text-slate-800 ml-2">Task Title</Text>
          </View>
          <Text className="text-xl font-bold text-slate-800 bg-slate-50 rounded-xl p-4 border border-slate-200">
            {formData.title || 'No title provided'}
          </Text>
        </View>

        {/* Task Description */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="list" size={20} color="#6366f1" />
            <Text className="text-lg font-bold text-slate-800 ml-2">Description</Text>
          </View>
          <Text className="text-slate-700 leading-6 bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-20">
            {formData.description || 'No description provided'}
          </Text>
        </View>

        {/* Task Details */}
        <View className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <InfoRow 
            label="Category" 
            value={formData.category || 'Not selected'} 
            icon="pricetag"
          />
          <InfoRow 
            label="Mode" 
            value={formData.mode || 'Not selected'} 
            icon={getModeIcon(formData.mode)}
          />
          <InfoRow 
            label="Deadline" 
            value={formatDate(formData.deadline)} 
            icon="calendar"
          />
          <InfoRow 
            label="Budget" 
            value={formData.isPaid ? `₹${formData.budget}` : 'Free'} 
            icon="wallet"
          />
          <InfoRow 
            label="Status" 
            value="Ready to Post" 
            icon="rocket"
            isLast={true}
          />
        </View>
      </View>

      {/* Success Metrics */}
      <View className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="checkmark-done" size={24} color="#10b981" />
          <Text className="text-green-800 font-bold text-lg ml-2">Ready to Go! 🚀</Text>
        </View>
        <Text className="text-green-700 text-sm leading-5">
          Your task is complete and ready to be posted. Seekers will be able to:
        </Text>
        <View className="mt-3 space-y-2">
          <View className="flex-row items-center">
            <Ionicons name="eye" size={16} color="#10b981" />
            <Text className="text-green-700 text-sm ml-2">View your task details</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="chatbubbles" size={16} color="#10b981" />
            <Text className="text-green-700 text-sm ml-2">Submit proposals</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color="#10b981" />
            <Text className="text-green-700 text-sm ml-2">Work within your deadline</Text>
          </View>
        </View>
      </View>

      {/* Final Tips */}
      <View className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <View className="flex-row items-center mb-3">
          <Ionicons name="bulb" size={24} color="#3b82f6" />
          <Text className="text-blue-800 font-bold text-lg ml-2">Pro Tips</Text>
        </View>
        <Text className="text-blue-700 text-sm leading-5">
          • Respond quickly to seeker inquiries{'\n'}
          • Review proposals carefully{'\n'}
          • Communicate clearly throughout{'\n'}
          • Provide feedback after completion
        </Text>
      </View>

      {/* Spacer for bottom buttons */}
      <View className="h-20" />
    </ScrollView>
  );
};

export default PreviewStep;