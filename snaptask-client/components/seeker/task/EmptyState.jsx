import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = ({ status }) => {
  const getEmptyConfig = () => {
    switch (status) {
      case 'new':
        return {
          icon: 'search-outline',
          title: 'No New Tasks',
          message: 'Check back later for new opportunities',
          color: '#6B7280',
        };
      case 'pending':
        return {
          icon: 'time-outline',
          title: 'No Active Tasks',
          message: 'Apply to tasks to see them here',
          color: '#F59E0B',
        };
      case 'completed':
        return {
          icon: 'trophy-outline',
          title: 'No Completed Tasks',
          message: 'Your completed work will appear here',
          color: '#10B981',
        };
      default:
        return {
          icon: 'document-outline',
          title: 'No Tasks',
          message: 'No tasks available',
          color: '#6B7280',
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          backgroundColor: `${config.color}15`,
        }}
      >
        <Ionicons name={config.icon} size={32} color={config.color} />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#111827',
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        {config.title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 24,
        }}
      >
        {config.message}
      </Text>
    </View>
  );
};

export default EmptyState;
