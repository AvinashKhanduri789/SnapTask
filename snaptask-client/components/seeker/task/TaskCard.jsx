import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const TaskCard = ({ task, status, router }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'new': return 'rocket-outline';
      case 'pending': return 'time-outline';
      case 'completed': return 'checkmark-done-outline';
      default: return 'document-outline';
    }
  };

  

  const getStatusColor = () => {
    switch (status) {
      case 'new': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getButtonConfig = () => {
    switch (status) {
      case 'new':
        return { text: 'View', color: '#10B981', icon: 'eye' };
      case 'pending':
        return { text: 'View', color: '#F59E0B', icon: 'eye' };
      case 'completed':
        return { text: 'Review', color: '#3B82F6', icon: 'eye' };
      default:
        return { text: 'View', color: '#6B7280', icon: 'arrow-forward' };
    }
  };

  const buttonConfig = getButtonConfig();
  const statusColor = getStatusColor();

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: statusColor + '15' }]}>
            <Ionicons name={getStatusIcon()} size={20} color={statusColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
            <Text style={styles.postedTime}>Posted {task.postedTime}</Text>
          </View>
        </View>
        <View style={styles.budgetContainer}>
          <Text style={styles.budget}>{task.budget}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>{task.description}</Text>

      {/* Meta info */}
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{task.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{task.deadline}</Text>
          </View>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={16} color="#6B7280" />
          <Text style={styles.metaText}>{task.applicants}</Text>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.skillsRow}>
        {task.skills.map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      {/* Action button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: buttonConfig.color }]}
        onPress={
          () => {
            console.log('Button pressed for task:', task.id);
            router.push(`/seeker/taskDetail/${task.id}`);
          
          }
        }
      >
        <Ionicons name={buttonConfig.icon} size={18} color="#FFFFFF" />
        <Text style={styles.actionText}>{buttonConfig.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 8,

    // 3D effect shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, // bigger offset
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10, // Android shadow

    // Slight scale for stack effect (optional)
    transform: [{ scale: 1 }],
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  postedTime: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  budgetContainer: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  budget: { color: '#3B82F6', fontWeight: '600', fontSize: 14 },
  description: { color: '#4B5563', lineHeight: 20, marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metaLeft: { flexDirection: 'row' },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  metaText: { fontSize: 12, color: '#4B5563', marginLeft: 4 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  skillBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginRight: 8, marginBottom: 8 },
  skillText: { fontSize: 10, fontWeight: '500', color: '#4B5563' },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    // Shadow for button itself
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  actionText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14, marginLeft: 8 },
});

export default TaskCard;
