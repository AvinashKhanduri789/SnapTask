import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../../util/requester"; // ✅ fixed import
import { useApi } from "../../../util/useApi";

import ActionButtons from "../../../components/poster/Task/ActionButtons";
import AssignedBidSection from "../../../components/poster/Task/AssignedBidSection";
import BidsSection from "../../../components/poster/Task/BidsSection";
import CompletionRequestSection from "../../../components/poster/Task/CompletionRequestSection";
import StatusTimeline from "../../../components/poster/Task/StatusTimeline";
import TaskDescription from "../../../components/poster/Task/TaskDescription";
import TaskHeader from "../../../components/poster/Task/TaskHeader";
import TaskMetaInfo from "../../../components/poster/Task/TaskMetaInfo";
import TaskOverview from "../../../components/poster/Task/TaskOverview";

const TaskDetail = () => {
  const { taskId } = useLocalSearchParams();
  const { request, data, isLoading, error } = useApi();
  const [taskData, setTaskData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (taskId) fetchTaskDetail();
  }, [taskId, refreshTrigger]);

  const fetchTaskDetail = async () => {
    const result = await request(api.get(`/poster/task/${taskId}`));
    if (result.ok) setTaskData(result.data);
    else console.log("❌ Error fetching task:", result.error);
  };

  const handleTaskUpdate = () => setRefreshTrigger((prev) => prev + 1);

  // --- Loading State ---
  if (isLoading)
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading task details...</Text>
      </SafeAreaView>
    );

  // --- Error State ---
  if (error)
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error.detail || "Failed to load task details."}</Text>
      </SafeAreaView>
    );

  // --- No Data ---
  if (!taskData)
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No task data found.</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <TaskHeader taskTitle={taskData.title} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <TaskOverview
            title={taskData.title}
            status={taskData.status}
            category={taskData.category}
            postedOn={taskData.postedOn}
            deadline={taskData.deadline}
          />

          <StatusTimeline
            status={taskData.status}
            postedOn={taskData.postedOn}
            deadline={taskData.deadline}
          />

          <TaskDescription description={taskData.description} />

          <TaskMetaInfo
            budget={taskData.budget}
            duration={taskData.duration || "N/A"}
            mode={taskData.mode}
            applicants={taskData.bidsCount || 0}
          />

          {taskData.assignedBidInfo ? (
            <AssignedBidSection info={taskData.assignedBidInfo} />
          ) : (
            <BidsSection bids={taskData.bidsList || []} />
          )}

          {/* ✅ Show only if task not completed */}
          {taskData.status !== "COMPLETED" && taskData.taskCompletionRequest && (
            <CompletionRequestSection
              completion={taskData.taskCompletionRequest}
              taskId={taskId}
              onApproved={handleTaskUpdate}
            />
          )}
        </View>
      </ScrollView>

      <ActionButtons
        taskId={taskData.id}
        status={taskData.status}
        taskData={taskData}
        onTaskUpdate={handleTaskUpdate}
      />
    </SafeAreaView>
  );
};

export default TaskDetail;
