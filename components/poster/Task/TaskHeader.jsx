// components/poster/task-detail/TaskHeader.jsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const TaskHeader = ({ taskTitle }) => {
  const router = useRouter();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6'
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            marginRight: 12
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Task Details
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            marginTop: 2
          }}>
            {taskTitle}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};

export default TaskHeader;