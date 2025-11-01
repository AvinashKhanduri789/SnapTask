import React from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EditTaskBottomSheet from './EditTaskBottomSheet';
import { useState } from 'react';
import { useApi } from "../../../util/useApi";
import { api } from "../../../util/requester";

const ActionButtons = ({ taskId, status, taskData, onTaskUpdate }) => {
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  const { request, isLoading } = useApi();
  const router = useRouter();

  const handleEdit = () => {
    setIsEditSheetVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete
        }
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      const response = await request(api.delete(`/poster/delete/${taskId}`));
      
      if (response.ok) {
        // Success - go back to previous screen
        Alert.alert("Success", "Task deleted successfully");
        router.back(); // This will pop the current screen from the stack
      } else {
        Alert.alert("Error", "Failed to delete task. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
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

  return (
    <>
      <View className="px-6 py-5 bg-white border-t border-slate-100">
        <View className="flex-row justify-between space-x-3">
          
          {/* Edit Button - Primary */}
          <TouchableOpacity 
            className="flex-1"
            onPress={handleEdit}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 rounded-2xl items-center justify-center flex-row"
              style={{
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6
              }}
            >
              <Ionicons name="pencil" size={18} color="#ffffff" />
              <Text className="text-white font-semibold text-base ml-2">
                Edit
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Delete Button - Danger */}
          <TouchableOpacity 
            className="flex-1"
            onPress={handleDelete}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <View className="py-4 rounded-2xl items-center justify-center flex-row border-2 border-red-500 bg-white"
              style={{
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  <Text className="text-red-600 font-semibold text-base ml-2">
                    Delete
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Complete Button - Success (conditionally shown) */}
          {status === 'active' && (
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
                className="py-4 rounded-2xl items-center justify-center flex-row"
                style={{
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6
                }}
              >
                <Ionicons name="checkmark-done" size={18} color="#ffffff" />
                <Text className="text-white font-semibold text-base ml-2">
                  Complete
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Status message when complete button is hidden */}
        {status !== 'active' && (
          <View className="mt-3">
            <Text className="text-slate-500 text-xs text-center">
              Task is {status}
            </Text>
          </View>
        )}
      </View>

      <EditTaskBottomSheet
        visible={isEditSheetVisible}
        onClose={() => setIsEditSheetVisible(false)}
        taskData={taskData}
        onSave={handleSaveChanges}
      />  
    </>
  );
};

export default ActionButtons;