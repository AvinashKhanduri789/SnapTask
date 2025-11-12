import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApi } from "../../../util/useApi";
import { api } from "../../../util/requester";
import StatusModal from "../../../components/common/StatusModal";

const MakeBidScreen = () => {
  
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef(null);
  const { request, isLoading, error } = useApi();

  // State for StatusModal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    status: '',
    title: '',
    message: '',
    primaryActionLabel: 'OK'
  });

  useEffect(() => {
    console.log("task id in make bid screen --> ", id);
  }, [id]);

  const [formData, setFormData] = useState({
    tagline: "",
    bidAmount: "",
    proposal: "",
    similarWorks: [""],
    portfolio: [""], 
    canCompleteInTime: false,
    communicationPreference: "",
    communicationDetail: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const communicationOptions = ["In-app Chat", "Email", "Phone Call"];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAddLink = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleUpdateLink = (field, index, value) => {
    const updatedLinks = [...formData[field]];
    updatedLinks[index] = value;
    setFormData((prev) => ({
      ...prev,
      [field]: updatedLinks,
    }));
  };

  const handleRemoveLink = (field, index) => {
    if (formData[field].length > 1) {
      const updatedLinks = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [field]: updatedLinks,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.tagline.trim()) {
      errors.tagline = "Please add a tagline for your bid.";
    }

    if (!formData.bidAmount.trim() || isNaN(formData.bidAmount) || parseFloat(formData.bidAmount) <= 0) {
      errors.bidAmount = "Please enter a valid bid amount greater than zero.";
    }

    if (!formData.proposal.trim() || formData.proposal.length < 10) {
      errors.proposal = "Proposal must be at least 10 characters long.";
    }

    if (!formData.communicationPreference) {
      errors.communicationPreference = "Please select a communication preference.";
    }

    if (
      formData.communicationPreference !== "In-app Chat" &&
      !formData.communicationDetail.trim()
    ) {
      errors.communicationDetail = `Please provide your ${formData.communicationPreference} details.`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApiError = (error) => {
    console.log('API Error:', error);
    
    switch (error?.status) {
      case 401:
        showUnauthorizedModal();
        break;
      case 409:
        showErrorModal(error.detail || "You have already placed a bid on this task.");
        break;
      case 400:
        showErrorModal(error.detail || "Invalid request. Please check your input.");
        break;
      case 403:
        showErrorModal(error.detail || "You don't have permission to perform this action.");
        break;
      case 404:
        showErrorModal(error.detail || "Task not found.");
        break;
      case 500:
        showErrorModal("Server error. Please try again later.");
        break;
      default:
        showErrorModal(error?.detail || "An unexpected error occurred. Please try again.");
    }
  };

  const showSuccessModal = () => {
    setModalConfig({
      status: 'success',
      title: 'Bid Submitted!',
      message: 'Your bid has been submitted successfully. The task poster will review your proposal.',
      primaryActionLabel: 'Great!'
    });
    setModalVisible(true);
  };

  const showErrorModal = (errorMessage) => {
    setModalConfig({
      status: 'error',
      title: 'Submission Failed',
      message: errorMessage,
      primaryActionLabel: 'Try Again'
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

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalPrimaryAction = () => {
    setModalVisible(false);
    
    if (modalConfig.status === 'success') {
      router.back();
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      Alert.alert("Missing Information", "Please check the form for errors.");
      return;
    }

    const filteredSimilarWorks = formData.similarWorks.filter((link) => link.trim() !== "");
    const filteredPortfolio = formData.portfolio.filter((link) => link.trim() !== "");

    const bidData = {
      taskId: id,
      tagline: formData.tagline.trim(),
      proposal: formData.proposal.trim(),
      similarWorks: filteredSimilarWorks,
      portfolio: filteredPortfolio, 
      bidAmount: parseFloat(formData.bidAmount),
      canCompleteInTime: formData.canCompleteInTime,
      communicationPreference: formData.communicationPreference,
      communicationDetail: formData.communicationPreference !== "In-app Chat" 
        ? formData.communicationDetail.trim() 
        : "In-app Chat",
    };

    console.log("Submitting bid:", bidData);

    try {
      const response = await request(api.post('/seeker/makeBid', bidData));
      
      if (response.ok) {
        console.log('Bid submitted successfully:', response.data);
        showSuccessModal();
      } else {
        handleApiError(response.error);
      }
    } catch (err) {
      console.log('Bid submission error:', err);
      showErrorModal("Network error. Please check your connection and try again.");
    }
  };

  const getLabel = () => {
    switch (formData.communicationPreference) {
      case "Email":
        return "Your email address";
      case "Phone Call":
        return "Your phone number";
      case "In-app Chat":
        return "Preferred chat platform";
      default:
        return "Contact Detail";
    }
  };

  const getPlaceholder = () => {
    switch (formData.communicationPreference) {
      case "Email":
        return "example@email.com";
      case "Phone Call":
        return "+1 (555) 123-4567";
      case "In-app Chat":
        return "Slack, Discord, etc.";
      default:
        return "Enter details...";
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleInputFocus = (yOffset) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: yOffset,
        animated: true,
      });
    }, 300);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900">Submit Your Bid</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            className="flex-1 px-5 py-6"
            contentContainerStyle={{
              paddingBottom: 250,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Proposal Section */}
            <Text className="text-lg font-semibold text-gray-900 mb-4">Your Proposal</Text>

            {/* Tagline */}
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Tagline</Text>
              <TextInput
                className={`border rounded-xl p-4 text-gray-900 bg-white ${
                  validationErrors.tagline ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Experienced React Native Developer"
                placeholderTextColor="#9CA3AF"
                value={formData.tagline}
                onChangeText={(t) => updateFormData("tagline", t)}
                returnKeyType="next"
                editable={!isLoading}
              />
              {validationErrors.tagline && (
                <Text className="text-red-500 text-sm mt-1">{validationErrors.tagline}</Text>
              )}
            </View>

            {/* Bid Amount */}
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Bid Amount ($)</Text>
              <TextInput
                className={`border rounded-xl p-4 text-gray-900 bg-white ${
                  validationErrors.bidAmount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your bid amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.bidAmount}
                onChangeText={(t) => updateFormData("bidAmount", t)}
                onFocus={() => handleInputFocus(150)}
                returnKeyType="next"
                editable={!isLoading}
              />
              {validationErrors.bidAmount && (
                <Text className="text-red-500 text-sm mt-1">{validationErrors.bidAmount}</Text>
              )}
            </View>

            {/* Proposal */}
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Proposal</Text>
              <TextInput
                className={`border rounded-xl p-4 text-gray-900 bg-white h-40 ${
                  validationErrors.proposal ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe why you're the best fit for this task..."
                placeholderTextColor="#9CA3AF"
                value={formData.proposal}
                multiline
                textAlignVertical="top"
                onChangeText={(t) => updateFormData("proposal", t)}
                maxLength={500}
                onFocus={() => handleInputFocus(250)}
                editable={!isLoading}
              />
              <View className="flex-row justify-between mt-1">
                {validationErrors.proposal ? (
                  <Text className="text-red-500 text-sm">{validationErrors.proposal}</Text>
                ) : (
                  <View className="flex-1" />
                )}
                <Text className="text-gray-400 text-xs">
                  {formData.proposal.length}/500
                </Text>
              </View>
            </View>

            {/* Similar Works Links */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">
                Similar Works Links (Optional)
              </Text>
              {formData.similarWorks.map((link, i) => (
                <View key={`similar-${i}`} className="flex-row items-center mb-3">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-xl p-4 text-gray-900 bg-white"
                    placeholder="https://example.com/similar-work"
                    placeholderTextColor="#9CA3AF"
                    value={link}
                    onChangeText={(t) => handleUpdateLink("similarWorks", i, t)}
                    keyboardType="url"
                    autoCapitalize="none"
                    returnKeyType="next"
                    editable={!isLoading}
                  />
                  {formData.similarWorks.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveLink("similarWorks", i)}
                      className="ml-3 w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
                      disabled={isLoading}
                    >
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                onPress={() => handleAddLink("similarWorks")}
                className="flex-row items-center mt-2"
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Ionicons name="add" size={20} color="#3B82F6" />
                <Text className="text-blue-500 font-medium ml-2">Add similar work link</Text>
              </TouchableOpacity>
            </View>

             {/* Portfolio Link */}
<View className="mb-8">
  <Text className="text-gray-700 font-medium mb-3">
    Portfolio Link (Optional)
  </Text>
  <View className="flex-row items-center">
    <TextInput
      className="flex-1 border border-gray-300 rounded-xl p-4 text-gray-900 bg-white"
      placeholder="https://github.com/your-portfolio"
      placeholderTextColor="#9CA3AF"
      value={formData.portfolio[0] || ""}
      onChangeText={(t) => handleUpdateLink("portfolio", 0, t)}
      keyboardType="url"
      autoCapitalize="none"
      returnKeyType="next"
      editable={!isLoading}
    />
    {formData.portfolio[0] && (
      <TouchableOpacity
        onPress={() => handleUpdateLink("portfolio", 0, "")}
        className="ml-3 w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
        disabled={isLoading}
      >
        <Ionicons name="close" size={20} color="#6B7280" />
      </TouchableOpacity>
    )}
  </View>
</View>

            {/* Commitment */}
            <Text className="text-lg font-semibold text-gray-900 mb-4">Your Commitment</Text>
            <TouchableOpacity
              onPress={() => updateFormData("canCompleteInTime", !formData.canCompleteInTime)}
              className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8"
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <View
                className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
                  formData.canCompleteInTime
                    ? "border-green-500 bg-green-500"
                    : "border-gray-400 bg-white"
                }`}
              >
                {formData.canCompleteInTime && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text className="text-gray-700 font-medium flex-1">
                I can complete this task on time.
              </Text>
            </TouchableOpacity>

            {/* Communication */}
            <Text className="text-lg font-semibold text-gray-900 mb-2">Communication</Text>
            <Text className="text-gray-600 mb-4">How do you prefer to communicate?</Text>

            {/* Communication Options */}
            <View className="flex-row justify-between mb-6">
              {communicationOptions.map((opt) => {
                const active = formData.communicationPreference === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => updateFormData("communicationPreference", opt)}
                    className={`flex-1 mx-1 px-3 py-3 rounded-xl border ${
                      active ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
                    } ${validationErrors.communicationPreference ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  >
                    <Text
                      className={`text-center font-medium ${
                        active ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {validationErrors.communicationPreference && (
              <Text className="text-red-500 text-sm mb-4 -mt-2">{validationErrors.communicationPreference}</Text>
            )}

            {/* Communication Details */}
            {formData.communicationPreference && (
              <View className="mb-8">
                <Text className="text-gray-700 font-medium mb-2">{getLabel()}</Text>
                <TextInput
                  className={`border rounded-xl p-4 text-gray-900 bg-white ${
                    validationErrors.communicationDetail ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={getPlaceholder()}
                  placeholderTextColor="#9CA3AF"
                  value={formData.communicationDetail}
                  onChangeText={(t) => updateFormData("communicationDetail", t)}
                  onFocus={() => handleInputFocus(600)}
                  keyboardType={
                    formData.communicationPreference === "Email"
                      ? "email-address"
                      : formData.communicationPreference === "Phone Call"
                      ? "phone-pad"
                      : "default"
                  }
                  editable={!isLoading}
                />
                {validationErrors.communicationDetail && (
                  <Text className="text-red-500 text-sm mt-1">{validationErrors.communicationDetail}</Text>
                )}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-600 py-4 rounded-xl items-center justify-center mt-8 mb-24"
              activeOpacity={0.8}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white font-semibold text-lg">Submit Bid</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Status Modal */}
      <StatusModal
        visible={modalVisible}
        onClose={handleModalClose}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        primaryActionLabel={modalConfig.primaryActionLabel}
        onPrimaryAction={handleModalPrimaryAction}
        showCloseButton={modalConfig.status !== 401}
      />
    </SafeAreaView>
  );
};

export default MakeBidScreen;