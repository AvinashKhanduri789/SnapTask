import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EditTaskBottomSheet from './EditTaskBottomSheet';
import { useState } from 'react';
import { useApi } from "../../../util/useApi";
import { api } from "../../../util/requester";
import StatusModal from '../../common/StatusModal';

const ActionButtons = ({ taskId, status, taskData, onTaskUpdate }) => {
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    status: 'info',
    title: '',
    message: '',
    primaryActionLabel: 'OK'
  });
  const { request, isLoading,error } = useApi();
  const router = useRouter();


  const showEditButton = status !== 'COMPLETED';
  const showDeleteButton = status !== 'PENDING' && status !== 'COMPLETED';
  const showCompleteButton = status === 'active';

  const showModal = (status, title, message, primaryActionLabel = 'OK') => {
    setModalConfig({
      status,
      title,
      message,
      primaryActionLabel
    });
    setModalVisible(true);
  };

  const handleEdit = () => {
    setIsEditSheetVisible(true);
  };

  const handleDelete = () => {
    showModal(
      'warning',
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      'Delete'
    );
  };

  const confirmDelete = async () => {
    try {
      console.log("task id when delteing task is -->", taskId);
      const response = await request(
         api.delete(`/poster/delete`, { data: { taskId } })
      );
      
      if (response.ok) {
        showModal('success', 'Success', 'Task deleted successfully');
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        showModal('error', 'Task Cannot Be Deleted', error);
      }
    } catch (error) {
      showModal('error', 'Error', error);
      console.error('Delete task error:', error);
    }
  };

  const handleComplete = () => {
    console.log('Mark as completed:', taskId);
  };

  const handleSaveChanges = (updatedData) => {
    console.log('Saving changes:', updatedData);
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  const handleModalPrimaryAction = () => {
    if (modalConfig.status === 'warning' && modalConfig.primaryActionLabel === 'Delete') {
     
      confirmDelete();
    }
    setModalVisible(false);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View className="px-5 py-4 bg-white border-t border-slate-200">
        <View className="flex-row justify-between" style={{ gap: 12 }}>
          
         
          {showEditButton && (
            <TouchableOpacity 
              className="flex-1"
              onPress={handleEdit}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-3 rounded-xl items-center justify-center flex-row"
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                  borderRadius: 12,
                }}
              >
                <Ionicons name="pencil" size={16} color="#ffffff" />
                <Text className="text-white font-semibold text-sm ml-2">
                  Edit
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

         
          {showDeleteButton && (
            <TouchableOpacity 
              className="flex-1"
              onPress={handleDelete}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <View 
                className="py-3 rounded-xl items-center justify-center flex-row border border-blue-500 bg-white"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderRadius: 12,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={16} color="#3B82F6" />
                    <Text className="text-blue-600 font-semibold text-sm ml-2">
                      Delete
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Complete Button - Blue (conditionally shown) */}
          {showCompleteButton && (
            <TouchableOpacity 
              className="flex-1"
              onPress={handleComplete}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-3 rounded-xl items-center justify-center flex-row"
                style={{
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                  borderRadius: 12,
                }}
              >
                <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                <Text className="text-white font-semibold text-sm ml-2">
                  Complete
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Placeholder to maintain layout when all buttons are hidden */}
          {status === 'COMPLETED' && (
            <View className="flex-1 items-center justify-center">
              <Text className="text-slate-500 text-sm text-center">
                Task Completed
              </Text>
            </View>
          )}
        </View>

        {/* Status message */}
        <View className="mt-2">
          <Text className="text-slate-500 text-xs text-center">
            {status === 'PENDING' && 'Task is PENDING - Edit available only'}
            {status === 'active' && 'Task is ACTIVE - All actions available'}
            {status === 'COMPLETED' && 'Task is COMPLETED - No actions available'}
          </Text>
        </View>
      </View>

      <EditTaskBottomSheet
        visible={isEditSheetVisible}
        onClose={() => setIsEditSheetVisible(false)}
        taskData={taskData}
        onSave={handleSaveChanges}
      />

      <StatusModal
        visible={modalVisible}
        onClose={handleModalClose}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        showCloseButton={modalConfig.status === 'warning'} 
        vibration={modalConfig.status === 'error' || modalConfig.status === 'warning'}
        primaryActionLabel={modalConfig.primaryActionLabel}
        onPrimaryAction={handleModalPrimaryAction}
      />
    </>
  );
};

export default ActionButtons;