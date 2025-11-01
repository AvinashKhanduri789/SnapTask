import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TasksHeader from "../../../components/poster/TaskPageComponents/TasksHeader";
import TabSwitcher from "../../../components/poster/TaskPageComponents/TabSwitcher";
import PendingTasks from "../../../components/poster/TaskPageComponents/PendingTasks";
import CompletedTasks from "../../../components/poster/TaskPageComponents/CompletedTasks";
import NewTaskBottomSheet from "../../../components/poster/TaskPageComponents/NewTaskBottomSheet";
import StatusModal from "../../../components/common/StatusModal";
import { api } from "../../../util/requester";
import { useApi } from "../../../util/useApi";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusData, setStatusData] = useState({
    title: "",
    message: "",
    status: 200,
  });
  const [taskData, setTaskData] = useState({
    active: [],
    pending: [],
    completed: [],
  });
  const [activeTaskData, setActiveTaskData] = useState([]);

  const { request, isLoading } = useApi();

  // 🔹 Fetch tasks on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await request(api.get("/poster/tasks/summary"));
        if (result.ok && result.data) {
          setTaskData(result.data);
        }
      } catch (error) {
        console.error("Task fetch error:", error);
        Alert.alert("Error", error.detail || "Something went wrong.");
      }
    };

    loadData();
  }, []);

  // 🔹 Combine active + pending safely
  useEffect(() => {
    if (taskData) {
      setActiveTaskData([
        ...(taskData.active || []),
        ...(taskData.pending || []),
      ]);
    }
  }, [taskData]);

  // 🔹 Tab change handler
  const handleTabChange = (tabId) => {
    if (tabId === "new") {
      setShowBottomSheet(true);
    } else {
      setActiveTab(tabId);
    }
  };


  // 🔹 Close bottom sheet
  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false);
    setActiveTab("pending");
  };

  // 🔹 Handle new task created
  const handleTaskCreated = (status) => {
    setShowBottomSheet(false);
    setStatusData(status);
    setStatusVisible(true);
    setActiveTab("pending");
  };

  // 🔹 Render main content based on tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading tasks...</Text>
        </View>
      );
    }

    if (!taskData) {
      return (
        <View style={styles.loadingContainer}>
          <Text>No data available</Text>
        </View>
      );
    }

    switch (activeTab) {
      case "pending":
        return <PendingTasks data={activeTaskData} />;
      case "completed":
        return <CompletedTasks data={taskData.completed || []} />;
      default:
        return <PendingTasks data={activeTaskData} />;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TasksHeader />
        <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />
        <View style={styles.content}>{renderContent()}</View>
      </SafeAreaView>

      {/* New Task Form Sheet */}
      <NewTaskBottomSheet
        visible={showBottomSheet}
        onClose={handleCloseBottomSheet}
        onTaskCreated={handleTaskCreated}
      />

      {/* Status Modal */}
      <StatusModal
        visible={statusVisible}
        onClose={() => setStatusVisible(false)}
        status={statusData.status}
        title={statusData.title}
        message={statusData.message}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Tasks;
