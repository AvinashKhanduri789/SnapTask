// components/poster/TaskList.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const TaskList = ({ activeTab, searchQuery }) => {
  // Sample data
  const allTasks = {
    active: [
      {
        id: 1,
        title: 'UI Design Task',
        amount: 800,
        deadline: 'Oct 15',
        bids: 2,
        status: 'active',
        description: 'Need help with poster design and branding',
        category: 'Design'
      },
      {
        id: 2,
        title: 'React Native Development',
        amount: 1500,
        deadline: 'Oct 18',
        bids: 3,
        status: 'active',
        description: 'Mobile app development using React Native',
        category: 'Development'
      },
      {
        id: 5,
        title: 'Content Writing',
        amount: 600,
        deadline: 'Oct 20',
        bids: 1,
        status: 'active',
        description: 'Create engaging blog content',
        category: 'Writing'
      }
    ],
    pending: [
      {
        id: 3,
        title: 'Blog Proofreading',
        amount: 300,
        deadline: 'Oct 13',
        bids: 1,
        status: 'pending',
        description: 'Proofread and edit blog articles',
        category: 'Writing'
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Logo Design',
        amount: 500,
        deadline: 'Oct 10',
        bids: 4,
        status: 'completed',
        description: 'Create a modern logo for tech startup',
        category: 'Design'
      }
    ]
  };

  const router = useRouter();

  // Filter tasks based on search query
  const filterTasks = (tasks) => {
    if (!searchQuery) return tasks;
    
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'active': return ['#3B82F6', '#6366F1'];
      case 'pending': return ['#F59E0B', '#F97316'];
      case 'completed': return ['#10B981', '#059669'];
      default: return ['#6B7280', '#4B5563'];
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

  const getCategoryColor = (category) => {
    const colors = {
      'Design': ['#8B5CF6', '#A855F7'],
      'Development': ['#06B6D4', '#0EA5E9'],
      'Writing': ['#F59E0B', '#D97706'],
      'Marketing': ['#EC4899', '#DB2777'],
      'Other': ['#6B7280', '#4B5563']
    };
    return colors[category] || colors['Other'];
  };

  const currentTasks = filterTasks(allTasks[activeTab] || []);

  if (currentTasks.length === 0) {
    return (
      <View style={{ 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 60 
      }}>
        <LinearGradient
          colors={['#6366F1', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8
          }}
        >
          <Ionicons 
            name={searchQuery ? "search-outline" : "document-text-outline"} 
            size={32} 
            color="#ffffff" 
          />
        </LinearGradient>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: 8,
          textAlign: 'center'
        }}>
          {searchQuery 
            ? `No tasks found for "${searchQuery}"`
            : `No ${activeTab} tasks yet`
          }
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: 20
        }}>
          {searchQuery 
            ? 'Try adjusting your search terms or browse different categories'
            : 'Create your first task to get started with your projects'
          }
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 16, marginBottom: 24 }}>
      {currentTasks.map((task) => (
        <TouchableOpacity 

          key={task.id}
         

          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
            overflow: 'hidden'
          }}
        >
          {/* Header Gradient Bar */}
          <LinearGradient
            colors={getStatusGradient(task.status)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 4,
              width: '100%'
            }}
          />
          
          <View style={{ padding: 20 }}>
            {/* Top Row - Title and Status */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '700', 
                  color: '#1f2937',
                  marginBottom: 6,
                  lineHeight: 24
                }}>
                  {task.title}
                </Text>
                
                {/* Category Badge */}
                <View style={{ alignSelf: 'flex-start' }}>
                  <LinearGradient
                    colors={getCategoryColor(task.category)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: '#ffffff'
                    }}>
                      {task.category}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              
              {/* Status Badge */}
              <LinearGradient
                colors={getStatusGradient(task.status)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Ionicons name={getStatusIcon(task.status)} size={14} color="#ffffff" />
                <Text style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: '#ffffff',
                  textTransform: 'uppercase'
                }}>
                  {task.status}
                </Text>
              </LinearGradient>
            </View>
            
            {/* Task Description */}
            <Text style={{ 
              fontSize: 14, 
              color: '#6b7280',
              lineHeight: 20,
              marginBottom: 16
            }}>
              {task.description}
            </Text>
            
            {/* Stats Row */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 16
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                {/* Amount */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8
                    }}
                  >
                    <Ionicons name="cash-outline" size={16} color="#ffffff" />
                  </LinearGradient>
                  <View>
                    <Text style={{ fontSize: 12, color: '#9ca3af', fontWeight: '600' }}>Budget</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>₹{task.amount}</Text>
                  </View>
                </View>
                
                {/* Deadline */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8
                    }}
                  >
                    <Ionicons name="time-outline" size={16} color="#ffffff" />
                  </LinearGradient>
                  <View>
                    <Text style={{ fontSize: 12, color: '#9ca3af', fontWeight: '600' }}>Due</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>{task.deadline}</Text>
                  </View>
                </View>
                
                {/* Bids */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient
                    colors={['#8B5CF6', '#A855F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8
                    }}
                  >
                    <Ionicons name="people-outline" size={16} color="#ffffff" />
                  </LinearGradient>
                  <View>
                    <Text style={{ fontSize: 12, color: '#9ca3af', fontWeight: '600' }}>Bids</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>{task.bids}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Action Button */}
            <TouchableOpacity style={{
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              <LinearGradient
                colors={['#6366F1', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8
                }}
              >
                <Ionicons name="eye-outline" size={18} color="#ffffff" />
                <Text 
                onPress={() => router.push(`/poster/tasks/${task.id}`)}
                style={{ 
                  fontSize: 15, 
                  fontWeight: '700', 
                  color: '#ffffff' 
                }}>
                  View Task Details
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TaskList;