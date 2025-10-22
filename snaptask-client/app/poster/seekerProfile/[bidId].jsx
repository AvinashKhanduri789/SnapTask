// app/poster/seekerProfile/[bidId].js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BidDetailScreen = () => {
  const router = useRouter();
  const { bidId } = useLocalSearchParams();

  const [bidStatus, setBidStatus] = useState('pending'); // pending, accepted, rejected

  // In a real app, you would fetch bid data based on bidId
  // For now, using mock data
  const bidData = {
    id: bidId,
    seekerName: 'Sarah Chen',
    tagline: 'UI/UX Designer, 3 years experience',
    bio: 'Passionate about creating beautiful and functional designs that solve real user problems. I specialize in mobile app interfaces and branding for tech startups. Always eager to take on new challenges and deliver exceptional results.',
    rating: 4.8,
    completedTasks: 24,
    bidAmount: '₹750',
    timeline: '2 days',
    proposal: "I have extensive experience in hackathon poster design and have worked with multiple tech communities. I can deliver a modern, eye-catching design that represents innovation and technology. My approach includes:\n\n• Research on your target audience\n• 3 initial design concepts\n• 2 rounds of revisions\n• Final files in multiple formats\n\nI'm available to start immediately and can deliver within 2 days.",
    skills: ['UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Illustrator', 'Branding', 'Mobile Design'],
    portfolio: 'sarahchen.design',
    responseTime: 'Within 2 hours',
    successRate: '96%',
    memberSince: 'Jan 2023'
  };

  const handleAcceptBid = () => {
    Alert.alert(
      'Accept Bid',
      `Are you sure you want to accept ${bidData.seekerName}'s bid for ${bidData.bidAmount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'destructive',
          onPress: () => {
            setBidStatus('accepted');
            console.log('Bid accepted:', bidData.id);
          }
        }
      ]
    );
  };

  const handleRejectBid = () => {
    Alert.alert(
      'Reject Bid',
      `Are you sure you want to reject ${bidData.seekerName}'s bid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setBidStatus('rejected');
            console.log('Bid rejected:', bidData.id);
          }
        }
      ]
    );
  };

  const handleViewProfile = () => {
    router.push(`/poster/seeker-full-profile/${bidData.id}`);
  };

  const getStatusColor = () => {
    switch (bidStatus) {
      case 'accepted': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusText = () => {
    switch (bidStatus) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Under Review';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
          >
            <Ionicons name="chevron-back" size={20} color="#64748b" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-800">Bid Details</Text>
            <Text className="text-slate-500 text-sm">Review proposal carefully</Text>
          </View>
          <View style={{ backgroundColor: `${getStatusColor()}15` }} className="px-3 py-1 rounded-full">
            <Text style={{ color: getStatusColor() }} className="text-xs font-bold">
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 space-y-6">
          {/* Seeker Profile Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="flex-row items-start">
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-16 h-16 rounded-full items-center justify-center mr-4 shadow-sm overflow-hidden"
              >
                <Text className="text-white text-2xl font-bold">
                  {bidData.seekerName.charAt(0)}
                </Text>
              </LinearGradient>

              <View className="flex-1">
                <Text className="text-2xl font-bold text-slate-800 mb-1">
                  {bidData.seekerName}
                </Text>
                <Text className="text-slate-500 text-base mb-3">
                  {bidData.tagline}
                </Text>

                <View className="flex-row items-center space-x-4 mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-slate-700 text-sm font-semibold ml-1">
                      {bidData.rating}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-done" size={16} color="#10B981" />
                    <Text className="text-slate-700 text-sm font-semibold ml-1">
                      {bidData.completedTasks} tasks
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time" size={16} color="#3B82F6" />
                    <Text className="text-slate-700 text-sm font-semibold ml-1">
                      {bidData.responseTime}
                    </Text>
                  </View>
                </View>


              </View>

            </View>
            {/* Bio Section */}
            <View className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <Text className="text-slate-600 text-sm leading-5">
                {bidData.bio}
              </Text>
            </View>
          </View>

          {/* Bid Details Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">Bid Details</Text>

            <View className="flex-row justify-between mb-6">
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Bid Amount</Text>
                <Text className="text-green-600 text-2xl font-bold">{bidData.bidAmount}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Timeline</Text>
                <Text className="text-slate-800 text-xl font-bold">{bidData.timeline}</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Success Rate</Text>
                <Text className="text-slate-800 text-lg font-bold">{bidData.successRate}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Member Since</Text>
                <Text className="text-slate-800 text-lg font-bold">{bidData.memberSince}</Text>
              </View>
            </View>
          </View>

          {/* Proposal Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">Proposal</Text>
            <Text className="text-slate-700 leading-6 text-base">
              {bidData.proposal}
            </Text>
          </View>

          {/* Skills Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">Skills & Expertise</Text>
            <View className="flex-row flex-wrap">
              {bidData.skills.map((skill, index) => (
                <View key={index} className="bg-blue-50 px-3 py-2 rounded-full mr-2 mb-2 border border-blue-100">
                  <Text className="text-blue-700 text-sm font-semibold">{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Portfolio Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">Portfolio</Text>
            <View className="flex-row items-center">
              <Ionicons name="link" size={20} color="#6366f1" />
              <Text className="text-blue-600 text-base font-semibold ml-2">
                {bidData.portfolio}
              </Text>
            </View>
          </View>

          {/* Spacer for buttons */}
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Action Buttons - Smaller and Better */}
      <View className="bg-white border-t border-slate-200 px-4 py-3">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleRejectBid}
            className={`flex-1 py-3 rounded-xl items-center justify-center flex-row space-x-2 ${bidStatus === 'rejected'
                ? 'bg-red-50 border border-red-200'
                : 'bg-white border border-slate-300'
              }`}
            disabled={bidStatus === 'accepted'}
          >
            <Ionicons
              name={bidStatus === 'rejected' ? 'close-circle' : 'close-outline'}
              size={18}
              color={bidStatus === 'rejected' ? '#DC2626' : '#64748B'}
            />
            <Text className={`text-sm font-semibold ${bidStatus === 'rejected' ? 'text-red-700' : 'text-slate-600'
              }`}>
              {bidStatus === 'rejected' ? 'Rejected' : 'Reject'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAcceptBid}
            className={`flex-1 py-3 rounded-xl items-center justify-center flex-row space-x-2 ${bidStatus === 'accepted'
                ? 'bg-green-600'
                : 'bg-green-500'
              }`}
            disabled={bidStatus === 'rejected'}
          >
            <Ionicons
              name={bidStatus === 'accepted' ? 'checkmark-done' : 'checkmark'}
              size={18}
              color="#FFFFFF"
            />
            <Text className="text-white font-semibold text-sm">
              {bidStatus === 'accepted' ? 'Accepted' : 'Accept'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BidDetailScreen;