// components/profile/ProfileSection.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileSection = ({ profileData, isEditing, updateProfileData, menuItems }) => {
  const ProfileField = ({ label, value, field, icon, editable = true }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center mr-3">
          <Ionicons name={icon} size={18} color="#6366f1" />
        </View>
        <Text className="text-slate-600 font-semibold text-sm">{label}</Text>
      </View>
      
      {isEditing && editable ? (
        <TextInput
          className="text-slate-800 text-base font-medium border-b-2 border-slate-200 pb-3 px-1"
          value={value}
          onChangeText={(text) => updateProfileData(field, text)}
        />
      ) : (
        <Text className="text-slate-800 text-base font-medium pb-3 border-b border-slate-100">
          {value}
        </Text>
      )}
    </View>
  );

  const MenuItem = ({ icon, title, description, type, isLast = false }) => (
    <TouchableOpacity 
      className={`flex-row items-center py-4 ${!isLast ? 'border-b border-slate-100' : ''}`}
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color="#6366f1" />
      </View>
      <View className="flex-1">
        <Text className="text-slate-800 font-semibold text-base">{title}</Text>
        <Text className="text-slate-500 text-sm mt-1">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Personal Information Section */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-800 mb-4">Personal Information</Text>
        
        <ProfileField
          label="Full Name"
          value={profileData.name}
          field="name"
          icon="person"
        />
        
        <ProfileField
          label="Email Address"
          value={profileData.email}
          field="email"
          icon="mail"
        />
        
        <ProfileField
          label="Phone Number"
          value={profileData.phone}
          field="phone"
          icon="call"
        />
        
        <ProfileField
          label="College/University"
          value={profileData.college}
          field="college"
          icon="school"
        />
        
        <ProfileField
          label="Location"
          value={profileData.location}
          field="location"
          icon="location"
        />
      </View>

      {/* Account Information */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-800 mb-4">Account Information</Text>
        
        <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center mr-3">
              <Ionicons name="person-circle" size={18} color="#6366f1" />
            </View>
            <Text className="text-slate-600 font-semibold text-sm">Account Type</Text>
          </View>
          <Text className="text-slate-800 font-medium">{profileData.accountType}</Text>
        </View>
        
        <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center mr-3">
              <Ionicons name="calendar" size={18} color="#6366f1" />
            </View>
            <Text className="text-slate-600 font-semibold text-sm">Member Since</Text>
          </View>
          <Text className="text-slate-800 font-medium">{profileData.joinDate}</Text>
        </View>
      </View>

      {/* Settings Menu */}
      <View>
        <Text className="text-lg font-bold text-slate-800 mb-4">Settings</Text>
        <View className="bg-white rounded-2xl border border-slate-200">
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              type={item.type}
              isLast={index === menuItems.length - 1}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProfileSection;