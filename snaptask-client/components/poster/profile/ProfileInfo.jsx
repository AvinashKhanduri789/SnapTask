// components/profile/ProfileInfo.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../../util/helper';

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
          value={value || ''}
          onChangeText={(text) => updateProfileData(field, text)}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholder={multiline ? "Tell others about yourself..." : ""}
          placeholderTextColor="#94a3b8"
          // Add these props to fix keyboard issues
          blurOnSubmit={!multiline}
          returnKeyType={multiline ? "default" : "done"}
          onSubmitEditing={multiline ? undefined : () => {}}
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
      <Text className="text-slate-800 text-base font-semibold">{value || 'Not set'}</Text>
    </View>
  );

  return (
    // REMOVED ScrollView - using View instead to avoid nested scrolling
    <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200">
      {/* Profile Picture Section */}
      <View className="items-center mb-6">
        <View className="w-24 h-24 bg-purple-500 rounded-2xl items-center justify-center mb-4 shadow-sm">
          <Text className="text-white text-2xl font-bold">
            {profileData.name?.charAt(0) || 'U'}
          </Text>
        </View>
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
        editable={false} // Email is typically not editable
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
        value={profileData.workplace}
        field="workplace" // Fixed: was "college" but should match your API field
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
        value={Array.isArray(profileData.skills) ? profileData.skills.join(', ') : profileData.skills}
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
        value={profileData.rating ? `${profileData.rating} ⭐` : 'No ratings yet'}
        icon="star"
        color="#f59e0b"
      />
      
      <ReadOnlyField
        label="Member Since"
        value={formatDate(profileData.joinDate) || 'Not available'}
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
          <Text className="text-slate-800 text-xl font-bold">{profileData.taskPosted || 0}</Text>
        </View>
        
        <View className="bg-slate-50 rounded-2xl p-4 flex-1 mx-2 border border-slate-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="checkmark-done" size={16} color="#10b981" />
            <Text className="text-slate-600 text-xs font-semibold ml-1">Completed</Text>
          </View>
          <Text className="text-slate-800 text-xl font-bold">{profileData.completed || 0}</Text>
        </View>
        
        <View className="bg-slate-50 rounded-2xl p-4 flex-1 ml-2 border border-slate-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="time" size={16} color="#f59e0b" />
            <Text className="text-slate-600 text-xs font-semibold ml-1">Active</Text>
          </View>
          <Text className="text-slate-800 text-xl font-bold">{profileData.active || 0}</Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(ProfileInfo);