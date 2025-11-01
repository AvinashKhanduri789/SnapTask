// components/profile/ActionButtons.js
import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons = ({ isEditing, onEdit, onSave, onCancel, onLogout, isSaving = false }) => {
  if (!isEditing) {
    return (
      <View className="px-6 py-4 bg-white border-t border-slate-100">
        {/* Edit Profile Button */}
        <TouchableOpacity 
          className="bg-white border-2 border-purple-500 rounded-2xl py-4 flex-row items-center justify-center mb-3"
          onPress={onEdit}
          activeOpacity={0.8}
          disabled={isSaving}
          style={{
            shadowColor: '#8b5cf6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <Ionicons name="pencil" size={18} color="#6366f1" />
          <Text className="text-purple-600 font-semibold text-base ml-2">Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity 
          className="bg-white border-2 border-red-500 rounded-2xl py-4 flex-row items-center justify-center"
          onPress={onLogout}
          activeOpacity={0.8}
          disabled={isSaving}
          style={{
            shadowColor: '#ef4444',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text className="text-red-600 font-semibold text-base ml-2">Logout</Text>
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
            opacity: isSaving ? 0.6 : 1,
          }}
          onPress={onCancel}
          activeOpacity={0.7}
          disabled={isSaving}
        >
          <Text className="text-slate-600 font-semibold text-base">Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="py-4 rounded-2xl items-center flex-row justify-center"
          style={{
            width: '48%',
            backgroundColor: isSaving ? '#9ca3af' : '#10b981',
            shadowColor: isSaving ? '#9ca3af' : '#10b981',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={onSave}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
          )}
          <Text className="text-white font-semibold text-base ml-2">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActionButtons;