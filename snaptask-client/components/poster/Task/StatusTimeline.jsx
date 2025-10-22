import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
const StatusTimeline = ({ timeline }) => {
  const getStageGradient = (completed, isCurrent) => {
    if (completed) return ['#10B981', '#059669', '#047857'];
    if (isCurrent) return ['#3B82F6', '#6366F6', '#8B5CF6'];
    return ['#6B7280', '#4B5563'];
  };
  const getStageIcon = (stage, completed, isCurrent) => {
    if (completed) return 'checkmark-circle';
    const icons = {
      'Created': 'document-text',
      'Assigned': 'person',
      'In Progress': 'rocket',
      'Pending Review': 'time',
      'Completed': 'trophy'
    };
    return isCurrent ? icons[stage] || 'ellipse' : 'ellipse-outline';
  };
  const getStageDescription = (stage) => {
    const descriptions = {
      'Created': 'Task has been created and published',
      'Assigned': 'Looking for the right candidate',
      'In Progress': 'Work is currently underway',
      'Pending Review': 'Waiting for your approval',
      'Completed': 'Task successfully delivered'
    };
    return descriptions[stage] || 'Next stage in progress';
  };
  const calculateProgress = () => {
    const completedStages = timeline.filter(stage => stage.completed).length;
    return (completedStages / timeline.length) * 100;
  };
  const progress = calculateProgress();
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
        colors={['#06B6D4', '#0EA5E9', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 6,
          width: '100%'
        }}
      />
      <View style={{ padding: 24 }}>
        {/* Header with Progress */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LinearGradient
              colors={['#06B6D4', '#0EA5E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                shadowColor: '#06B6D4',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8
              }}
            >
              <Ionicons name="time-outline" size={22} color="#ffffff" />
            </LinearGradient>
            <View>
              <Text style={{
                fontSize: 20,
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: 2
              }}>
                Task Progress
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#6b7280',
                fontWeight: '600'
              }}>
                {Math.round(progress)}% completed
              </Text>
            </View>
          </View>
          <View style={{
            backgroundColor: '#f0f9ff',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e0f2fe'
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#0369a1'
            }}>
              {timeline.filter(stage => stage.completed).length}/{timeline.length} stages
            </Text>
          </View>
        </View>
        {/* Progress Bar */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 8 
          }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#6b7280' }}>
              Overall Progress
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#3B82F6' }}>
              {Math.round(progress)}%
            </Text>
          </View>
          <View style={{
            height: 8,
            backgroundColor: '#f1f5f9',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <LinearGradient
              colors={['#3B82F6', '#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: 4
              }}
            />
          </View>
        </View>
        {/* Timeline Stages */}
        <View style={{ gap: 16 }}>
          {timeline.map((stage, index) => {
            const isCurrent = !stage.completed && index === timeline.findIndex(s => !s.completed);
            const isUpcoming = !stage.completed && !isCurrent;
            return (
              <TouchableOpacity 
                key={stage.stage}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'flex-start',
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: isCurrent ? '#f0f9ff' : 
                                 stage.completed ? '#f0fdf4' : '#f8fafc',
                  borderWidth: 2,
                  borderColor: isCurrent ? '#e0f2fe' : 
                              stage.completed ? '#dcfce7' : '#f1f5f9'
                }}
              >
                {/* Timeline Indicator */}
                <View style={{ width: 32, alignItems: 'center', marginRight: 12 }}>
                  <LinearGradient
                    colors={getStageGradient(stage.completed, isCurrent)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: stage.completed ? '#10B981' : isCurrent ? '#3B82F6' : '#6B7280',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4
                    }}
                  >
                    <Ionicons 
                      name={getStageIcon(stage.stage, stage.completed, isCurrent)} 
                      size={16} 
                      color="#ffffff" 
                    />
                  </LinearGradient>
                  {/* Connector Line */}
                  {index < timeline.length - 1 && (
                    <View style={{
                      width: 3,
                      height: 20,
                      backgroundColor: stage.completed ? '#10B981' : 
                                     isCurrent ? '#3B82F6' : '#e5e7eb',
                      marginTop: 8,
                      borderRadius: 2
                    }} />
                  )}
                </View>
                {/* Stage Content */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: stage.completed ? '#1f2937' : 
                             isCurrent ? '#1f2937' : '#9ca3af',
                      flex: 1
                    }}>
                      {stage.stage}
                    </Text>
                    {/* Status Badge */}
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: stage.completed ? '#D1FAE5' : 
                                     isCurrent ? '#DBEAFE' : '#F3F4F6'
                    }}>
                      <Text style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: stage.completed ? '#059669' : 
                               isCurrent ? '#1D4ED8' : '#6B7280',
                        textTransform: 'uppercase'
                      }}>
                        {stage.completed ? 'Completed' : 
                         isCurrent ? 'Current' : 'Upcoming'}
                      </Text>
                    </View>
                  </View>
                  <Text style={{
                    fontSize: 14,
                    color: stage.completed ? '#6b7280' : 
                           isCurrent ? '#6b7280' : '#9ca3af',
                    lineHeight: 20,
                    marginBottom: 8
                  }}>
                    {getStageDescription(stage.stage)}
                  </Text>
                  {stage.date && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons 
                        name="calendar-outline" 
                        size={12} 
                        color={stage.completed ? '#10B981' : '#9ca3af'} 
                      />
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: stage.completed ? '#10B981' : '#9ca3af',
                        marginLeft: 4
                      }}>
                        {stage.date}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Timeline Legend */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          marginTop: 20, 
          paddingTop: 16, 
          borderTopWidth: 1, 
          borderTopColor: '#f3f4f6' 
        }}>
          {[
            { color: '#10B981', label: 'Completed', icon: 'checkmark-circle' },
            { color: '#3B82F6', label: 'Current', icon: 'ellipse' },
            { color: '#6B7280', label: 'Upcoming', icon: 'ellipse-outline' }
          ].map((item, index) => (
            <View key={index} style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Ionicons name={item.icon} size={14} color={item.color} />
              <Text style={{ 
                fontSize: 12, 
                fontWeight: '600', 
                color: '#6b7280', 
                marginLeft: 4 
              }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
export default StatusTimeline;