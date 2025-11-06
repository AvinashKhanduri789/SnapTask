// app/seeker/task/[taskId].jsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import {api} from "../../../util/requester";
import { useApi } from "../../../util/useApi";

const TaskDetailScreen = () => {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const [taskData, setTaskData] = useState(null);
  const { request, isLoading, error } = useApi();

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const response = await request(api.get(`/seeker/tasks/${taskId}`));
      
      if (response.ok) {
        setTaskData(response.data);
      } else {
        console.error("Failed to fetch task details:", response.error);
      }
    } catch (err) {
      console.error("Error fetching task details:", err);
    }
  };

  useEffect(() => {
    console.log("task data in task detail screen is--->", taskData)
  }, [taskData]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-slate-50">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-slate-50">
        <Text className="text-red-500 mb-4">Error loading task details</Text>
        <TouchableOpacity 
          onPress={fetchTaskDetails}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!taskData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-slate-50">
        <Text>No task data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-slate-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
        >
          <Ionicons name="chevron-back" size={22} color="#475569" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-slate-800 flex-1">
          {taskData.title}
        </Text>
        <Ionicons name="bookmark-outline" size={22} color="#64748b" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Task Summary */}
        <View className="bg-white rounded-2xl p-5 mt-5 shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Task Summary
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="cash-outline" size={18} color="#3B82F6" />
            <Text className="text-slate-600 ml-2">
              <Text className="font-semibold">Budget: </Text>
              {taskData.budget}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={18} color="#3B82F6" />
            <Text className="text-slate-600 ml-2">
              <Text className="font-semibold">Location: </Text>
              {taskData.location}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
            <Text className="text-slate-600 ml-2">
              <Text className="font-semibold">Deadline: </Text>
              {taskData.deadline}
            </Text>
          </View>
        </View>

        {/* Applicants + Status */}
        <View className="flex-row mt-4">
          <View className="flex-1 bg-white rounded-2xl p-4 mr-2 border border-slate-100 shadow-sm items-center">
            <Text className="text-slate-500 text-sm font-medium mb-1">
              Applicants
            </Text>
            <Text className="text-xl font-bold text-slate-800">
              {taskData.applicants}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 ml-2 border border-slate-100 shadow-sm items-center">
            <Text className="text-slate-500 text-sm font-medium mb-1">
              Status
            </Text>
            <Text className="text-lg font-semibold text-green-600">
              {taskData.status}
            </Text>
          </View>
        </View>

        {/* Task Description */}
        <View className="bg-white rounded-2xl p-5 mt-4 border border-slate-100 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-2">
            Task Description
          </Text>
          <Text className="text-slate-600 leading-relaxed text-base">
            {taskData.description}
          </Text>
        </View>

        {/* Project Type */}
        <View className="bg-white rounded-2xl p-5 mt-4 border border-slate-100 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-1">
            Project Type
          </Text>
          <Text className="text-blue-600 font-medium">
            {taskData.projectType}
          </Text>
        </View>

        {/* Required Skills */}
        <View className="bg-white rounded-2xl p-5 mt-4 border border-slate-100 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Required Skills
          </Text>
          <View className="flex-row flex-wrap">
            {taskData.skills.map((skill, index) => (
              <View
                key={index}
                className="bg-blue-50 px-3 py-2 rounded-full mr-2 mb-2 border border-blue-100"
              >
                <Text className="text-blue-700 font-medium text-sm">
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* About the Poster */}
        <View className="bg-white rounded-2xl p-6 mt-6 mb-12 border border-slate-100 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-5">
            About the Poster
          </Text>

          {/* Poster Header */}
          <View className="flex-row items-center mb-5">
            <View className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center mr-4">
              <Text className="text-blue-700 text-lg font-bold">
                {taskData.postedBy.name.charAt(0)}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-800">
                {taskData.postedBy.name}
              </Text>
              <Text className="text-slate-500 mt-1 leading-relaxed">
                {taskData.postedBy.role}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="border-t border-slate-200 my-5" />

          {/* Rating */}
          <View className="flex-row items-center mb-5">
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text className="text-slate-700 font-semibold ml-2">
              {taskData.postedBy.rating}{" "}
              <Text className="text-slate-500 font-normal">
                ({taskData.postedBy.reviews} reviews)
              </Text>
            </Text>
          </View>

          {/* Poster Stats */}
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-done-circle-outline" size={20} color="#10B981" />
              <Text className="text-slate-600 ml-3 leading-relaxed">
                {taskData.postedBy.completedTasks} Tasks Completed
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#3B82F6" />
              <Text className="text-slate-600 ml-3 leading-relaxed">
                {taskData.postedBy.responseTime}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#6366F1" />
              <Text className="text-slate-600 ml-3 leading-relaxed">
                Member since {taskData.postedBy.memberSince}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button - Conditionally Rendered */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-5 py-4">
        {taskData.alredyMadebid ? (
          // Already made bid - Show disabled state
          <View className="rounded-xl overflow-hidden">
            <View className="py-3 items-center justify-center rounded-xl flex-row space-x-2 bg-gray-400">
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text className="text-white font-semibold text-base">
                Bid Already Submitted
              </Text>
            </View>
          </View>
        ) : (
          // No bid made yet - Show active button
          <TouchableOpacity
            onPress={() => router.push(`/seeker/biddigrequest/${taskData.id}`)}
            activeOpacity={0.85}
            className="rounded-xl overflow-hidden"
          >
            <View
              style={{ backgroundColor: "#2563EB" }}
              className="py-3 items-center justify-center rounded-xl flex-row space-x-2"
            >
              <Ionicons name="send" size={18} color="#fff" />
              <Text className="text-white font-semibold text-base">
                Make Bidding Request
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TaskDetailScreen;