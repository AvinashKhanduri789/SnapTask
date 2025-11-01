import { ScrollView, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderSection from "../../../components/poster/home/HeaderSection ";
import QuickActionCard from '../../../components/poster/home/QuickActionCard ';
import TaskTabs from '../../../components/poster/home/TaskTabs ';
import TaskList from '../../../components/poster/home/TaskList ';
import InsightsCard from '../../../components/poster/home/InsightsCard ';
import { useState } from 'react';
import {useApi} from '../../../util/useApi';
import {api} from "../../../util/requester";
import { useEffect } from 'react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { request, data, isLoading, error } = useApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    return request(api.get("/poster/tasks/summary"));
  };

  // ✅ Provide safe defaults
  const tasksData = data || { active: [], pending: [], completed: [] };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#3B82F6']} // Optional: custom refresh color
            tintColor="#3B82F6" // Optional: iOS
          />
        }
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          <HeaderSection onSearch={setSearchQuery} />
          <QuickActionCard />
          
          <TaskTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeCount={tasksData.active?.length || 0}
            pendingCount={tasksData.pending?.length || 0}
            completedCount={tasksData.completed?.length || 0}
          />

          <TaskList
            activeTab={activeTab}
            searchQuery={searchQuery}
            userData={tasksData}
          />

          <InsightsCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;