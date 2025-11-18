import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions,
  Animated 
} from 'react-native';

import BasicInfoStep from '../TaskPageComponents/BasicInfoStep';
import CategoryStep from '../TaskPageComponents/CategoryStep';
import PaymentStep from '../TaskPageComponents/PaymentStep';
import PreviewStep from '../TaskPageComponents/PreviewStep';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const NewTaskForm = ({ onTaskCreated, isLoading = false, isInBottomSheet = false }) => {
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

  const steps = [
    { id: 1, title: 'Basic Info' },
    { id: 2, title: 'Category & Deadline' },
    { id: 3, title: 'Payment' },
    { id: 4, title: 'Preview' },
  ];

  // -----------------------------
  // SMOOTH ANIMATED PROGRESS BAR
  // -----------------------------
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [1, steps.length],
    outputRange: ["0%", "100%"]
  });

  // -----------------------------
  // STEP CONTROLS
  // -----------------------------
  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onTaskCreated) onTaskCreated(formData);
  };

  // -----------------------------
  // STEP RENDERING
  // -----------------------------
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ 
        flex: 1, 
        backgroundColor: '#ffffff',
        width: '100%',
      }}
    >
      {/* HEADER */}
      <View style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.05),
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: SCREEN_WIDTH < 375 ? 13 : 14, 
            color: '#64748b',
            textAlign: 'center'
          }}>
            Step {currentStep} of {steps.length} • {steps[currentStep - 1]?.title}
          </Text>
        </View>
      </View>

      {/* PROGRESS BAR */}
      <View style={{ 
        width: '100%', 
        paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.05), 
        paddingVertical: 12, 
        backgroundColor: '#f8fafc' 
      }}>
        <View style={{ 
          width: '100%', 
          backgroundColor: '#e2e8f0', 
          borderRadius: 10, 
          height: 6,
          overflow: 'hidden'
        }}>
          <Animated.View
            style={{
              backgroundColor: '#6366f1',
              height: 6,
              borderRadius: 10,
              width: progressWidth,
            }}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, width: '100%', paddingBottom: 16 }}>
          {renderStep()}
        </View>
      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={{
        width: '100%',
        paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.05),
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9'
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

          {/* BACK BUTTON */}
          {currentStep > 1 ? (
            <TouchableOpacity
              style={{
                paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.04),
                paddingVertical: 16,
                borderWidth: 2,
                borderColor: '#cbd5e1',
                borderRadius: 12,
                flex: 1,
                marginRight: 12,
                alignItems: 'center',
                minHeight: 56
              }}
              onPress={prevStep}
            >
              <Text style={{ 
                color: '#64748b', 
                fontWeight: '600', 
                fontSize: SCREEN_WIDTH < 375 ? 15 : 16 
              }}>
                Back
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1, marginRight: 12 }} />
          )}

          {/* NEXT OR SUBMIT */}
          {currentStep < steps.length ? (
            <TouchableOpacity
              style={{
                backgroundColor: '#6366f1',
                paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.04),
                paddingVertical: 16,
                borderRadius: 12,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
                minHeight: 56
              }}
              onPress={nextStep}
            >
              <Text style={{ 
                color: '#ffffff', 
                fontWeight: '600', 
                fontSize: SCREEN_WIDTH < 375 ? 15 : 16 
              }}>
                Next
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: '#3B82F6',
                paddingVertical: 16,
                paddingHorizontal: Math.max(20, SCREEN_WIDTH * 0.04),
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
                flexDirection: 'row',
                gap: 8,
                flex: 1,
                minHeight: 56
              }}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={{
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: SCREEN_WIDTH < 375 ? 15 : 16,
                    letterSpacing: 0.5,
                  }}>
                    Posting...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="rocket" size={SCREEN_WIDTH < 375 ? 18 : 20} color="#ffffff" />
                  <Text style={{
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: SCREEN_WIDTH < 375 ? 15 : 16,
                    letterSpacing: 0.5,
                  }}>
                    Post Task
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewTaskForm;
