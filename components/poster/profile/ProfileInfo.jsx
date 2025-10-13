// components/profile/ProfileInfo.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ProfileInfo = ({ profileData, isEditing, updateProfileData }) => {
  const ProfileField = ({ label, value, field, icon, editable = true, keyboardType = 'default', multiline = false }) => (
    <View className="bg-white rounded-2xl p-4 border-2 border-slate-200 mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={20} color="#6366f1" />
        <Text className="text-slate-600 font-semibold text-sm ml-2">{label}</Text>
      </View>
      
      {isEditing && editable ? (
        <TextInput
          className={`text-slate-800 text-base font-semibold border-b-2 border-slate-200 ${multiline ? 'min-h-20' : 'pb-2'}`}
          value={value}
          onChangeText={(text) => updateProfileData(field, text)}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholder={multiline ? "Tell others about yourself..." : ""}
          placeholderTextColor="#94a3b8"
        />
      ) : (
        <Text className={`text-slate-800 text-base font-semibold ${multiline ? 'leading-5' : ''}`}>
          {value || (multiline ? 'No bio added yet' : 'Not set')}
        </Text>
      )}
    </View>
  );

  const ReadOnlyField = ({ label, value, icon, color = "#6366f1" }) => (
    <View className="bg-white rounded-2xl p-4 border-2 border-slate-200 mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={20} color={color} />
        <Text className="text-slate-600 font-semibold text-sm ml-2">{label}</Text>
      </View>
      <Text className="text-slate-800 text-base font-semibold">{value}</Text>
    </View>
  );

  return (
    <ScrollView className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200" showsVerticalScrollIndicator={false}>
      {/* Profile Picture Section */}
      <View className="items-center mb-6">
        <View className="w-24 h-24 bg-purple-500 rounded-2xl items-center justify-center mb-4 shadow-sm">
          <Text className="text-white text-2xl font-bold">
            {profileData.name.charAt(0)}
          </Text>
        </View>
        {/* {isEditing && (
          <TouchableOpacity className="bg-purple-100 px-4 py-2 rounded-full border border-purple-200">
            <Text className="text-purple-700 font-semibold text-sm">Change Photo</Text>
          </TouchableOpacity>
        )} */}
      </View>

      {/* Personal Information */}
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
        keyboardType="email-address"
      />
      
      <ProfileField
        label="Phone Number"
        value={profileData.phone}
        field="phone"
        icon="call"
        keyboardType="phone-pad"
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

      {/* Bio Section */}
      <ProfileField
        label="About You"
        value={profileData.bio}
        field="bio"
        icon="information-circle"
        multiline={true}
      />

      {/* Skills Section */}
      <ProfileField
        label="Skills & Expertise"
        value={profileData.skills}
        field="skills"
        icon="construct"
        multiline={true}
      />

      {/* Account Information */}
      <Text className="text-lg font-bold text-slate-800 mb-4 mt-2">Account Information</Text>
      
      <ReadOnlyField
        label="Account Type"
        value={profileData.role || "Poster"}
        icon="briefcase"
        color="#10b981"
      />
      
      <ReadOnlyField
        label="Rating"
        value={profileData.rating || "4.8 / 5"}
        icon="star"
        color="#f59e0b"
      />
      
      <ReadOnlyField
        label="Member Since"
        value={profileData.joinDate || "Jan 2024"}
        icon="calendar"
        color="#6366f1"
      />

      {/* Stats Section */}
      <Text className="text-lg font-bold text-slate-800 mb-4 mt-2">Activity Stats</Text>
      
      <View className="flex-row justify-between mb-4">
        <View className="bg-slate-50 rounded-2xl p-4 flex-1 mr-2 border border-slate-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="document-text" size={16} color="#6366f1" />
            <Text className="text-slate-600 text-xs font-semibold ml-1">Tasks Posted</Text>
          </View>
          <Text className="text-slate-800 text-xl font-bold">12</Text>
        </View>
        
        <View className="bg-slate-50 rounded-2xl p-4 flex-1 mx-2 border border-slate-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="checkmark-done" size={16} color="#10b981" />
            <Text className="text-slate-600 text-xs font-semibold ml-1">Completed</Text>
          </View>
          <Text className="text-slate-800 text-xl font-bold">8</Text>
        </View>
        
        <View className="bg-slate-50 rounded-2xl p-4 flex-1 ml-2 border border-slate-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="time" size={16} color="#f59e0b" />
            <Text className="text-slate-600 text-xs font-semibold ml-1">Active</Text>
          </View>
          <Text className="text-slate-800 text-xl font-bold">3</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileInfo;