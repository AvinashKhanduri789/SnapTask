// app/seeker/task/[taskId].jsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const TaskDetailScreen = () => {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const [taskData, setTaskData] = useState(null);
  console.log('task id in Task Detail page is ', taskId);

  useEffect(() => {
    const fetchTask = async () => {
      const mockTask = {
        id: taskId,
        title: 'Mobile App UI/UX Design',
        description:
          'Create a modern and intuitive interface for a fitness tracking application with dark mode support.',
        budget: '₹850',
        location: 'Remote',
        deadline: '2 days',
        applicants: '12 applicants',
        skills: ['UI/UX', 'Figma', 'Mobile Design', 'Branding'],
        status: 'new',
        projectType: 'Freelance',
        postedBy: {
          name: 'John Doe',
          role: 'Project Manager',
          experience: '5 years',
          rating: 4.7,
          completedTasks: 35,
          responseTime: 'Within 1 hour',
          memberSince: 'Jan 2022',
        },
      };
      setTaskData(mockTask);
    };
    fetchTask();
  }, [taskId]);

  if (!taskData)
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  const getStatusColor = () => {
    switch (taskData.status) {
      case 'new':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'completed':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  // const handleMakeBid = () => {
  //   Alert.alert('Bidding Request', 'You clicked Make Bidding Request for this task.');
  // };

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
        <Text className="text-xl font-bold text-slate-800">Task Details</Text>
        <Text className="text-slate-500 text-sm">View task and poster details</Text>
      </View>
      <View
        style={{ backgroundColor: `${getStatusColor()}15` }}
        className="px-3 py-1 rounded-full"
      >
        <Text style={{ color: getStatusColor() }} className="text-xs font-bold">
          {taskData.status.toUpperCase()}
        </Text>
      </View>
    </View>
  </View>

  <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
    <View className="p-6 space-y-6">
      {/* Poster Info Card */}
      <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
        <View className="flex-row items-center">
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-16 h-16 rounded-full items-center justify-center mr-4 shadow-sm overflow-hidden"
          >
            <Text className="text-white text-2xl font-bold">
              {taskData.postedBy.name.charAt(0)}
            </Text>
          </LinearGradient>

          <View className="flex-1">
            <Text className="text-2xl font-bold text-slate-800 mb-1">
              {taskData.postedBy.name}
            </Text>
            <Text className="text-slate-500 text-base mb-3">
              {taskData.postedBy.role} | {taskData.postedBy.experience} experience
            </Text>

            <View className="flex-row items-center space-x-6">
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text className="text-slate-700 text-sm font-semibold ml-1">
                  {taskData.postedBy.rating}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-done" size={16} color="#10B981" />
                <Text className="text-slate-700 text-sm font-semibold ml-1">
                  {taskData.postedBy.completedTasks} tasks
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time" size={16} color="#3B82F6" />
                <Text className="text-slate-700 text-sm font-semibold ml-1">
                  {taskData.postedBy.responseTime}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Task Info Card */}
      <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
        <Text className="text-lg font-bold text-slate-800 mb-4">Task Info</Text>

        <Text className="text-slate-500 text-sm font-semibold mb-1">Title</Text>
        <Text className="text-slate-800 text-xl font-bold mb-3">{taskData.title}</Text>

        <Text className="text-slate-500 text-sm font-semibold mb-1">Description</Text>
        <Text className="text-slate-700 text-base mb-4">{taskData.description}</Text>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 flex-row items-center">
            <Ionicons name="cash-outline" size={18} color="#6B7280" />
            <Text className="text-slate-700 text-sm ml-2">{taskData.budget}</Text>
          </View>
          <View className="flex-1 flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
            <Text className="text-slate-700 text-sm ml-2">{taskData.deadline}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 flex-row items-center">
            <Ionicons name="location-outline" size={18} color="#6B7280" />
            <Text className="text-slate-700 text-sm ml-2">{taskData.location}</Text>
          </View>
          <View className="flex-1 flex-row items-center">
            <Ionicons name="people-outline" size={18} color="#6B7280" />
            <Text className="text-slate-700 text-sm ml-2">{taskData.applicants}</Text>
          </View>
        </View>

        <Text className="text-slate-500 text-sm font-semibold mb-2">Skills Required</Text>
        <View className="flex-row flex-wrap">
          {taskData.skills.map((skill, index) => (
            <View
              key={index}
              className="bg-blue-50 px-3 py-2 rounded-full mr-2 mb-2 border border-blue-100"
            >
              <Text className="text-blue-700 text-sm font-semibold">{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Make Bidding Button */}
      <View className="bg-white border-t border-slate-200 px-4 py-3">
        <TouchableOpacity
          onPress={()=>router.push(`/seeker/biddigrequest/${taskData.id}`)}
          className="flex-1 py-3 rounded-xl items-center justify-center flex-row space-x-2 overflow-hidden"
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 rounded-xl"
          />
          <Ionicons name="send" size={18} color="#FFF" />
          <Text className="text-white text-sm font-semibold">Make Bidding Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
</SafeAreaView>
  );
};

export default TaskDetailScreen;
