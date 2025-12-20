// components/profile/ProfileScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ProfileInfo from '../../../components/poster/profile/ProfileInfo';
import AccountSettings from '../../../components/poster/profile/AccountSettings';
import ActionButtons from '../../../components/poster/profile/ActionButtons';
import StatusModal from '../../../components/common/StatusModal'; // Import StatusModal
import { useAuth } from '../../_layout';
import { useApi } from "../../../util/useApi";
import { api } from "../../../util/requester";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

const categories = [
    { name: 'Design & Creative', icon: 'color-palette' },
    { name: 'Development & IT', icon: 'code' },
    { name: 'Writing & Translation', icon: 'create' },
    { name: 'Marketing', icon: 'megaphone' },
    { name: 'Administrative', icon: 'document-text' },
    { name: 'Customer Service', icon: 'headset' },
    { name: 'Other', icon: 'ellipsis-horizontal' }
];

const ProfileScreen = () => {
  const { logout, userData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const { request, data, isLoading, error } = useApi();
  const { request: updateRequest } = useApi(); 
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
 
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  useEffect(()=>{
    console.log("profile data on profile screen is -->", profileData);
  },[profileData]);

  const handleSave = async () => {
    if (!profileData) return;

    setIsSaving(true);
    try {
      
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        workplace: profileData.workplace,
        bio: profileData.bio,
        skills: profileData.skills || [], 
      };
      
      console.log("while updating profile updateData is --->", updateData);
      const response = await api.put(`/${profileEndpointPrefix}/profile`, updateData);

      if (response.status >= 200 && response.status < 300) {
        setIsEditing(false);
        console.log('Profile saved:', profileData);
        await loadProfileData();
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfileData();
    setIsEditing(false);
  };

  const updateProfileData = useCallback((field, value) => {
    setProfileData(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    router.replace("/auth/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Loading State
  if (isLoading && !profileData) {
    return (
      <View className="flex-1 bg-slate-50">
        <StatusBar backgroundColor="#6366F1" barStyle="light-content" translucent />
        <View className="relative">
         
          <LinearGradient
            colors={['#6366F1', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 200,
              paddingTop: 60,
            }}
          >
            <SafeAreaView>
              <View className="px-6">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-3xl font-bold text-white mb-2">
                      Profile
                    </Text>
                    <Text className="text-purple-100 text-base font-medium">
                      Manage your personal information
                    </Text>
                  </View>
                  <View className="bg-white/20 rounded-2xl p-3">
                    <Text className="text-white text-lg">👤</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
          

          <View 
            style={{
              position: 'absolute',
              bottom: -40,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: 'white',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-600 mt-4 text-lg">Loading profile...</Text>
        </View>
      </View>
    );
  }

  // Error State
  if (error && !profileData) {
    return (
      <View className="flex-1 bg-slate-50">
        <StatusBar backgroundColor="#6366F1" barStyle="light-content" translucent />
        <View className="relative">
          {/* Original Gradient Background with curved bottom */}
          <LinearGradient
            colors={['#6366F1', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 200,
              paddingTop: 60,
            }}
          >
            <SafeAreaView>
              <View className="px-6">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-3xl font-bold text-white mb-2">
                      Profile
                    </Text>
                    <Text className="text-purple-100 text-base font-medium">
                      Manage your personal information
                    </Text>
                  </View>
                  <View className="bg-white/20 rounded-2xl p-3">
                    <Text className="text-white text-lg">👤</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
          
      
          <View 
            style={{
              position: 'absolute',
              bottom: -40,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: 'white',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          />
        </View>
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
      </View>
    );
  }


  if (!profileData) {
    return (
      <View className="flex-1 bg-slate-50">
        <StatusBar backgroundColor="#6366F1" barStyle="light-content" translucent />
        <View className="relative">
         
          <LinearGradient
            colors={['#6366F1', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 200,
              paddingTop: 60,
            }}
          >
            <SafeAreaView>
              <View className="px-6">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-3xl font-bold text-white mb-2">
                      Profile
                    </Text>
                    <Text className="text-purple-100 text-base font-medium">
                      Manage your personal information
                    </Text>
                  </View>
                  <View className="bg-white/20 rounded-2xl p-3">
                    <Text className="text-white text-lg">👤</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
          
     
          <View 
            style={{
              position: 'absolute',
              bottom: -40,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: 'white',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-600 mt-4 text-lg">Loading profile data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" translucent />
      
      {/* Original Header Design with curved bottom */}
      <View className="relative">
        <LinearGradient
          colors={['#6366F1', '#3B82F6', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 200,
            paddingTop: 60,
          }}
        >
          <SafeAreaView>
            <View className="px-6">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-3xl font-bold text-white mb-2">
                    Profile
                  </Text>
                  <Text className="text-purple-100 text-base font-medium">
                    Manage your personal information
                  </Text>
                </View>
                <View className="bg-white/20 rounded-2xl p-3">
                  <Text className="text-white text-lg">👤</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
        
        {/* Original Curved Bottom Overlay */}
        <View 
          style={{
            position: 'absolute',
            bottom: -40,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: 'white',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        />
      </View>

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
        <View className="p-4 space-y-6" style={{ marginTop: -20 }}>
          <ProfileInfo
            profileData={profileData}
            isEditing={isEditing}
            updateProfileData={updateProfileData}
            categories={categories} 
          />
          <AccountSettings profileData={profileData} />
          <ActionButtons
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onLogout={handleLogoutClick} 
            isSaving={isSaving}
          />
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <StatusModal
        visible={showLogoutModal}
        onClose={handleLogoutCancel}
        status="warning"
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        showCloseButton={true}
        vibration={true}
        primaryActionLabel="Logout"
        onPrimaryAction={handleLogoutConfirm}
      />

      {/* Saving Overlay */}
      {isSaving && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-slate-600 mt-4 text-base">Saving changes...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;