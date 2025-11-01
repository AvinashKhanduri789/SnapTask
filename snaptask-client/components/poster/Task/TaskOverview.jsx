import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../../util/helper';

const TaskOverview = ({ title, status, category, postedOn, deadline }) => {
  // Calculate time remaining
  const calculateTimeRemaining = () => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return { days: 0, hours: 0, text: 'Deadline passed' };
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return { days, hours, text: `${days} day${days !== 1 ? 's' : ''} left` };
    } else {
      return { days: 0, hours, text: `${hours} hour${hours !== 1 ? 's' : ''} left` };
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const postedDate = new Date(postedOn);
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    const totalDuration = deadlineDate.getTime() - postedDate.getTime();
    const elapsed = now.getTime() - postedDate.getTime();
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const timeRemaining = calculateTimeRemaining();
  const progress = calculateProgress();

  const getStatusGradient = (status) => {
    switch (status) {
      case 'active': return ['#3B82F6', '#6366F1', '#8B5CF6'];
      case 'pending': return ['#F59E0B', '#F97316', '#EA580C'];
      case 'completed': return ['#10B981', '#059669', '#047857'];
      default: return ['#6B7280', '#4B5563', '#374151'];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'rocket-outline';
      case 'pending': return 'time-outline';
      case 'completed': return 'checkmark-done-outline';
      default: return 'document-outline';
    }
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'Design': ['#8B5CF6', '#A855F7', '#C084FC'],
      'Development': ['#06B6D4', '#0EA5E9', '#3B82F6'],
      'Writing': ['#F59E0B', '#D97706', '#B45309'],
      'Marketing': ['#EC4899', '#DB2777', '#BE185D'],
      'Other': ['#6B7280', '#4B5563', '#374151']
    };
    return gradients[category] || gradients['Other'];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Design': '🎨',
      'Development': '💻',
      'Writing': '✍️',
      'Marketing': '📈',
      'Other': '📋'
    };
    return icons[category] || icons['Other'];
  };

  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderRadius: 24,
      padding: 0,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
      overflow: 'hidden'
    }}>
      {/* Header Gradient Bar */}
      <LinearGradient
        colors={getStatusGradient(status)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 6,
          width: '100%'
        }}
      />
      <View style={{ padding: 24 }}>
        {/* Title with Icon */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
          <LinearGradient
            colors={['#6366F1', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              shadowColor: '#6366F1',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8
            }}
          >
            <Ionicons name="document-text-outline" size={22} color="#ffffff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: 4,
              lineHeight: 30,
              letterSpacing: -0.5
            }}>
              {title}
            </Text>
            {/* Status and Category Row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              {/* Status Badge */}
              <LinearGradient
                colors={getStatusGradient(status)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4
                }}
              >
                <Ionicons name={getStatusIcon(status)} size={14} color="#ffffff" />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  {status}
                </Text>
              </LinearGradient>
              {/* Category Badge */}
              <LinearGradient
                colors={getCategoryGradient(category)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4
                }}
              >
                <Text style={{ fontSize: 14 }}>{getCategoryIcon(category)}</Text>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#ffffff'
                }}>
                  {category}
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>
        {/* Timeline Info */}
        <View style={{
          backgroundColor: '#f8fafc',
          borderRadius: 16,
          padding: 16,
          marginTop: 8
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Posted Date */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4
                }}
              >
                <Ionicons name="calendar-outline" size={18} color="#ffffff" />
              </LinearGradient>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 2 }}>
                  Posted On
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>
                  {formatDate(postedOn)}
                </Text>
              </View>
            </View>
            {/* Divider */}
            <View style={{ width: 1, height: 40, backgroundColor: '#e5e7eb', marginHorizontal: 8 }} />
            {/* Deadline */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <LinearGradient
                colors={timeRemaining.days === 0 && timeRemaining.hours === 0 ? ['#EF4444', '#DC2626'] : ['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: timeRemaining.days === 0 && timeRemaining.hours === 0 ? '#EF4444' : '#F59E0B',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4
                }}
              >
                <Ionicons name="time-outline" size={18} color="#ffffff" />
              </LinearGradient>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 2 }}>
                  Deadline
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>
                  {formatDate(deadline)}
                </Text>
              </View>
            </View>
          </View>
          {/* Progress Indicator */}
          <View style={{ marginTop: 12 }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 6 
            }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280' }}>
                Time Remaining
              </Text>
              <Text style={{ 
                fontSize: 12, 
                fontWeight: '700', 
                color: timeRemaining.days === 0 && timeRemaining.hours === 0 ? '#EF4444' : '#F59E0B' 
              }}>
                {timeRemaining.text}
              </Text>
            </View>
            <View style={{
              height: 6,
              backgroundColor: '#e5e7eb',
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <LinearGradient
                colors={progress >= 100 ? ['#EF4444', '#DC2626'] : ['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  borderRadius: 3
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