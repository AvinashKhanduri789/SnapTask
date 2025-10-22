// app/seeker/bid/[taskId].jsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MakeBidScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [message, setMessage] = useState('');
  const [deadline, setDeadline] = useState('');
  const [canMeetDeadline, setCanMeetDeadline] = useState(false);
  const [links, setLinks] = useState('');

  const handleSubmit = () => {
    console.log({ id, message, deadline, canMeetDeadline, links });
    router.push(`/seeker/taskDetail/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-5 flex-row items-center"
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-bold">Make Bidding Request</Text>
          <Text className="text-white/80 text-sm">Submit your proposal for this task</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 p-6 space-y-6">
        {/* Task Summary */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-1">Task #{id}</Text>
          <Text className="text-slate-500 text-sm mb-2">Mobile App UI/UX Design</Text>
          <View className="flex-row justify-between">
            <Text className="text-slate-700 text-sm">💰 ₹850</Text>
            <Text className="text-slate-700 text-sm">🕒 2 days</Text>
          </View>
        </View>

        {/* Message Field */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-slate-700 text-base font-semibold mb-2">Message to Poster</Text>
          <TextInput
            className="border border-slate-200 rounded-xl p-3 text-slate-700 h-28"
            multiline
            placeholder="Explain why you are a good fit for this task..."
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {/* Deadline Field */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-slate-700 text-base font-semibold mb-2">Estimated Completion Time</Text>
          <TextInput
            className="border border-slate-200 rounded-xl p-3 text-slate-700"
            placeholder="e.g., 3 days, 1 week"
            value={deadline}
            onChangeText={setDeadline}
          />
        </View>

        {/* Toggle */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex-row justify-between items-center">
          <Text className="text-slate-700 text-base font-semibold">Can complete within given deadline?</Text>
          <Switch value={canMeetDeadline} onValueChange={setCanMeetDeadline} />
        </View>

        {/* Links Field */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-slate-700 text-base font-semibold mb-2">Links to Similar Work</Text>
          <TextInput
            className="border border-slate-200 rounded-xl p-3 text-slate-700"
            placeholder="Add portfolio or GitHub links..."
            value={links}
            onChangeText={setLinks}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="py-4 rounded-2xl items-center justify-center overflow-hidden"
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 rounded-2xl"
          />
          <Text className="text-white font-semibold text-base">Send Bidding Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MakeBidScreen;
