import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../../util/helper';

const TaskOverview = ({ title, status, category, postedOn, deadline }) => {
  const { width } = useWindowDimensions();

  const calculateTimeRemaining = () => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;

    if (timeDiff <= 0) return { text: 'Deadline passed', color: '#EF4444' };

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const text = days > 0 ? `${days} day${days !== 1 ? 's' : ''} left` : `${hours} hour${hours !== 1 ? 's' : ''} left`;
    return { text, color: days <= 0 && hours <= 6 ? '#EF4444' : '#F59E0B' };
  };

  const calculateProgress = () => {
    const start = new Date(postedOn);
    const end = new Date(deadline);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    if (elapsed <= 0) return 0;
    if (elapsed >= total) return 100;
    return Math.round((elapsed / total) * 100);
  };

  const gradients = {
    active: ['#3B82F6', '#6366F1', '#8B5CF6'],
    pending: ['#F59E0B', '#F97316', '#EA580C'],
    completed: ['#10B981', '#059669', '#047857'],
    default: ['#6B7280', '#4B5563', '#374151'],
  };

  const icons = {
    active: 'rocket-outline',
    pending: 'time-outline',
    completed: 'checkmark-done-outline',
    default: 'document-outline',
  };

  const catGradients = {
    Design: ['#8B5CF6', '#A855F7', '#C084FC'],
    Development: ['#06B6D4', '#0EA5E9', '#3B82F6'],
    Writing: ['#F59E0B', '#D97706', '#B45309'],
    Marketing: ['#EC4899', '#DB2777', '#BE185D'],
    Other: ['#6B7280', '#4B5563', '#374151'],
  };

  const timeRemaining = calculateTimeRemaining();
  const progress = calculateProgress();

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
        overflow: 'hidden',
        width: width - 32,
        alignSelf: 'center',
      }}
    >
      <LinearGradient
        colors={gradients[status] || gradients.default}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 6, width: '100%' }}
      />

      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <LinearGradient
            colors={['#6366F1', '#3B82F6']}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="document-text-outline" size={22} color="#fff" />
          </LinearGradient>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: 6,
                flexWrap: 'wrap',
              }}
              numberOfLines={2}
            >
              {title}
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <LinearGradient
                colors={gradients[status] || gradients.default}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Ionicons name={icons[status] || icons.default} size={12} color="#fff" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff', textTransform: 'uppercase' }}>
                  {status}
                </Text>
              </LinearGradient>

              <LinearGradient
                colors={catGradients[category] || catGradients.Other}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{category}</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Details */}
        <View
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: '#f1f5f9',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#6b7280' }}>Posted On</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1f2937' }}>{formatDate(postedOn)}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#6b7280' }}>Deadline</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1f2937' }}>{formatDate(deadline)}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280' }}>Time Progress</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: timeRemaining.color }}>
                {timeRemaining.text}
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
              <LinearGradient
                colors={progress >= 100 ? ['#EF4444', '#DC2626'] : ['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TaskOverview;
