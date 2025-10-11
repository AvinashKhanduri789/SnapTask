// components/poster/TaskTabs.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const TaskTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'active', label: 'Active', count: 3 },
    { id: 'pending', label: 'Pending Review', count: 2 },
    { id: 'completed', label: 'Completed', count: 5 }
  ];

  return (
    <View style={{ marginBottom: 20 }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? '#6366F1' : '#ffffff',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: activeTab === tab.id ? '#6366F1' : '#e5e7eb',
                minWidth: 100
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: activeTab === tab.id ? '#ffffff' : '#374151',
                textAlign: 'center'
              }}>
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TaskTabs;