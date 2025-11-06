// components/profile/ProfileScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileHeader from '../../../components/poster/profile/ProfileHeader';
import ProfileInfo from '../../../components/poster/profile/ProfileInfo';
import AccountSettings from '../../../components/poster/profile/AccountSettings';
import ActionButtons from '../../../components/poster/profile/ActionButtons';
import { useAuth } from '../../_layout';
import { useApi } from "../../../util/useApi";
import { api } from "../../../util/requester";

const ProfileScreen = () => {
  const { logout,userData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const { request, data, isLoading, error } = useApi();
  const { request: updateRequest } = useApi(); 
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userRole = userData?.role;
  const profileEndpointPrefix = userRole === "POSTER" ? "poster" : "seeker";

  const loadProfileData = async () => {
    await request(api.get(`/${profileEndpointPrefix}/profile`));
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const handleSave = async () => {
    if (!profileData) return;

    setIsSaving(true);
    try {
      // Prepare the data for the API call
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        workplace: profileData.workplace,
        bio: profileData.bio,
        skills: profileData.skills || [],
        
      };

     
      const response = await api.put(`/${profileEndpointPrefix}/profile`, updateData);

      if (response.status >= 200 && response.status < 300) {
        
        setIsEditing(false);
        console.log('Profile saved:', profileData);

        
        await loadProfileData();
      } else {
        
        Alert.alert('Error', 'Failed to update profile. Please try again.');
        // console.error('Profile update failed:', response);
      }
    } catch (err) {
      
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };



  const handleCancel = () => {
    // Reload original data to discard changes
    loadProfileData();
    setIsEditing(false);
  };

  const updateProfileData = useCallback((field, value) => {
    setProfileData(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  // Loading State - Show only during initial load when no data exists
  if (isLoading && !profileData) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <ProfileHeader />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-600 mt-4 text-lg">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State - Show only if no profile data exists
  if (error && !profileData) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <ProfileHeader />
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-red-50 rounded-2xl p-6 items-center border border-red-200">
            <Text className="text-red-500 text-xl font-bold mb-2">
              Failed to load profile
            </Text>
            <Text className="text-slate-600 text-center mb-4">
              {error.message || 'Please try again later'}
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-xl"
              onPress={loadProfileData}
            >
              <Text className="text-white font-bold text-base">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Don't render child components until profileData is available
  if (!profileData) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <ProfileHeader />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-600 mt-4 text-lg">Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ProfileHeader />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
      >
        <View className="p-4 space-y-6">
          <ProfileInfo
            profileData={profileData}
            isEditing={isEditing}
            updateProfileData={updateProfileData}
          />
          <AccountSettings profileData={profileData} />
          <ActionButtons
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onLogout={logout}
            isSaving={isSaving}
          />
        </View>
      </ScrollView>

      {/* Saving Overlay */}
      {isSaving && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-slate-600 mt-4 text-base">Saving changes...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen; 