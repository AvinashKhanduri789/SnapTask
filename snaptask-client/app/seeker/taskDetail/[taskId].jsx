// app/seeker/task/[taskId].jsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import CompletionRequestSheet from "../../../components/seeker/task/CompletionRequestSheet";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../util/requester";
import { useApi } from "../../../util/useApi";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scale = (size) => {
  const baseWidth = 375;
  return (screenWidth / baseWidth) * size;
};

const scaleFont = (size) => {
  const baseWidth = 375;
  const newSize = (screenWidth / baseWidth) * size;
  return Math.round(newSize);
};

const verticalScale = (size) => {
  const baseHeight = 667;
  return (screenHeight / baseHeight) * size;
};

const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const TaskDetailScreen = () => {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const [taskData, setTaskData] = useState(null);
  const { request, isLoading, error } = useApi();
  const [showCompletionSheet, setShowCompletionSheet] = useState(false);


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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading task details</Text>
          <TouchableOpacity
            onPress={fetchTaskDetails}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!taskData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No task data found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* SafeAreaView for top only */}
      <SafeAreaView style={styles.safeAreaTop} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={scaleFont(22)} color="#475569" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {taskData.title}
          </Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </SafeAreaView>

      {/* Main content with bottom safe area */}
      <SafeAreaView style={styles.safeAreaMain} edges={['left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Task Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Task Summary
            </Text>

            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={scaleFont(18)} color="#3B82F6" />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Budget: </Text>
                {taskData.budget}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={scaleFont(18)} color="#3B82F6" />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Location: </Text>
                {taskData.location}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={scaleFont(18)} color="#3B82F6" />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Deadline: </Text>
                {taskData.deadline}
              </Text>
            </View>
          </View>

          {/* Applicants + Status */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, styles.statCardLeft]}>
              <Text style={styles.statLabel}>
                Applicants
              </Text>
              <Text style={styles.statValue}>
                {taskData.applicants}
              </Text>
            </View>
            <View style={[styles.statCard, styles.statCardRight]}>
              <Text style={styles.statLabel}>
                Status
              </Text>
              <Text style={[styles.statValue, styles.statusText]}>
                {taskData.status}
              </Text>
            </View>
          </View>

          {/* Task Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Task Description
            </Text>
            <Text style={styles.descriptionText}>
              {taskData.description}
            </Text>
          </View>

          {/* Project Type */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Project Type
            </Text>
            <Text style={styles.projectTypeText}>
              {taskData.projectType}
            </Text>
          </View>

          {/* Required Skills */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Required Skills
            </Text>
            <View style={styles.skillsContainer}>
              {taskData.skills.map((skill, index) => (
                <View
                  key={index}
                  style={styles.skillTag}
                >
                  <Text style={styles.skillText}>
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* About the Poster */}
          <View style={styles.posterCard}>
            <Text style={styles.cardTitle}>
              About the Poster
            </Text>

            {/* Poster Header */}
            <View style={styles.posterHeader}>
              <View style={styles.posterAvatar}>
                <Text style={styles.posterInitial}>
                  {taskData.postedBy.name.charAt(0)}
                </Text>
              </View>

              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>
                  {taskData.postedBy.name}
                </Text>
                <Text style={styles.posterRole}>
                  {taskData.postedBy.role}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={scaleFont(18)} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {taskData.postedBy.rating}{" "}
                <Text style={styles.reviewsText}>
                  ({taskData.postedBy.reviews} reviews)
                </Text>
              </Text>
            </View>

            {/* Poster Stats */}
            <View style={styles.posterStats}>
              <View style={styles.posterStat}>
                <Ionicons name="checkmark-done-circle-outline" size={scaleFont(20)} color="#10B981" />
                <Text style={styles.posterStatText}>
                  {taskData.postedBy.completedTasks} Tasks Completed
                </Text>
              </View>

              <View style={styles.posterStat}>
                <Ionicons name="time-outline" size={scaleFont(20)} color="#3B82F6" />
                <Text style={styles.posterStatText}>
                  {taskData.postedBy.responseTime}
                </Text>
              </View>

              <View style={styles.posterStat}>
                <Ionicons name="calendar-outline" size={scaleFont(20)} color="#6366F1" />
                <Text style={styles.posterStatText}>
                  Member since {taskData.postedBy.memberSince}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
       <SafeAreaView style={styles.safeAreaBottom} edges={['bottom']}>
    <View style={styles.bottomContainer}>

  
  {taskData.status?.toLowerCase() === "completed" ? null : (

    taskData.assignedToMe ? (
      
      <TouchableOpacity
        onPress={() => setShowCompletionSheet(true)}
        activeOpacity={0.85}
        style={[styles.bottomButton, styles.activeButton]}
      >
        <Ionicons name="checkmark-done" size={scaleFont(18)} color="#fff" />
        <Text style={styles.bottomButtonText}>Mark as Completed</Text>
      </TouchableOpacity>
    ) : !taskData.alredyMadebid ? (
      // 🔵 No bid yet → show bid button
      <TouchableOpacity
        onPress={() => router.push(`/seeker/biddigrequest/${taskData.id}`)}
        activeOpacity={0.85}
        style={[styles.bottomButton, styles.activeButton]}
      >
        <Ionicons name="send" size={scaleFont(18)} color="#fff" />
        <Text style={styles.bottomButtonText}>Make Bidding Request</Text>
      </TouchableOpacity>
    ) : null // 🟡 Bid already submitted → show nothing
  )}

</View>


  {/* Completion Request Modal */}
  <Modal
    animationType="slide"
    transparent={true}
    visible={showCompletionSheet}
    onRequestClose={() => setShowCompletionSheet(false)}
  >
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <CompletionRequestSheet
        taskId={taskData.id}
        onClose={() => setShowCompletionSheet(false)}
      />
    </View>
  </Modal>
</SafeAreaView>




    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeAreaTop: {
    backgroundColor: 'white',
  },
  safeAreaMain: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeAreaBottom: {
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: scaleFont(16),
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    fontSize: scaleFont(16),
    color: '#ef4444',
    marginBottom: verticalScale(12),
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: scaleFont(14),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  headerTitle: {
    flex: 1,
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: '#1e293b',
  },
  headerRightPlaceholder: {
    width: moderateScale(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(20),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginTop: verticalScale(16),
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: verticalScale(12),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  infoText: {
    fontSize: scaleFont(14),
    color: '#64748b',
    marginLeft: moderateScale(8),
  },
  infoLabel: {
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(16),
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  statCardLeft: {
    marginRight: moderateScale(8),
  },
  statCardRight: {
    marginLeft: moderateScale(8),
  },
  statLabel: {
    fontSize: scaleFont(14),
    color: '#64748b',
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  statValue: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusText: {
    fontSize: scaleFont(16),
    color: '#10b981',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: scaleFont(14),
    color: '#64748b',
    lineHeight: scaleFont(20),
  },
  projectTypeText: {
    fontSize: scaleFont(16),
    color: '#3b82f6',
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(8),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  skillText: {
    fontSize: scaleFont(12),
    color: '#1d4ed8',
    fontWeight: '500',
  },
  posterCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  posterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  posterAvatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(16),
  },
  posterInitial: {
    fontSize: scaleFont(20),
    color: '#1d4ed8',
    fontWeight: 'bold',
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    color: '#1e293b',
  },
  posterRole: {
    fontSize: scaleFont(14),
    color: '#64748b',
    marginTop: verticalScale(4),
    lineHeight: scaleFont(20),
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginVertical: verticalScale(16),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  ratingText: {
    fontSize: scaleFont(14),
    color: '#374151',
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
  reviewsText: {
    color: '#64748b',
    fontWeight: 'normal',
  },
  posterStats: {
    gap: verticalScale(12),
  },
  posterStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterStatText: {
    fontSize: scaleFont(14),
    color: '#64748b',
    marginLeft: moderateScale(12),
    lineHeight: scaleFont(20),
  },
  bottomContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  activeButton: {
    backgroundColor: '#2563eb',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  bottomButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: scaleFont(16),
  },
});

export default TaskDetailScreen;