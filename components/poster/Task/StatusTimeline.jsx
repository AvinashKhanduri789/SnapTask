// components/poster/task-detail/StatusTimeline.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const StatusTimeline = ({ timeline }) => {
  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16
      }}>
        Task Progress
      </Text>

      <View style={{ gap: 12 }}>
        {timeline.map((stage, index) => (
          <View key={stage.stage} style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Timeline Dot */}
            <View style={{ width: 24, alignItems: 'center' }}>
              {stage.completed ? (
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons name="checkmark" size={12} color="#ffffff" />
                </LinearGradient>
              ) : (
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#e5e7eb',
                  borderWidth: 2,
                  borderColor: '#f3f4f6'
                }} />
              )}
              
              {/* Connector Line */}
              {index < timeline.length - 1 && (
                <View style={{
                  width: 2,
                  height: 20,
                  backgroundColor: stage.completed ? '#10B981' : '#e5e7eb',
                  marginTop: 4
                }} />
              )}
            </View>

            {/* Stage Info */}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: stage.completed ? '#1f2937' : '#9ca3af',
                marginBottom: 2
              }}>
                {stage.stage}
              </Text>
              {stage.date && (
                <Text style={{
                  fontSize: 13,
                  color: stage.completed ? '#10B981' : '#9ca3af'
                }}>
                  {stage.date}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StatusTimeline;