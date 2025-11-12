// app/poster/seekerProfile/[bidId].js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../../../util/useApi';
import { api } from '../../../util/requester';
import StatusModal from '../../../components/common/StatusModal';
import { formatDate } from '../../../util/helper';

const BidDetailScreen = () => {
  const router = useRouter();
  const { bidId } = useLocalSearchParams();
  const { request, isLoading, error } = useApi();

  // State for StatusModal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    status: '',
    title: '',
    message: '',
    primaryActionLabel: 'OK'
  });

 
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [bidData, setBidData] = useState(null);
  const [currentBidStatus, setCurrentBidStatus] = useState('pending');

  // Fetch bid details on component mount
  useEffect(() => {
    fetchBidDetails();
    console.log('Bid ID:', bidId);
  }, [bidId]);

  const fetchBidDetails = async () => {
    try {
      const response = await request(api.get(`/poster/bidDetails/${bidId}`));
      
      if (response.ok) {
        setBidData(response.data);
        setCurrentBidStatus(response.data.bidStatus?.toLowerCase() || 'pending');
      } else {
        handleApiError(response.error);
      }
    } catch (err) {
      console.error('Error fetching bid details:', err);
      showErrorModal('Failed to load bid details. Please try again.');
    }
  };

  // Consistent error handler
  const handleApiError = (error) => {
    console.log('API Error:', error);
    
    switch (error?.status) {
      case 401:
        showUnauthorizedModal();
        break;
      case 403:
        showErrorModal(error.detail || "You don't have permission to view this bid.");
        break;
      case 404:
        showErrorModal(error.detail || "Bid not found.");
        break;
      case 500:
        showErrorModal("Server error. Please try again later.");
        break;
      default:
        showErrorModal(error?.detail || "Failed to load bid details. Please try again.");
    }
  };

  const showErrorModal = (errorMessage) => {
    setModalConfig({
      status: 'error',
      title: 'Error',
      message: errorMessage,
      primaryActionLabel: 'Try Again'
    });
    setModalVisible(true);
  };

  const showSuccessModal = (title, message) => {
    setModalConfig({
      status: 'success',
      title: title,
      message: message,
      primaryActionLabel: 'OK'
    });
    setModalVisible(true);
  };

  const showUnauthorizedModal = () => {
    setModalConfig({
      status: 401,
      title: 'Session Expired',
      message: 'Please sign in again to continue.',
      primaryActionLabel: 'Sign In'
    });
    setModalVisible(true);
  };

  const showConfirmationModal = (action) => {
    const actionConfig = {
      accept: {
        title: 'Accept Bid',
        message: `Are you sure you want to accept ${bidData.seekerName}'s bid for ${bidData.bidAmount}?`,
        status: 'confirm',
        primaryActionLabel: 'Yes, Accept'
      },
      reject: {
        title: 'Reject Bid',
        message: `Are you sure you want to reject ${bidData.seekerName}'s bid?`,
        status: 'confirm',
        primaryActionLabel: 'Yes, Reject'
      }
    };

    setModalConfig({
      ...actionConfig[action],
      action: action // Store the action for later use
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    // Reset action state when modal closes
    setIsAccepting(false);
    setIsRejecting(false);
  };

  const handleModalPrimaryAction = () => {
    if (modalConfig.status === 'confirm') {
      // Execute the confirmed action
      if (modalConfig.action === 'accept') {
        handleAcceptBidConfirmed();
      } else if (modalConfig.action === 'reject') {
        handleRejectBidConfirmed();
      }
    } else if (modalConfig.status === 401) {
      setModalVisible(false);
      router.replace('/auth/login');
    } else if (modalConfig.status === 'error') {
      setModalVisible(false);
      fetchBidDetails();
    } else {
      setModalVisible(false);
    }
  };

  const handleAcceptBid = () => {
    showConfirmationModal('accept');
  };

  const handleRejectBid = () => {
    showConfirmationModal('reject');
  };

  const handleAcceptBidConfirmed = async () => {
    setIsAccepting(true);
    setModalVisible(false);
    
    try {
      const response = await request(api.post(`/poster/${bidId}/accept`));
      
      if (response.ok) {
        setCurrentBidStatus('accepted');
        showSuccessModal(
          'Bid Accepted!', 
          `You have accepted ${bidData.seekerName}'s bid.`
        );
        // Refresh bid data to get updated status
        fetchBidDetails();
      } else {
        handleApiError(response.error);
      }
    } catch (err) {
      console.error('Error accepting bid:', err);
      showErrorModal('Failed to accept bid. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectBidConfirmed = async () => {
    setIsRejecting(true);
    setModalVisible(false);
    
    try {
      const response = await request(api.post(`/poster/${bidId}/reject`));
      
      if (response.ok) {
        setCurrentBidStatus('rejected');
        showSuccessModal(
          'Bid Rejected!', 
          `You have rejected ${bidData.seekerName}'s bid.`
        );
        // Refresh bid data to get updated status
        fetchBidDetails();
      } else {
        handleApiError(response.error);
      }
    } catch (err) {
      console.error('Error rejecting bid:', err);
      showErrorModal('Failed to reject bid. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleOpenLink = async (url) => {
    // Ensure URL has proper protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const supported = await Linking.canOpenURL(formattedUrl);
    if (supported) {
      await Linking.openURL(formattedUrl);
    } else {
      Alert.alert('Error', `Cannot open URL: ${formattedUrl}`);
    }
  };

  const getStatusColor = () => {
    switch (currentBidStatus) {
      case 'accepted': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusText = () => {
    switch (currentBidStatus) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Under Review';
    }
  };

  const getCommunicationIcon = () => {
    switch (bidData?.communicationPreference) {
      case 'WhatsApp': return 'logo-whatsapp';
      case 'Chat': return 'chatbubble-outline';
      case 'Video Call': return 'videocam-outline';
      case 'Email': return 'mail-outline';
      default: return 'chatbubble-outline';
    }
  };

  const getCommunicationColor = () => {
    switch (bidData?.communicationPreference) {
      case 'WhatsApp': return '#25D366';
      case 'Chat': return '#6366F1';
      case 'Video Call': return '#8B5CF6';
      case 'Email': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getCompletionStatus = () => {
    const canComplete = bidData?.canCompleteInTime ?? false;
    return canComplete ? 
      { text: 'Can complete on time', color: '#10B981', icon: 'checkmark-circle' } :
      { text: 'May need more time', color: '#EF4444', icon: 'time-outline' };
  };

  const completionStatus = getCompletionStatus();

  // Check if any action is in progress
  const isActionInProgress = isAccepting || isRejecting || isLoading;

  // Render loading state within the same layout
  const renderContent = () => {
    if (isLoading && !bidData) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-600 mt-4">Loading bid details...</Text>
        </View>
      );
    }

    if (error && !bidData) {
      return (
        <View className="flex-1 justify-center items-center py-20 px-6">
          <Ionicons name="document-text-outline" size={64} color="#94a3b8" />
          <Text className="text-slate-600 text-lg text-center mb-4">
            Failed to load bid details
          </Text>
          <TouchableOpacity 
            onPress={fetchBidDetails}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!bidData) {
      return (
        <View className="flex-1 justify-center items-center py-20 px-6">
          <Ionicons name="document-text-outline" size={64} color="#94a3b8" />
          <Text className="text-slate-600 text-lg text-center">
            No bid data found
          </Text>
        </View>
      );
    }

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 space-y-6">
          {/* Seeker Profile Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
            <View className="flex-row items-start">
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-16 h-16 rounded-full items-center justify-center mr-4 shadow-sm overflow-hidden"
              >
                <Text className="text-white text-2xl font-bold">
                  {bidData.seekerName?.charAt(0) || 'U'}
                </Text>
              </LinearGradient>

              <View className="flex-1">
                <Text className="text-2xl font-bold text-slate-800 mb-1">
                  {bidData.seekerName || 'Unknown User'}
                </Text>
                <Text className="text-slate-500 text-base mb-3">
                  {bidData.tagline || 'No tagline provided'}
                </Text>

                <View className="flex-row items-center space-x-4 mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-slate-700 text-sm font-semibold ml-1">
                      {bidData.rating || '0.0'}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-done" size={16} color="#10B981" />
                    <Text className="text-slate-700 text-sm font-semibold ml-1">
                      {bidData.completedTasks || 0} tasks
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time" size={16} color="#3B82F6" />
                    <Text className="text-slate-700 text-sm font-semibold ml-1">
                      {bidData.responseTime || 'Not specified'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Bio Section */}
            {bidData.bio && (
              <View className="bg-slate-50 rounded-xl p-3 border border-slate-200 mt-3">
                <Text className="text-slate-600 text-sm leading-5">
                  {bidData.bio}
                </Text>
              </View>
            )}
          </View>

          {/* Bid Details Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">Bid Details</Text>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Bid Amount</Text>
                <Text className="text-green-600 text-2xl font-bold">{bidData.bidAmount || 'N/A'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Timeline</Text>
                <Text className="text-slate-800 text-xl font-bold">{bidData.timeline || 'N/A'}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Success Rate</Text>
                <Text className="text-slate-800 text-lg font-bold">{bidData.successRate || 'N/A'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-semibold mb-1">Member Since</Text>
                <Text className="text-slate-800 text-lg font-bold">{formatDate(bidData.memberSince) || 'N/A'}</Text>
              </View>
            </View>

            {/* Completion Status */}
            <View className="flex-row items-center bg-slate-50 rounded-xl p-3 border border-slate-200">
              <Ionicons name={completionStatus.icon} size={20} color={completionStatus.color} />
              <Text style={{ color: completionStatus.color }} className="text-sm font-semibold ml-2">
                {completionStatus.text}
              </Text>
            </View>
          </View>

          {/* Proposal Card */}
          {bidData.proposal && (
            <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
              <Text className="text-lg font-bold text-slate-800 mb-4">Proposal</Text>
              <Text className="text-slate-700 leading-6 text-base">
                {bidData.proposal}
              </Text>
            </View>
          )}

          {/* Similar Work Links */}
          {bidData.similarWorkLinks && bidData.similarWorkLinks.length > 0 && (
            <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
              <Text className="text-lg font-bold text-slate-800 mb-4">Similar Work</Text>
              <View className="space-y-2">
                {bidData.similarWorkLinks.map((link, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleOpenLink(link)}
                    className="flex-row items-center bg-slate-50 rounded-xl p-3 border border-slate-200"
                  >
                    <Ionicons name="link" size={18} color="#6366F1" />
                    <Text className="text-blue-600 text-sm font-semibold ml-2 flex-1" numberOfLines={1}>
                      {link}
                    </Text>
                    <Ionicons name="open-outline" size={16} color="#6366F1" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Communication Preference */}
          {bidData.communicationPreference && (
            <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
              <Text className="text-lg font-bold text-slate-800 mb-4">Communication</Text>
              <View className="flex-row items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200">
                <View className="flex-row items-center">
                  <Ionicons name={getCommunicationIcon()} size={24} color={getCommunicationColor()} />
                  <View className="ml-3">
                    <Text className="text-slate-800 font-semibold text-base">
                      {bidData.communicationPreference}
                    </Text>
                    <Text className="text-slate-600 text-sm">
                      {bidData.communicationDetail || 'No details provided'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="bg-blue-50 px-3 py-2 rounded-lg">
                  <Text className="text-blue-600 text-sm font-semibold">Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Skills Card */}
          {bidData.skills && bidData.skills.length > 0 && (
            <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
              <Text className="text-lg font-bold text-slate-800 mb-4">Skills & Expertise</Text>
              <View className="flex-row flex-wrap">
                {bidData.skills.map((skill, index) => (
                  <View key={index} className="bg-blue-50 px-3 py-2 rounded-full mr-2 mb-2 border border-blue-100">
                    <Text className="text-blue-700 text-sm font-semibold">{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Portfolio Card */}
          {bidData.portfolio && (
            <View className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200 border border-slate-100">
              <Text className="text-lg font-bold text-slate-800 mb-4">Portfolio</Text>
              <TouchableOpacity 
                onPress={() => handleOpenLink(bidData.portfolio)}
                className="flex-row items-center bg-slate-50 rounded-xl p-3 border border-slate-200"
              >
                <Ionicons name="link" size={20} color="#6366f1" />
                <Text className="text-blue-600 text-base font-semibold ml-2">
                  {bidData.portfolio}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Spacer for buttons */}
          <View className="h-24" />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header - Always visible */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
          >
            <Ionicons name="chevron-back" size={20} color="#64748b" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-800">Bid Details</Text>
            <Text className="text-slate-500 text-sm">Review proposal carefully</Text>
          </View>
          {bidData && (
            <View style={{ backgroundColor: `${getStatusColor()}15` }} className="px-3 py-1 rounded-full">
              <Text style={{ color: getStatusColor() }} className="text-xs font-bold">
                {getStatusText()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Content area - shows loading/error/data */}
      {renderContent()}

      {/* Action Buttons - Only show when we have data */}
      {bidData && (
        <View className="bg-white border-t border-slate-200 px-4 py-3">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleRejectBid}
              className={`flex-1 py-3 rounded-xl items-center justify-center flex-row space-x-2 ${
                currentBidStatus === 'rejected'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-white border border-slate-300'
              }`}
              disabled={currentBidStatus === 'accepted' || isActionInProgress}
            >
              {isRejecting ? (
                <ActivityIndicator size="small" color="#64748B" />
              ) : (
                <>
                  <Ionicons
                    name={currentBidStatus === 'rejected' ? 'close-circle' : 'close-outline'}
                    size={18}
                    color={currentBidStatus === 'rejected' ? '#DC2626' : '#64748B'}
                  />
                  <Text className={`text-sm font-semibold ${
                    currentBidStatus === 'rejected' ? 'text-red-700' : 'text-slate-600'
                  }`}>
                    {currentBidStatus === 'rejected' ? 'Rejected' : 'Reject'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAcceptBid}
              className={`flex-1 py-3 rounded-xl items-center justify-center flex-row space-x-2 ${
                currentBidStatus === 'accepted'
                  ? 'bg-green-600'
                  : 'bg-green-500'
              }`}
              disabled={currentBidStatus === 'rejected' || isActionInProgress}
              style={{ opacity: (currentBidStatus === 'rejected' || isActionInProgress) ? 0.6 : 1 }}
            >
              {isAccepting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={currentBidStatus === 'accepted' ? 'checkmark-done' : 'checkmark'}
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text className="text-white font-semibold text-sm">
                    {currentBidStatus === 'accepted' ? 'Accepted' : 'Accept'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

     
      <StatusModal
        visible={modalVisible}
        onClose={handleModalClose}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        primaryActionLabel={modalConfig.primaryActionLabel}
        onPrimaryAction={handleModalPrimaryAction}
        showCloseButton={modalConfig.status !== 401 && modalConfig.status !== 'confirm'}
        secondaryActionLabel={modalConfig.status === 'confirm' ? 'Cancel' : null}
        onSecondaryAction={modalConfig.status === 'confirm' ? handleModalClose : null}
      />
    </SafeAreaView>
  );
};

export default BidDetailScreen;

