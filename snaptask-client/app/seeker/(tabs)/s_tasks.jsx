// import React, { useState } from 'react';
import React, { useState } from 'react';
import { View, FlatList, StatusBar, StyleSheet } from 'react-native';
import Header from '../../../components/seeker/task/Header';
import TabButton from '../../../components/seeker/task/TabButton';
import TaskCard from '../../../components/seeker/task/TaskCard';
import FloatingActionButton from '../../../components/seeker/task/FloatingActionButton';
import EmptyState from '../../../components/seeker/task/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SeekerTasksScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('new');

  const TASKS = {
    new: [
      {
        id: '1',
        title: 'Mobile App UI/UX Design',
        description: 'Create a modern and intuitive interface for a fitness tracking application with dark mode support.',
        budget: '$850',
        location: 'Remote',
        deadline: '2 days',
        postedTime: '2 hours ago',
        applicants: '12 applicants',
        skills: ['UI/UX', 'Figma', 'Mobile Design'],
        status: 'new'
      },
      {
        id: '2',
        title: 'E-commerce Website Development',
        description: 'Build a responsive online store with payment integration and admin dashboard.',
        budget: '$1,200',
        location: 'Worldwide',
        deadline: '5 days',
        postedTime: '5 hours ago',
        applicants: '8 applicants',
        skills: ['React', 'Node.js', 'Stripe'],
        status: 'new'
      }
    ],
    pending: [
      {
        id: '3',
        title: 'Brand Identity Design',
        description: 'Complete logo design and brand guidelines for tech startup launching next month.',
        budget: '$600',
        location: 'New York, NY',
        deadline: '3 days',
        postedTime: '1 day ago',
        applicants: 'In progress',
        skills: ['Logo Design', 'Branding', 'Illustration'],
        status: 'pending'
      }
    ],
    completed: [
      {
        id: '4',
        title: 'Social Media Marketing',
        description: '3-month social media campaign for eco-friendly product launch with content creation.',
        budget: '$2,100',
        location: 'Remote',
        deadline: 'Completed',
        postedTime: '2 weeks ago',
        applicants: 'Delivered',
        skills: ['Marketing', 'Content', 'Analytics'],
        status: 'completed'
      }
    ]
  };

  const TABS = [
    { id: 'new', label: 'New Tasks' },
    { id: 'pending', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onPress={() => setActiveTab(tab.id)}
            />
          ))}
        </View>
      </View>

      {/* Task List */}
      <View style={styles.listContainer}>
        {TASKS[activeTab] && TASKS[activeTab].length > 0 ? (
          <FlatList
            data={TASKS[activeTab]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TaskCard router={router} task={item} status={activeTab} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <EmptyState status={activeTab} />
        )}
      </View>

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabsContainer: {
    marginHorizontal: 24,
    marginBottom: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    padding: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
});
