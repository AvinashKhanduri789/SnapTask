// components/profile/ProfileScreen.js
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileHeader from '../../../components/poster/profile/ProfileHeader';
import ProfileInfo from '../../../components/poster/profile/ProfileInfo';
import AccountSettings from '../../../components/poster/profile/AccountSettings';
import ActionButtons from '../../../components/poster/profile/ActionButtons';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState({
    name: 'Avinash Khanduri',
    email: 'avinash.khanduri@example.com',
    phone: '+91 98765 43210',
    college: 'Delhi Technological University',
    location: 'New Delhi, India',
    bio: 'Web dev student, love helping with design & code tasks.',
    skills: 'UI Design, React Native, Tutoring, Graphic Design',
    role: 'Poster',
    rating: '4.8 / 5',
    joinDate: 'Jan 2024'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
    console.log('Profile saved:', profileData);
  };

  const updateProfileData = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ProfileHeader />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
            onCancel={() => setIsEditing(false)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;