// components/profile/ActionButtons.js
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons = ({ isEditing, onEdit, onSave, onCancel }) => {
  if (!isEditing) {
    return (
      <View className="px-6 py-4 bg-white border-t border-slate-100">
        <TouchableOpacity 
          className="bg-white border-2 border-purple-500 rounded-2xl py-4 flex-row items-center justify-center"
          onPress={onEdit}
          activeOpacity={0.8}
          style={{
            shadowColor: '#8b5cf6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Ionicons name="pencil" size={18} color="#6366f1" />
          <Text className="text-purple-600 font-semibold text-base ml-2">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="px-6 py-5 bg-white border-t border-slate-100">
      <View className="flex-row justify-between">
        <TouchableOpacity 
          className="py-4 rounded-2xl border border-slate-200 items-center"
          style={{
            width: '48%',
            backgroundColor: '#f8fafc',
          }}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text className="text-slate-600 font-semibold text-base">Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="py-4 rounded-2xl items-center flex-row justify-center"
          style={{
            width: '48%',
            backgroundColor: '#10b981',
            shadowColor: '#10b981',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={onSave}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
          <Text className="text-white font-semibold text-base ml-2">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActionButtons;