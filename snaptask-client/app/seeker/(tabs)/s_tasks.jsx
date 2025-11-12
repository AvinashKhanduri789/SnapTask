import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StatusBar,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import TabButton from '../../../components/seeker/task/TabButton';
import TaskCard from '../../../components/seeker/task/TaskCard';
import FloatingActionButton from '../../../components/seeker/task/FloatingActionButton';
import EmptyState from '../../../components/seeker/task/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApi } from '../../../util/useApi';
import { api } from '../../../util/requester';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SeekerTasksScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('new');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  const { request, data, isLoading, error } = useApi();

  // Separate states for different task types
  const [newTaskData, setNewTaskData] = useState([]);
  const [pendingTaskData, setPendingTaskData] = useState([]);
  const [completedTaskData, setCompletedTaskData] = useState([]);

  // Separate loading and error states for each tab
  const [newTasksLoading, setNewTasksLoading] = useState(false);
  const [newTasksError, setNewTasksError] = useState(null);
  const [pendingTasksLoading, setPendingTasksLoading] = useState(false);
  const [pendingTasksError, setPendingTasksError] = useState(null);
  const [completedTasksLoading, setCompletedTasksLoading] = useState(false);
  const [completedTasksError, setCompletedTasksError] = useState(null);

  const categories = [
    { name: 'Design & Creative', icon: 'color-palette' },
    { name: 'Graphic Design', icon: 'color-palette' },
    { name: 'Development & IT', icon: 'code' },
    { name: 'Writing & Translation', icon: 'create' },
    { name: 'Marketing', icon: 'megaphone' },
    { name: 'Administrative', icon: 'document-text' },
    { name: 'Customer Service', icon: 'headset' },
    { name: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const TABS = [
    { id: 'new', label: 'New Tasks' },
    { id: 'pending', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  // Fetch tasks when component mounts or category/tab changes
  useEffect(() => {
    if (activeTab === 'new') {
      fetchNewTasks();
    } else if (activeTab === 'pending') {
      fetchPendingTasks();
    } else if (activeTab === 'completed') {
      fetchCompletedTasks();
    }
  }, [activeTab, selectedCategory]);

  // Function to fetch new tasks based on selected category
  const fetchNewTasks = async () => {
    setNewTasksLoading(true);
    setNewTasksError(null);

    let categoryParam = 'Development & IT';

    if (selectedCategory) {
      categoryParam = selectedCategory.name === 'Other' ? customCategory : selectedCategory.name;
    }

    const endpoint = `/seeker/tasks/summery${categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ''}`;

    const response = await request(api.get(endpoint));

    if (response.ok) {
      console.log('New tasks fetched successfully:', response.data);
      setNewTaskData(response.data || []);
    } else {
      setNewTasksError(response.error?.detail || 'Failed to fetch new tasks');
      setNewTaskData([]);
    }
    setNewTasksLoading(false);
  };

  // Function to fetch pending tasks
  const fetchPendingTasks = async () => {
    setPendingTasksLoading(true);
    setPendingTasksError(null);

    const response = await request(api.get('/seeker/tasks/assigned'));

    if (response.ok) {
      console.log('Pending tasks fetched successfully:', response.data);
      setPendingTaskData(response.data || []);
    } else {
      setPendingTasksError(response.error?.detail || 'Failed to fetch pending tasks');
      setPendingTaskData([]);
    }
    setPendingTasksLoading(false);
  };

  // Function to fetch completed tasks
  const fetchCompletedTasks = async () => {
    setCompletedTasksLoading(true);
    setCompletedTasksError(null);

    const response = await request(api.get('/seeker/tasks/completed'));

    if (response.ok) {
      console.log('Completed tasks fetched successfully:', response.data);
      setCompletedTaskData(response.data || []);
    } else {
      setCompletedTasksError(response.error?.detail || 'Failed to fetch completed tasks');
      setCompletedTaskData([]);
    }
    setCompletedTasksLoading(false);
  };

  // Function to get current tasks based on active tab
  const getCurrentTasks = () => {
    switch (activeTab) {
      case 'new':
        return newTaskData;
      case 'pending':
        return pendingTaskData;
      case 'completed':
        return completedTaskData;
      default:
        return newTaskData;
    }
  };

  // Function to get loading state based on active tab
  const getCurrentLoadingState = () => {
    switch (activeTab) {
      case 'new':
        return newTasksLoading;
      case 'pending':
        return pendingTasksLoading;
      case 'completed':
        return completedTasksLoading;
      default:
        return false;
    }
  };

  // Function to get error state based on active tab
  const getCurrentErrorState = () => {
    switch (activeTab) {
      case 'new':
        return newTasksError;
      case 'pending':
        return pendingTasksError;
      case 'completed':
        return completedTasksError;
      default:
        return null;
    }
  };

  // Function to check if we have empty data (no tasks) vs error
  const hasNoTasks = () => {
    return !getCurrentLoadingState() && !getCurrentErrorState() && getCurrentTasks().length === 0;
  };

  const handleCategorySelect = async (category) => {
    if (category.name === 'Other') {
      setSelectedCategory(category);
      setCustomCategory('');
    } else {
      setSelectedCategory(category);
      setShowCategoryModal(false);
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      setSelectedCategory({ name: customCategory, icon: 'ellipsis-horizontal' });
      setShowCategoryModal(false);
    }
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    setCustomCategory('');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Function to retry fetching based on current tab
  const handleRetry = () => {
    if (activeTab === 'new') {
      fetchNewTasks();
    } else if (activeTab === 'pending') {
      fetchPendingTasks();
    } else if (activeTab === 'completed') {
      fetchCompletedTasks();
    }
  };

  const currentLoading = getCurrentLoadingState();
  const currentError = getCurrentErrorState();
  const currentTasks = getCurrentTasks();
  const showEmptyState = hasNoTasks();

  return (
    <View style={styles.container}>
      {/* StatusBar with blue background */}
      <StatusBar translucent backgroundColor="#3B82F6" barStyle="light-content" />
      
      {/* Main content */}
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.content}>
          {/* Header built directly into the component */}
          <LinearGradient
            colors={['#3B82F6', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerContainer}
          >
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Your Tasks</Text>
                <Text style={styles.headerSubtitle}>
                  Find new tasks or manage your current ones
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
              {TABS.map((tab) => (
                <TabButton
                  key={tab.id}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onPress={() => handleTabChange(tab.id)}
                />
              ))}
            </View>
          </View>

          {/* Category Filter */}
          {activeTab === 'new' && (
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryModal(true)}
                disabled={currentLoading}
              >
                <Ionicons name="filter" size={scaleFont(20)} color="#6B7280" />
                <Text style={styles.categoryButtonText}>
                  {selectedCategory ? selectedCategory.name : 'Filter by Category'}
                </Text>
                <Ionicons name="chevron-down" size={scaleFont(16)} color="#6B7280" />
              </TouchableOpacity>

              {selectedCategory && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearCategoryFilter}
                  disabled={currentLoading}
                >
                  <Ionicons name="close" size={scaleFont(16)} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Loading */}
          {currentLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading {activeTab} tasks...</Text>
            </View>
          )}

          {/* Error */}
          {currentError && !currentLoading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{currentError}</Text>
              <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Task List */}
          <View style={styles.listContainer}>
            {!currentLoading && currentTasks.length > 0 ? (
              <FlatList
                data={currentTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TaskCard task={item} status={activeTab} router={router} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              showEmptyState && <EmptyState status={activeTab} />
            )}
          </View>

          {/* Category Modal */}
          <Modal
            visible={showCategoryModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowCategoryModal(false)}
          >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Category</Text>
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        setShowCategoryModal(false);
                      }}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={scaleFont(24)} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {selectedCategory?.name === 'Other' ? (
                    <View style={styles.customCategoryContainer}>
                      <Text style={styles.customCategoryLabel}>Enter Custom Category</Text>
                      <TextInput
                        style={styles.customCategoryInput}
                        placeholder="Type your category..."
                        value={customCategory}
                        onChangeText={setCustomCategory}
                        autoFocus={true}
                        returnKeyType="done"
                      />
                      <View style={styles.customCategoryButtons}>
                        <TouchableOpacity
                          style={[styles.categoryActionButton, styles.cancelButton]}
                          onPress={() => {
                            Keyboard.dismiss();
                            setShowCategoryModal(false);
                          }}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.categoryActionButton,
                            styles.submitButton,
                            !customCategory.trim() && styles.disabledButton,
                          ]}
                          onPress={handleCustomCategorySubmit}
                          disabled={!customCategory.trim()}
                        >
                          <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <FlatList
                      data={categories}
                      keyExtractor={(item) => item.name}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.categoryItem}
                          onPress={() => handleCategorySelect(item)}
                        >
                          <Ionicons name={item.icon} size={scaleFont(20)} color="#6B7280" />
                          <Text style={styles.categoryItemText}>{item.name}</Text>
                          {selectedCategory?.name === item.name && (
                            <Ionicons name="checkmark" size={scaleFont(20)} color="#10B981" />
                          )}
                        </TouchableOpacity>
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </Modal>

          <FloatingActionButton />
        </View>
      </SafeAreaView>
    </View>
  );
}

// Scaling functions for responsive design
const scale = (size) => {
  const baseWidth = 375; // iPhone 6/7/8 width
  return (screenWidth / baseWidth) * size;
};

const scaleFont = (size) => {
  const baseWidth = 375;
  const newSize = (screenWidth / baseWidth) * size;
  return Math.round(newSize);
};

const verticalScale = (size) => {
  const baseHeight = 667; // iPhone 6/7/8 height
  return (screenHeight / baseHeight) * size;
};

const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header styles
  headerContainer: {
    paddingHorizontal: moderateScale(24),
    paddingTop: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(40),
    paddingBottom: verticalScale(24),
    borderBottomLeftRadius: moderateScale(54),
    borderBottomRightRadius: moderateScale(54),
    marginBottom: verticalScale(15),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: scaleFont(30),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: scaleFont(16),
    color: '#E0F2FE',
    marginTop: verticalScale(4),
  },
  // Rest of the styles remain the same
  tabsContainer: {
    marginHorizontal: moderateScale(24),
    marginBottom: verticalScale(8),
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(24),
    padding: moderateScale(4),
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(24),
    marginBottom: verticalScale(16),
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    flex: 1,
    minHeight: verticalScale(48),
  },
  categoryButtonText: {
    marginLeft: moderateScale(8),
    marginRight: moderateScale(8),
    fontSize: scaleFont(14),
    color: '#374151',
    flex: 1,
  },
  clearButton: {
    marginLeft: moderateScale(8),
    width: moderateScale(36),
    height: moderateScale(36),
    backgroundColor: '#FEF2F2',
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(100),
  },
  loadingText: {
    color: '#6B7280',
    fontSize: scaleFont(16),
  },
  errorContainer: {
    padding: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(100),
  },
  errorText: {
    color: '#EF4444',
    fontSize: scaleFont(16),
    marginBottom: verticalScale(12),
    textAlign: 'center',
    lineHeight: scaleFont(20),
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    minWidth: moderateScale(80),
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: scaleFont(14),
  },
  listContainer: {
    flex: 1,
    minHeight: verticalScale(200),
  },
  listContent: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(6),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: moderateScale(4),
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: verticalScale(56),
  },
  categoryItemText: {
    flex: 1,
    marginLeft: moderateScale(12),
    fontSize: scaleFont(16),
    color: '#374151',
  },
  customCategoryContainer: {
    padding: moderateScale(20),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(20),
  },
  customCategoryLabel: {
    fontSize: scaleFont(16),
    fontWeight: '500',
    color: '#374151',
    marginBottom: verticalScale(12),
  },
  customCategoryInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    fontSize: scaleFont(16),
    marginBottom: verticalScale(20),
    minHeight: verticalScale(48),
  },
  customCategoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(12),
  },
  categoryActionButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    minHeight: verticalScale(44),
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: scaleFont(14),
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: scaleFont(14),
  },
});