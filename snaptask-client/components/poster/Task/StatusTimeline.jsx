import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StatusTimeline = ({ status, postedOn, deadline }) => {
  // Generate timeline based on status
  const generateTimeline = () => {
    const baseStages = [
      { stage: 'Created', description: 'Task has been created and published' },
      { stage: 'Assigned', description: 'Looking for the right candidate' },
      { stage: 'Completed', description: 'Task successfully delivered' }
    ];

    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    switch (status) {
      case 'PENDING':
        return [
          { 
            stage: 'Created', 
            description: 'Task has been created and published',
            completed: true,
            date: postedOn ? new Date(postedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : currentDate
          },
          { 
            stage: 'Assigned', 
            description: 'Looking for the right candidate',
            completed: false,
            date: ''
          },
          { 
            stage: 'Completed', 
            description: 'Task successfully delivered',
            completed: false,
            date: ''
          }
        ];

      case 'ACTIVE':
        return [
          { 
            stage: 'Created', 
            description: 'Task has been created and published',
            completed: true,
            date: postedOn ? new Date(postedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : currentDate
          },
          { 
            stage: 'Assigned', 
            description: 'Work is currently in progress',
            completed: true,
            date: currentDate
          },
          { 
            stage: 'Completed', 
            description: 'Task successfully delivered',
            completed: false,
            date: deadline ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
          }
        ];

      case 'COMPLETED':
        return [
          { 
            stage: 'Created', 
            description: 'Task has been created and published',
            completed: true,
            date: postedOn ? new Date(postedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : currentDate
          },
          { 
            stage: 'Assigned', 
            description: 'Task was assigned and worked on',
            completed: true,
            date: currentDate
          },
          { 
            stage: 'Completed', 
            description: 'Task successfully delivered',
            completed: true,
            date: currentDate
          }
        ];

      default:
        return baseStages.map(stage => ({ ...stage, completed: false, date: '' }));
    }
  };

  const timeline = generateTimeline();

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
      'Completed': 'trophy'
    };
    return isCurrent ? icons[stage] || 'ellipse' : 'ellipse-outline';
  };

  const calculateProgress = () => {
    const completedStages = timeline.filter(stage => stage.completed).length;
    return (completedStages / timeline.length) * 100;
  };

  const progress = calculateProgress();

  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED': return '#10B981';
      case 'ACTIVE': return '#3B82F6';
      case 'PENDING': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'COMPLETED': return 'Completed';
      case 'ACTIVE': return 'In Progress';
      case 'PENDING': return 'Pending';
      default: return 'Unknown';
    }
  };

  // Responsive font sizes
  const getResponsiveFontSize = (baseSize) => {
    if (SCREEN_WIDTH < 375) return baseSize - 1; // iPhone SE, small devices
    if (SCREEN_WIDTH < 414) return baseSize;     // Standard iPhones
    return baseSize + 1;                         // Larger devices
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
      overflow: 'hidden',
      // REMOVED the marginHorizontal to make it full width like other components
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
      <View style={{ 
        paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.05), // Responsive padding
        paddingVertical: 20 
      }}>
        {/* Header with Progress - Fixed layout */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          marginBottom: 20 
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <LinearGradient
              colors={['#06B6D4', '#0EA5E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: SCREEN_WIDTH < 375 ? 40 : 44,
                height: SCREEN_WIDTH < 375 ? 40 : 44,
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
              <Ionicons name="time-outline" size={SCREEN_WIDTH < 375 ? 20 : 22} color="#ffffff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: getResponsiveFontSize(18),
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: 2
              }}>
                Task Progress
              </Text>
              <Text style={{
                fontSize: getResponsiveFontSize(13),
                color: '#6b7280',
                fontWeight: '600'
              }}>
                {Math.round(progress)}% completed • {getStatusText()}
              </Text>
            </View>
          </View>
          {/* Status Badge with fixed width */}
          <View style={{
            backgroundColor: '#f0f9ff',
            paddingHorizontal: SCREEN_WIDTH < 375 ? 8 : 12,
            paddingVertical: SCREEN_WIDTH < 375 ? 4 : 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e0f2fe',
            minWidth: SCREEN_WIDTH < 375 ? 70 : 80, // Fixed minimum width
            marginLeft: 8
          }}>
            <Text style={{
              fontSize: SCREEN_WIDTH < 375 ? 12 : 14,
              fontWeight: '700',
              color: getStatusColor(),
              textAlign: 'center'
            }}>
              {getStatusText()}
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
            <Text style={{ 
              fontSize: getResponsiveFontSize(12), 
              fontWeight: '600', 
              color: '#6b7280' 
            }}>
              Overall Progress
            </Text>
            <Text style={{ 
              fontSize: getResponsiveFontSize(12), 
              fontWeight: '700', 
              color: '#3B82F6' 
            }}>
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
        <View style={{ gap: 12 }}>
          {timeline.map((stage, index) => {
            const isCurrent = !stage.completed && index === timeline.findIndex(s => !s.completed);
            const isUpcoming = !stage.completed && !isCurrent;
            
            return (
              <TouchableOpacity 
                key={stage.stage}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'flex-start',
                  padding: SCREEN_WIDTH < 375 ? 12 : 16,
                  borderRadius: 16,
                  backgroundColor: isCurrent ? '#f0f9ff' : 
                                 stage.completed ? '#f0fdf4' : '#f8fafc',
                  borderWidth: 2,
                  borderColor: isCurrent ? '#e0f2fe' : 
                              stage.completed ? '#dcfce7' : '#f1f5f9'
                }}
              >
                {/* Timeline Indicator */}
                <View style={{ 
                  width: SCREEN_WIDTH < 375 ? 28 : 32, 
                  alignItems: 'center', 
                  marginRight: SCREEN_WIDTH < 375 ? 8 : 12 
                }}>
                  <LinearGradient
                    colors={getStageGradient(stage.completed, isCurrent)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: SCREEN_WIDTH < 375 ? 24 : 28,
                      height: SCREEN_WIDTH < 375 ? 24 : 28,
                      borderRadius: SCREEN_WIDTH < 375 ? 12 : 14,
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
                      size={SCREEN_WIDTH < 375 ? 14 : 16} 
                      color="#ffffff" 
                    />
                  </LinearGradient>
                  {/* Connector Line */}
                  {index < timeline.length - 1 && (
                    <View style={{
                      width: 2,
                      height: 16,
                      backgroundColor: stage.completed ? '#10B981' : 
                                     isCurrent ? '#3B82F6' : '#e5e7eb',
                      marginTop: 6,
                      borderRadius: 1
                    }} />
                  )}
                </View>

                {/* Stage Content */}
                <View style={{ flex: 1 }}>
                  <View style={{ 
                    flexDirection: SCREEN_WIDTH < 375 ? 'column' : 'row', 
                    alignItems: SCREEN_WIDTH < 375 ? 'flex-start' : 'center', 
                    marginBottom: 6,
                    gap: SCREEN_WIDTH < 375 ? 4 : 0
                  }}>
                    <Text style={{
                      fontSize: getResponsiveFontSize(15),
                      fontWeight: '700',
                      color: stage.completed ? '#1f2937' : 
                             isCurrent ? '#1f2937' : '#9ca3af',
                      flex: 1
                    }}>
                      {stage.stage}
                    </Text>
                    {/* Status Badge */}
                    <View style={{
                      paddingHorizontal: SCREEN_WIDTH < 375 ? 6 : 8,
                      paddingVertical: SCREEN_WIDTH < 375 ? 3 : 4,
                      borderRadius: 8,
                      backgroundColor: stage.completed ? '#D1FAE5' : 
                                     isCurrent ? '#DBEAFE' : '#F3F4F6',
                      alignSelf: SCREEN_WIDTH < 375 ? 'flex-start' : 'center'
                    }}>
                      <Text style={{
                        fontSize: SCREEN_WIDTH < 375 ? 10 : 11,
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
                    fontSize: getResponsiveFontSize(13),
                    color: stage.completed ? '#6b7280' : 
                           isCurrent ? '#6b7280' : '#9ca3af',
                    lineHeight: 20,
                    marginBottom: 8
                  }}>
                    {stage.description}
                  </Text>
                  {stage.date && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons 
                        name="calendar-outline" 
                        size={SCREEN_WIDTH < 375 ? 10 : 12} 
                        color={stage.completed ? '#10B981' : '#9ca3af'} 
                      />
                      <Text style={{
                        fontSize: getResponsiveFontSize(11),
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
              <Ionicons name={item.icon} size={SCREEN_WIDTH < 375 ? 12 : 14} color={item.color} />
              <Text style={{ 
                fontSize: getResponsiveFontSize(11), 
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