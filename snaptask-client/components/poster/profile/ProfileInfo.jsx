// components/profile/ProfileInfo.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { formatDate } from '../../../util/helper';
import useLocation from '../../../context/useLocation';
import StatusModal from '../../../components/common/StatusModal';

const ProfileInfo = ({ profileData, isEditing, updateProfileData }) => {
  const { getUserLocation, isLoading: locationLoading, errorMsg } = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    status: '',
    title: '',
    message: '',
    primaryActionLabel: 'OK'
  });

  const showModal = (status, title, message, primaryActionLabel = 'OK') => {
    setModalConfig({
      status,
      title,
      message,
      primaryActionLabel
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalPrimaryAction = () => {
    setModalVisible(false);
  };

  const handleLocationPress = () => {
    if (isEditing) {
      Alert.alert(
        'Get Location',
        'This feature will use your device location to automatically fill your current location.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: locationLoading ? 'Getting Location...' : 'Use Current Location', 
            onPress: async () => {
              if (locationLoading) return;
              
              // Show loading modal
              showModal('info', 'Getting Location', 'Fetching your current location...', 'Loading...');
              
              const locationData = await getUserLocation(true);
              
              // Close loading modal
              setModalVisible(false);
              
              if (locationData && locationData.address) {
                // Update the profile with the fetched address
                updateProfileData('location', locationData.address);
                
                // Show success modal
                showModal(
                  'success', 
                  'Location Updated!', 
                  `Your location has been set to: ${locationData.address}`,
                  'Great!'
                );
              } else {
                // Show error modal
                let errorMessage = 'Failed to get location. Please try again.';
                
                if (errorMsg) {
                  errorMessage = errorMsg;
                } else if (!locationData) {
                  errorMessage = 'Could not retrieve location data. Please check your GPS and try again.';
                }
                
                showModal(
                  'error',
                  'Location Error',
                  errorMessage,
                  'Try Again'
                );
              }
            },
            disabled: locationLoading
          }
        ]
      );
    }
  };

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

  const LocationField = () => (
    <View className="bg-white rounded-2xl p-4 border-2 border-slate-200 mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="location" size={20} color="#6366f1" />
        <Text className="text-slate-600 font-semibold text-sm ml-2">Location</Text>
      </View>
      
      {isEditing ? (
        <TouchableOpacity 
          onPress={handleLocationPress}
          disabled={locationLoading}
          className={`flex-row items-center justify-between rounded-xl p-3 border-2 ${
            locationLoading 
              ? 'bg-slate-100 border-slate-300' 
              : 'bg-blue-50 border-blue-200 active:bg-blue-100'
          }`}
        >
          <View className="flex-row items-center flex-1">
            {locationLoading ? (
              <Ionicons name="time" size={20} color="#64748b" />
            ) : (
              <Ionicons name="navigate" size={20} color="#3b82f6" />
            )}
            <Text className={`text-base font-semibold ml-2 flex-1 ${
              locationLoading ? 'text-slate-500' : 'text-blue-700'
            }`}>
              {locationLoading 
                ? 'Getting Location...' 
                : (profileData.location || 'Tap to add location')
              }
            </Text>
          </View>
          {locationLoading ? (
            <Ionicons name="refresh" size={16} color="#64748b" />
          ) : (
            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
          )}
        </TouchableOpacity>
      ) : (
        <Text className="text-slate-800 text-base font-semibold">
          {profileData.address || 'Not set'}
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
    <>
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
          editable={false}
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
          field="workplace"
          icon="school"
        />
        
        {/* Location Field - Now as a button in edit mode */}
        <LocationField />
        
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

    
      <StatusModal
        visible={modalVisible}
        onClose={handleModalClose}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        primaryActionLabel={modalConfig.primaryActionLabel}
        onPrimaryAction={handleModalPrimaryAction}
        showCloseButton={modalConfig.status !== 'info'} // Don't show close for loading
        vibration={modalConfig.status === 'error' || modalConfig.status === 'success'}
      />
    </>
  );
};

export default React.memo(ProfileInfo);