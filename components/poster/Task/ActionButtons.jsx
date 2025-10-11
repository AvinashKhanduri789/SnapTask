// components/poster/task-detail/ActionButtons.jsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons = ({ taskId, status }) => {
  const handleEdit = () => {
    console.log('Edit task:', taskId);
  };

  const handleDelete = () => {
    console.log('Delete task:', taskId);
  };

  const handleComplete = () => {
    console.log('Mark as completed:', taskId);
  };

  return (
    <View style={{
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
      gap: 12
    }}>
      {/* Edit Button */}
      <TouchableOpacity 
        style={{ flex: 2 }}
        onPress={handleEdit}
      >
        <LinearGradient
          colors={['#6366F1', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8
          }}
        >
          <Ionicons name="create-outline" size={20} color="#ffffff" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>
            Edit Task
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity 
        style={{ flex: 1 }}
        onPress={handleDelete}
      >
        <View style={{
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef2f2',
          borderWidth: 2,
          borderColor: '#fecaca'
        }}>
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
        </View>
      </TouchableOpacity>

      {/* Complete Button (conditionally shown) */}
      {status === 'active' && (
        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={handleComplete}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons name="checkmark-done" size={20} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ActionButtons;