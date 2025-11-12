import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Text, StatusBar, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const { request, isLoading } = useApi();

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  // Calculate task counts
  const pendingCount = taskData.pending?.length || 0;
  const activeCount = taskData.active?.length || 0;
  const completedCount = taskData.completed?.length || 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />
      <LinearGradient
        colors={["#3B82F6", "#3B82F6"]}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContent}>
            {/* Header Top Row */}
            <View style={styles.headerTopRow}>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <Text style={styles.headerTitle}>Tasks</Text>
                <Text style={styles.headerSubtitle}>Task Management</Text>
              </Animated.View>

              {/* 🔹 Refresh Button (Silent Refresh) */}
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={async () => {
                  try {
                    const result = await request(api.get("/poster/tasks/summary"));
                    if (result.ok && result.data) {
                      setTaskData(result.data);
                    }
                  } catch (error) {
                    Alert.alert("Error", "Failed to refresh data");
                  }
                }}
              >
                <Ionicons name="refresh-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Task Stats */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={[styles.statItem, styles.pendingStat]}>
                <View style={[styles.statDot, { backgroundColor: "#F59E0B" }]} />
                <Text style={styles.statText}>{pendingCount} Pending</Text>
              </View>
              <View style={[styles.statItem, styles.activeStat]}>
                <View style={[styles.statDot, { backgroundColor: "#3B82F6" }]} />
                <Text style={styles.statText}>{activeCount} In Progress</Text>
              </View>
              <View style={[styles.statItem, styles.completedStat]}>
                <View style={[styles.statDot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.statText}>{completedCount} Completed</Text>
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>



      {/* Tab Switcher */}
      <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    borderBottomLeftRadius: 54,
    borderBottomRightRadius: 54,
    marginBottom: 2,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  refreshButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 6,
  },


});

export default Tasks;