// components/profile/AccountSettings.js
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../../util/helper';

const AccountSettings = ({ profileData }) => {
  const SettingItem = ({ icon, label, value, color = '#6366f1' }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-slate-100">
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color={color} />
        <Text className="text-slate-700 font-medium ml-3">{label}</Text>
      </View>
      <Text className="text-slate-800 font-semibold">{value}</Text>
    </View>
  );

  return (
    <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200">
      <Text className="text-lg font-bold text-slate-800 mb-4">Account Settings</Text>
      
      <SettingItem
        icon="person-circle"
        label="Account Type"
        value={profileData.accountType}
        color="#10b981"
      />
      
      <SettingItem
        icon="shield-checkmark"
        label="Verification Status"
        value="Verified"
        color="#10b981"
      />
      
      <SettingItem
        icon="calendar"
        label="Member Since"
        value={formatDate(profileData.joinDate)}
        color="#f59e0b"
      />
      
      <SettingItem
        icon="document-text"
        label="Tasks Posted"
        value={profileData.taskPosted || "0"}
        color="#6366f1"
      />
      
      <SettingItem
        icon="star"
        label="Poster Rating"
        value={profileData.rating}
        color="#f59e0b"
      />
    </View>
  );
};

export default AccountSettings;