import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TaskHeader from '../../../components/poster/Task/TaskHeader';
import TaskOverview from '../../../components/poster/Task/TaskOverview';
import TaskDescription from '../../../components/poster/Task/TaskDescription';
import TaskMetaInfo from '../../../components/poster/Task/TaskMetaInfo';
import BidsSection from '../../../components/poster/Task/BidsSection';
import ActionButtons from '../../../components/poster/Task/ActionButtons';
import StatusTimeline from '../../../components/poster/Task/StatusTimeline';
import {api} from "../../../util/requester";
import {useApi} from "../../../util/useApi";
import { useState } from 'react';

const TaskDetail = () => {
  const { taskId } = useLocalSearchParams();
  const router = useRouter();
  const { request, data, isLoading, error } = useApi();
  const [taskData, setTaskData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail();
    }
  }, [taskId, refreshTrigger]); // Add refreshTrigger as dependency

  const fetchTaskDetail = async () => {
    const result = await request(api.get(`/poster/task/${taskId}`));
    if (result.ok) {
      setTaskData(result.data);
    } else {
      console.log("❌ Error fetching task:", result.error);
    }
  };

  // Function to trigger refresh
  const handleTaskUpdate = () => {
    console.log("🔄 Refreshing task data...");
    setRefreshTrigger(prev => prev + 1); // This will trigger useEffect to refetch
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading task details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error.detail || "Failed to load task details."}</Text>
      </SafeAreaView>
    );
  }

  // ⏳ still loading or no data
  if (!taskData) return null;

  // ✅ taskData is now coming from backend
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <TaskHeader taskTitle={taskData.title} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          {/* Task Overview */}
          <TaskOverview
            title={taskData.title}
            status={taskData.status}
            category={taskData.category}
            postedOn={taskData.postedOn}
            deadline={taskData.deadline}
          />

          {/* Status Timeline */}
          <StatusTimeline
            status={taskData.status}
            postedOn={taskData.postedOn}
            deadline={taskData.deadline}
          />

          {/* Task Description */}
          <TaskDescription description={taskData.description} />

          {/* Task Meta Info */}
          <TaskMetaInfo
            budget={taskData.budget}
            duration={taskData.duration || "N/A"}
            mode={taskData.mode}
            applicants={taskData.bidsCount || 0}
          />

          {/* Applicants Section */}
          <BidsSection
            bids={taskData.bidsList || []}
            onViewBid={(bid) => {
              console.log("Viewing bid:", bid);
              router.push(`/poster/seekerProfile/${bid.bidId}`);
            }}
          />
        </View>
      </ScrollView>

      {/* Action Buttons - Pass the refresh function */}
      <ActionButtons 
        taskId={taskData.id} 
        status={taskData.status} 
        taskData={taskData}
        onTaskUpdate={handleTaskUpdate} // Pass the refresh function
      />
    </SafeAreaView>
  );
};

export default TaskDetail;