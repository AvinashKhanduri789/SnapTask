import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../util/requester";
import { useApi } from "../../../util/useApi";
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import BasicInfoStep from "../../../components/poster/TaskPageComponents/BasicInfoStep";
import CategoryStep from '../../../components/poster/TaskPageComponents/CategoryStep';
import PaymentStep from '../../../components/poster/TaskPageComponents/PaymentStep';
import PreviewStep from '../../../components/poster/TaskPageComponents/PreviewStep';

const NewTaskPage = ({ navigation, onTaskCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: null,
    isPaid: true,
    budget: '',
    mode: 'REMOTE'
  });

  const { request, data, isLoading, error } = useApi();
  const route = useRouter();

  const steps = [
    { id: 1, title: 'Basic Info' },
    { id: 2, title: 'Category & Deadline' },
    { id: 3, title: 'Payment' },
    { id: 4, title: 'Preview' },
  ];

  // Handle back button press
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      route.back();
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskCreated = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      mode: formData.mode,
      deadline: formData.deadline,
      isUnpaid: !formData.isPaid,
      budget: parseFloat(formData.budget) || 0,
    };

    const response = await request(api.post("/poster/create", payload));

    if (response.ok) {
      
      Alert.alert(
        "Success!",
        "Your task has been posted successfully 🎉",
        [
          {
            text: "OK",
            onPress: () => {
              onTaskCreated?.({
                status: response.status,  
                title: "Success",
                message: "Task posted successfully ",
              });
              route.back();
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Error",
        response.error?.detail || response.error?.message || "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleSubmit = () => {
    handleTaskCreated(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            screenWidth={SCREEN_WIDTH}
          />
        );
      case 2:
        return (
          <CategoryStep 
            formData={formData} 
            updateFormData={updateFormData} 
            screenWidth={SCREEN_WIDTH}
          />
        );
      case 3:
        return (
          <PaymentStep 
            formData={formData} 
            updateFormData={updateFormData} 
            screenWidth={SCREEN_WIDTH}
          />
        );
      case 4:
        return (
          <PreviewStep 
            formData={formData} 
            screenWidth={SCREEN_WIDTH}
          />
        );
      default:
        return null;
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#ffffff',
      }}>
        <TouchableOpacity 
          onPress={handleBack}
          style={{
            padding: 8,
            marginRight: 12,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '700', 
            color: '#1a1a1a',
            marginBottom: 4,
          }}>
            Create New Task
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#666',
          }}>
            Step {currentStep} of {steps.length} • {steps[currentStep - 1]?.title}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{
        height: 4,
        backgroundColor: '#f0f0f0',
        width: '100%',
      }}>
        <View style={{
          height: '100%',
          backgroundColor: '#007AFF',
          width: `${progressPercentage}%`,
          borderRadius: 2,
        }} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, padding: 20 }}>
            {renderStep()}
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={{
          padding: 20,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            
            {/* Back Button - Show only if not on first step */}
            {currentStep > 1 && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  backgroundColor: '#f8f8f8',
                  borderRadius: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                }}
                onPress={prevStep}
                disabled={isLoading}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#666',
                }}>
                  Back
                </Text>
              </TouchableOpacity>
            )}

            {/* Next/Submit Button */}
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 16,
                backgroundColor: isLoading ? '#ccc' : '#007AFF',
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={currentStep === steps.length ? handleSubmit : nextStep}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}>
                    Posting...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}>
                    {currentStep === steps.length ? 'Post Task' : 'Next'}
                  </Text>
                  {currentStep === steps.length && (
                    <Ionicons name="send" size={16} color="#ffffff" />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            padding: 24,
            borderRadius: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
            minWidth: 200,
          }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: '#333', 
              marginTop: 16,
              textAlign: 'center',
            }}>
              Creating your task...
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: '#666', 
              marginTop: 8,
              textAlign: 'center',
            }}>
              Please wait a moment
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NewTaskPage;