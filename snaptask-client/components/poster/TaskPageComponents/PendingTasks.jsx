import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TaskCard from "./TaskCard";
const PendingTasks = ({data}) => {
  const renderTaskItem = ({ item }) => (
    <TaskCard task={item} type="pending" />
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
});
export default PendingTasks;