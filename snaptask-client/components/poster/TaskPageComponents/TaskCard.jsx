import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDate } from '../../../util/helper';

const TaskCard = ({ task, type }) => {
  const router = useRouter();

  const getStatusGradient = (status) => {
    switch (status) {
      case 'PENDING':
        return ['#F59E0B', '#D97706'];
      case 'COMPLETED':
        return ['#10B981', '#059669'];
      case 'ACTIVE':
        return ['#3B82F6', '#6366F1'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return 'time';
      case 'COMPLETED':
        return 'checkmark-circle';
      case 'ACTIVE':
        return 'rocket';
      default:
        return 'help-circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'COMPLETED':
        return 'Completed';
      case 'ACTIVE':
        return 'Active';
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toFixed(0) || '0'}`;
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
      }}
      onPress={() => router.push(`/poster/tasks/${task.id}`)}
    >
      {/* Top Gradient Bar */}
      <LinearGradient
        colors={getStatusGradient(task.status)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="h-1 w-full"
      />
      
      <View className="p-5">
        {/* Header with Status */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-lg font-bold text-slate-800 mb-2 leading-6">
              {task.title}
            </Text>
            <Text className="text-sm text-slate-500 mb-2" numberOfLines={2}>
              {task.description}
            </Text>
          </View>
          {/* Status Badge */}
          <LinearGradient
            colors={getStatusGradient(task.status)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-3 py-2 rounded-full flex-row items-center min-w-20"
          >
            <Ionicons name={getStatusIcon(task.status)} size={14} color="#ffffff" />
            <Text className="text-white text-xs font-bold ml-1 uppercase">
              {getStatusText(task.status)}
            </Text>
          </LinearGradient>
        </View>

        {/* Category */}
        <View className="mb-3">
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
              <Ionicons name="pricetag" size={12} color="#6B7280" />
            </View>
            <Text className="text-slate-500 text-sm ml-2">
              {task.category || 'General'}
            </Text>
          </View>
        </View>

        {/* Metadata with Icons */}
        <View className="mb-4 space-y-2">
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
              <Ionicons name="calendar" size={12} color="#6B7280" />
            </View>
            <Text className="text-slate-500 text-sm ml-2">
              Created: {formatDate(task.createdAt)}
            </Text>
          </View>
          
          {task.deadline && (
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
                <Ionicons name="hourglass" size={12} color="#6B7280" />
              </View>
              <Text className="text-slate-500 text-sm ml-2">
                Deadline: {formatDate(task.deadline)}
              </Text>
            </View>
          )}

          {/* Bids Count */}
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
              <Ionicons name="people" size={12} color="#6B7280" />
            </View>
            <Text className="text-slate-500 text-sm ml-2">
              {task.bidsCount || 0} {task.bidsCount === 1 ? 'bid' : 'bids'}
            </Text>
          </View>
        </View>

        {/* Footer with Budget and Actions */}
        <View className="flex-row justify-between items-center">
          {/* Budget */}
          <View className="flex-row items-center">
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="wallet" size={16} color="#ffffff" />
            </LinearGradient>
            <Text className="text-lg font-bold text-emerald-600 ml-2">
              {formatCurrency(task.budget)}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2">
            <TouchableOpacity 
              onPress={() => router.push(`/poster/tasks/${task.id}`)}
              className="bg-blue-500 px-4 py-2 rounded-xl"
            >
              <Text className="text-white text-sm font-semibold">
                View Details
              </Text>
            </TouchableOpacity>

            {(task.status === 'PENDING' || task.status === 'ACTIVE') && task.bidsCount > 0 && (
              <TouchableOpacity className="bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <Text className="text-slate-700 text-sm font-semibold">
                  {task.bidsCount} Bids
                </Text>
              </TouchableOpacity>
            )}

            {task.status === 'COMPLETED' && (
              <TouchableOpacity className="bg-amber-100 px-3 py-2 rounded-xl">
                <Text className="text-amber-700 text-sm font-semibold">
                  ⭐ Review
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskCard;