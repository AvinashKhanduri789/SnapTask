// components/profile/ProfileInfo.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert, Modal, ScrollView } from 'react-native';
import { formatDate } from '../../../util/helper';
import useLocation from '../../../context/useLocation';
import StatusModal from '../../../components/common/StatusModal';

// Define categories
const categories = [
  { name: 'Design & Creative', icon: 'color-palette' },
  { name: 'Development & IT', icon: 'code' },
  { name: 'Writing & Translation', icon: 'create' },
  { name: 'Marketing', icon: 'megaphone' },
  { name: 'Administrative', icon: 'document-text' },
  { name: 'Customer Service', icon: 'headset' },
  { name: 'Other', icon: 'ellipsis-horizontal' }
];

const ProfileInfo = ({ profileData, isEditing, updateProfileData }) => {
  const { getUserLocation, isLoading: locationLoading, errorMsg } = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);
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

  const toggleSkill = (skillName) => {
    const currentSkills = Array.isArray(profileData.skills) ? profileData.skills : [];

    if (currentSkills.includes(skillName)) {

      updateProfileData('skills', currentSkills.filter(skill => skill !== skillName));
    } else {

      updateProfileData('skills', [...currentSkills, skillName]);
    }
  };

  const isSkillSelected = (skillName) => {
    return Array.isArray(profileData.skills) && profileData.skills.includes(skillName);
  };

  const getSelectedSkillsText = () => {
    if (!Array.isArray(profileData.skills) || profileData.skills.length === 0) {
      return 'Select your skills...';
    }
    return profileData.skills.join(', ');
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
          onSubmitEditing={multiline ? undefined : () => { }}
        />
      ) : (
        <Text className={`text-slate-800 text-base font-semibold ${multiline ? 'leading-5' : ''}`}>
          {value || (multiline ? 'No bio added yet' : 'Not set')}
        </Text>
      )}
    </View>
  );

  const SkillsField = () => (
    <View className="bg-white rounded-2xl p-4 border-2 border-slate-200 mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="construct" size={20} color="#6366f1" />
        <Text className="text-slate-600 font-semibold text-sm ml-2">Skills & Expertise</Text>
      </View>

      {isEditing ? (
        <>
          <TouchableOpacity
            className="bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 flex-row justify-between items-center"
            onPress={() => setSkillsModalVisible(true)}
          >
            <Text className={`text-slate-900 text-base font-semibold ${!profileData.skills?.length ? 'opacity-50' : ''}`}>
              {getSelectedSkillsText()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#64748b" />
          </TouchableOpacity>

          {profileData.skills?.length > 0 && (
            <View className="mt-3 flex-row flex-wrap">
              {profileData.skills.map((skill, index) => (
                <View key={index} className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-blue-800 text-sm font-medium">{skill}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <View>
          {profileData.skills?.length > 0 ? (
            <View className="flex-row flex-wrap">
              {profileData.skills.map((skill, index) => (
                <View key={index} className="bg-slate-100 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-slate-700 text-sm font-medium">{skill}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-slate-500 text-base">No skills added yet</Text>
          )}
        </View>
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
          className={`flex-row items-center justify-between rounded-xl p-3 border-2 ${locationLoading
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
            <Text className={`text-base font-semibold ml-2 flex-1 ${locationLoading ? 'text-slate-500' : 'text-blue-700'
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
          {/* Capital letter avatar */}
          <View className="w-20 h-20 rounded-full bg-blue-100 justify-center items-center mb-3 border border-blue-200 shadow-sm">
            <Text className="text-3xl font-extrabold text-blue-700">
              {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>

          {/* Name and Role */}
          <Text className="text-xl font-bold text-slate-800">{profileData.name || 'User'}</Text>
          <Text className="text-slate-500 text-sm mt-1">{profileData.role || 'Poster'}</Text>
        </View>


        {/* Personal Information */}
        <Text className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Personal Information</Text>

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

        {/* Location Field */}
        <LocationField />

        {/* Skills Field - Updated with Dropdown */}
        <SkillsField />

        {/* Bio Section */}
        <ProfileField
          label="About You"
          value={profileData.bio}
          field="bio"
          icon="information-circle"
          multiline={true}
        />

        {/* Account Information */}
        <Text className="text-lg font-bold text-slate-800 mb-4 mt-6 border-b border-slate-200 pb-2">Account Information</Text>

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

    
      </View>

      {/* Skills Selection Modal */}
      <Modal
        visible={skillsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSkillsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50 mb-10">
          <View className="bg-white rounded-t-3xl max-h-3/4">
            <View className="p-6 border-b border-slate-200">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-bold text-slate-900">Select Skills</Text>
                <TouchableOpacity
                  onPress={() => setSkillsModalVisible(false)}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <Text className="text-slate-600">Choose your skills from available categories</Text>
            </View>

            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              <View className="space-y-3">
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`flex-row items-center p-4 rounded-2xl border-2 ${isSkillSelected(category.name)
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-slate-200'
                      }`}
                    onPress={() => toggleSkill(category.name)}
                  >
                    <View className={`w-10 h-10 rounded-xl items-center justify-center ${isSkillSelected(category.name) ? 'bg-blue-100' : 'bg-slate-100'
                      }`}>
                      <Ionicons
                        name={category.icon}
                        size={20}
                        color={isSkillSelected(category.name) ? "#3b82f6" : "#64748b"}
                      />
                    </View>
                    <Text className={`ml-4 font-semibold text-base flex-1 ${isSkillSelected(category.name) ? "text-blue-800" : "text-slate-700"
                      }`}>
                      {category.name}
                    </Text>
                    {isSkillSelected(category.name) && (
                      <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View className="p-6 border-t border-slate-200">
              <TouchableOpacity
                className="bg-blue-500 py-4 rounded-2xl items-center shadow-lg"
                onPress={() => setSkillsModalVisible(false)}
              >
                <Text className="text-white font-bold text-base">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Status Modal */}
      <StatusModal
        visible={modalVisible}
        onClose={handleModalClose}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        primaryActionLabel={modalConfig.primaryActionLabel}
        onPrimaryAction={handleModalPrimaryAction}
        showCloseButton={modalConfig.status !== 'info'}
        vibration={modalConfig.status === 'error' || modalConfig.status === 'success'}
      />
    </>
  );
};

export default React.memo(ProfileInfo);