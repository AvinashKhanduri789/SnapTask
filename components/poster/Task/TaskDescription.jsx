// components/poster/task-detail/TaskDescription.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TaskDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200; // Character limit before truncation

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? description : 
    description.length > maxLength ? description.substring(0, maxLength) + '...' : description;

  const shouldShowReadMore = description.length > maxLength;

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
        colors={['#8B5CF6', '#A855F7', '#C084FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 6,
          width: '100%'
        }}
      />
      
      <View style={{ padding: 24 }}>
        {/* Header with Icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              shadowColor: '#8B5CF6',
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
              fontSize: 20,
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: 4
            }}>
              Task Description
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6b7280',
              fontWeight: '600'
            }}>
              Details about what needs to be done
            </Text>
          </View>
        </View>

        {/* Description Text */}
        <View style={{
          backgroundColor: '#f8fafc',
          borderRadius: 16,
          padding: 20,
          borderWidth: 2,
          borderColor: '#f1f5f9'
        }}>
          <Text style={{
            fontSize: 15,
            color: '#4b5563',
            lineHeight: 24,
            letterSpacing: 0.2
          }}>
            {displayText}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          {/* Read More/Less Button */}
          {shouldShowReadMore && (
            <TouchableOpacity 
              onPress={toggleExpand}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: '#EEF2FF'
              }}
            >
              <Ionicons 
                name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} 
                size={16} 
                color="#6366F1" 
              />
              <Text style={{
                marginLeft: 6,
                fontSize: 14,
                fontWeight: '600',
                color: '#6366F1'
              }}>
                {isExpanded ? 'Read Less' : 'Read More'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Copy Button */}
          <TouchableOpacity 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: '#f0f9ff',
              borderWidth: 1,
              borderColor: '#e0f2fe'
            }}
          >
            <Ionicons name="copy-outline" size={16} color="#0369a1" />
            <Text style={{
              marginLeft: 6,
              fontSize: 14,
              fontWeight: '600',
              color: '#0369a1'
            }}>
              Copy Text
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description Stats */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          marginTop: 20, 
          paddingTop: 16, 
          borderTopWidth: 1, 
          borderTopColor: '#f3f4f6' 
        }}>
          {[
            { icon: '📝', label: 'Words', value: description.split(' ').length },
            { icon: '🔤', label: 'Characters', value: description.length },
            { icon: '📊', label: 'Read Time', value: `${Math.ceil(description.split(' ').length / 200)} min` }
          ].map((stat, index) => (
            <View key={index} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1f2937' }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '600' }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Tags Section */}
        <View style={{ marginTop: 16 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '700', 
            color: '#374151', 
            marginBottom: 8 
          }}>
            📌 Key Requirements:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Modern Design', 'Blue Gradients', 'Eye-catching', 'Innovation Theme'].map((tag, index) => (
              <View 
                key={index}
                style={{
                  backgroundColor: '#f3f4f6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#e5e7eb'
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#4b5563' }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TaskDescription;