import { ScrollView, View, RefreshControl, StatusBar, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import QuickActionCard from '../../../components/poster/home/QuickActionCard ';
import TaskTabs from '../../../components/poster/home/TaskTabs ';
import TaskList from '../../../components/poster/home/TaskList ';
import { useState, useEffect } from 'react';
import { useApi } from '../../../util/useApi';
import { api } from "../../../util/requester";
import { useAuth } from '../../_layout';
const { width } = Dimensions.get('window');

const Home = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { userData } = useAuth();

  const { request, data, isLoading, error } = useApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    return request(api.get("/poster/tasks/summary"));
  };


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

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

   
      <LinearGradient
        colors={['#3B82F6', '#3B82F6']}
        className="pt-8 pb-8 px-6"
        style={{
          borderBottomLeftRadius: 54,
          borderBottomRightRadius: 54,
          marginBottom: 15,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, paddingTop: 5 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
              }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#ffffff' }}>
                  {userData.name[0] || " "}
                </Text>
              </View>
              <View>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: -0.5,
                }}>
                  {userData.name || " "}
                </Text>
              </View>
            </View>
          </View>

         
        </View>

        {/* Search Bar */}
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: isSearchFocused ? '#3B82F6' : '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isSearchFocused ? 0.2 : 0.1,
          shadowRadius: 16,
          elevation: 6,
          borderWidth: 2,
          borderColor: isSearchFocused ? '#3B82F6' : '#ffffff',
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#3B82F6',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Ionicons name="search" size={20} color="#ffffff" />
          </View>

          <View style={{
            flex: 1,
            justifyContent: 'center', // Add this to center the text vertically
          }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#1f2937',
                height: 40,
                padding: 0, // Remove default padding
                textAlignVertical: 'center', // Center text vertically
              }}
              placeholder="Search your tasks"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          {searchQuery ? (
            <TouchableOpacity
              onPress={clearSearch}
              style={{
                backgroundColor: '#f3f4f6',
                width: 36,
                height: 36,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
              }}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Search Result Hint */}
        {searchQuery && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
            paddingHorizontal: 14,
            paddingVertical: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 10,
            alignSelf: 'flex-start',
          }}>
            <Ionicons name="search" size={16} color="#ffffff" />
            <Text style={{
              fontSize: 14,
              color: '#ffffff',
              fontWeight: '600',
              marginLeft: 6,
            }}>
              Searching for "{searchQuery}"
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          {/* <QuickActionCard /> */}

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

          
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;