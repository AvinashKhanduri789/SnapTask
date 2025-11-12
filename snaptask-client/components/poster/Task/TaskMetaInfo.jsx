import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View, Dimensions, ScrollView } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TaskMetaInfo = ({ budget, duration, mode, applicants }) => {
  const metaItems = [
    {
      icon: 'cash-outline',
      label: 'Budget',
      value: `₹${budget}`,
      gradient: ['#10B981', '#059669']
    },
    {
      icon: 'time-outline',
      label: 'Duration',
      value: duration,
      gradient: ['#F59E0B', '#D97706']
    },
    {
      icon: 'location-outline',
      label: 'Mode',
      value: mode,
      gradient: ['#8B5CF6', '#A855F7']
    },
    {
      icon: 'people-outline',
      label: 'Applicants',
      value: applicants.toString(),
      gradient: ['#3B82F6', '#6366F1']
    }
  ];

  const isSmallScreen = SCREEN_WIDTH < 375;

  if (isSmallScreen) {
    return (
      <View style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: 12
        }}>
          Task Details
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {metaItems.map((item, index) => (
            <View 
              key={index}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: 14,
                padding: 16,
                alignItems: 'center',
                minWidth: 100
              }}
            >
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8
                }}
              >
                <Ionicons name={item.icon} size={18} color="#ffffff" />
              </LinearGradient>
              
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: 4
              }}>
                {item.value}
              </Text>
              <Text style={{
                fontSize: 11,
                color: '#6b7280',
                fontWeight: '600'
              }}>
                {item.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Original layout for larger screens
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
        Task Details
      </Text>
      
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        gap: 12 
      }}>
        {metaItems.map((item, index) => (
          <View key={index} style={{ width: '48%' }}>
            <View style={{
              backgroundColor: '#f8fafc',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center'
            }}>
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8
                }}
              >
                <Ionicons name={item.icon} size={20} color="#ffffff" />
              </LinearGradient>
              
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: 4
              }}>
                {item.value}
              </Text>
              <Text style={{
                fontSize: 13,
                color: '#6b7280',
                fontWeight: '600'
              }}>
                {item.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TaskMetaInfo;