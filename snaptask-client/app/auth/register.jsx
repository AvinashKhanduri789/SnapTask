import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../_layout';
import { api } from "../../util/requester";
import { useApi } from "../../util/useApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'POSTER'
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef({});
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const router = useRouter();
  const { request } = useApi();
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
 const handleRegister = async () => {
  const { username, email, phone, password, role } = formData;

  if (!username || !email || !phone || !password || !confirmPassword) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }
  if (!isValidEmail(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }
  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters long');
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }
  if (!role) {
    Alert.alert('Error', 'Please select a role');
    return;
  }
  if (!isTermsAccepted) {
    Alert.alert('Error', 'Please accept the terms and conditions');
    return;
  }

   setIsLoading(true);

  try {
    const body = {
      userName: username,
      email,
      phone,
      password,
      role,
    };

    console.log("📡 Sending registration:", body);

    // ✅ useApi hook + centralized interceptor handling
    const { ok, data, error } = await request(api.post("/auth/signup", body));

    if (!ok) {
      // 🔥 Since interceptor normalized errors already
      Alert.alert(
        error?.title || "Registration Failed",
        error?.detail || "Unable to create account. Please try again."
      );
      return;
    }

    console.log("✅ User registered:", data);

    await AsyncStorage.setItem("pendingVerificationEmail", email);
    // Alert.alert("Success", "Account created successfully!");
    router.push("/auth/validate");

  } catch (err) {
    
    Alert.alert("Error", "Something went wrong. Please try again.");
    console.error("❌ Unexpected error:", err);
  } finally {
    setIsLoading(false);
  }
};


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const buttonScale = new Animated.Value(1);
  const inputScale = new Animated.Value(1);
  const animatePress = (scaleValue) => {
    Animated.spring(scaleValue, { toValue: 0.95, friction: 3, useNativeDriver: true }).start();
  };
  const animateRelease = (scaleValue) => {
    Animated.spring(scaleValue, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };
  const animateInputFocus = () => {
    Animated.spring(inputScale, { toValue: 1.02, friction: 3, useNativeDriver: true }).start();
  };
  const animateInputBlur = () => {
    Animated.spring(inputScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };
  const handleFocus = (field) => {
    setFocusedField(field);
    animateInputFocus();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handleBlur = () => {
    setFocusedField('');
    animateInputBlur();
  };
  const getInputContainerStyle = (fieldName) => ({
    transform: [{ scale: focusedField === fieldName ? inputScale : 1 }],
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: focusedField === fieldName ? '#6366F1' : '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: focusedField === fieldName ? '#f8faff' : '#ffffff',
    shadowColor: focusedField === fieldName ? "#6366F1" : "#000",
    shadowOffset: {
      width: 0,
      height: focusedField === fieldName ? 6 : 2,
    },
    shadowOpacity: focusedField === fieldName ? 0.15 : 0.05,
    shadowRadius: focusedField === fieldName ? 12 : 4,
    elevation: focusedField === fieldName ? 6 : 2,
  });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <LinearGradient
                colors={["#6366F1", "#3B82F6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  shadowColor: '#6366F1',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 12
                }}
              >
                <Ionicons name="person-add-outline" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#1f2937', marginBottom: 8, letterSpacing: -0.5 }}>Create Your Account</Text>
              <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', lineHeight: 24 }}>Join our community and start your journey</Text>
            </View>
            {/* Username */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10, letterSpacing: -0.2 }}>Username</Text>
              <Animated.View style={getInputContainerStyle('username')}>
                <Ionicons name="person-outline" size={22} color={focusedField === 'username' ? '#6366F1' : '#9ca3af'} />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingLeft: 12,
                    fontSize: 16,
                    color: '#111827',
                    fontWeight: '500'
                  }}
                  ref={(ref) => inputRefs.current.username = ref}
                  onSubmitEditing={() => inputRefs.current.email.focus()}
                  placeholder="Enter your username"
                  placeholderTextColor="#9ca3af"
                  value={formData.username}
                  onChangeText={(v) => handleInputChange('username', v)}
                  onFocus={() => handleFocus('username')}
                  onBlur={handleBlur}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </Animated.View>
            </View>
            {/* Email */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10, letterSpacing: -0.2 }}>Email Address</Text>
              <Animated.View style={getInputContainerStyle('email')}>
                <Ionicons name="mail-outline" size={22} color={focusedField === 'email' ? '#6366F1' : '#9ca3af'} />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingLeft: 12,
                    fontSize: 16,
                    color: '#111827',
                    fontWeight: '500'
                  }}
                  placeholder="your@email.com"
                  placeholderTextColor="#9ca3af"
                  value={formData.email}
                  onChangeText={(v) => handleInputChange('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  returnKeyType="next"
                  ref={(ref) => inputRefs.current.email = ref}
                  onSubmitEditing={() => inputRefs.current.phone.focus()}
                />
              </Animated.View>
            </View>
            {/* Phone */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10, letterSpacing: -0.2 }}>Phone Number</Text>
              <Animated.View style={getInputContainerStyle('phone')}>
                <Ionicons name="call-outline" size={22} color={focusedField === 'phone' ? '#6366F1' : '#9ca3af'} />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingLeft: 12,
                    fontSize: 16,
                    color: '#111827',
                    fontWeight: '500'
                  }}
                  placeholder="Your phone number"
                  placeholderTextColor="#9ca3af"
                  value={formData.phone}
                  onChangeText={(v) => handleInputChange('phone', v)}
                  keyboardType="phone-pad"
                  onFocus={() => handleFocus('phone')}
                  onBlur={handleBlur}
                  returnKeyType="next"
                  ref={(ref) => inputRefs.current.phone = ref}
                  onSubmitEditing={() => inputRefs.current.role.focus()}
                />
              </Animated.View>
            </View>
            {/* Account Type Dropdown */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10, letterSpacing: -0.2 }}>Account Type</Text>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity
                  ref={(ref) => inputRefs.current.role = ref}
                  onSubmitEditing={() => inputRefs.current.password.focus()}
                  activeOpacity={0.8}
                  onPress={() => {
                    setDropdownOpen(!dropdownOpen);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 3,
                    borderColor: dropdownOpen ? '#6366F1' : '#e5e7eb',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    backgroundColor: dropdownOpen ? '#f8faff' : '#ffffff',
                    shadowColor: dropdownOpen ? "#6366F1" : "#000",
                    shadowOffset: {
                      width: 0,
                      height: dropdownOpen ? 6 : 2,
                    },
                    shadowOpacity: dropdownOpen ? 0.15 : 0.05,
                    shadowRadius: dropdownOpen ? 12 : 4,
                    elevation: dropdownOpen ? 6 : 2,
                    justifyContent: 'space-between'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="briefcase-outline" size={22} color={dropdownOpen ? '#6366F1' : '#9ca3af'} />
                    <Text style={{
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#111827',
                      fontWeight: '600'
                    }}>
                      {formData.role === 'SEEKER' ? 'Job Seeker' : 'Job Poster'}
                    </Text>
                  </View>
                  <Ionicons
                    name={dropdownOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={20}
                    color={dropdownOpen ? '#6366F1' : '#9ca3af'}
                  />
                </TouchableOpacity>
                {dropdownOpen && (
                  <View style={{
                    position: 'absolute',
                    top: 58,
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderWidth: 3,
                    borderColor: '#e5e7eb',
                    borderRadius: 16,
                    overflow: 'hidden',
                    zIndex: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 6,
                  }}>
                    {["SEEKER", "POSTER"].map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => {
                          setDropdownOpen(false);
                          handleInputChange("role", opt); // store "SEEKER" or "POSTER"
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                        style={{
                          paddingVertical: 16,
                          paddingHorizontal: 16,
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor:
                            formData.role === opt ? "#f3f4f6" : "#ffffff",
                          borderBottomWidth: opt !== "POSTER" ? 1 : 0,
                          borderBottomColor: "#f3f4f6",
                        }}
                      >
                        <Ionicons
                          name={opt === "SEEKER" ? "person-outline" : "briefcase-outline"}
                          size={20}
                          color={formData.role === opt ? "#6366F1" : "#6b7280"}
                        />
                        <Text
                          style={{
                            marginLeft: 12,
                            fontSize: 15,
                            color: formData.role === opt ? "#6366F1" : "#374151",
                            fontWeight: formData.role === opt ? "700" : "500",
                          }}
                        >
                          {opt === "SEEKER" ? "Job Seeker" : "Job Poster"}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  </View>
                )}
              </View>
            </View>
            {/* Password */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10, letterSpacing: -0.2 }}>Password</Text>
              <Animated.View style={getInputContainerStyle('password')}>
                <Ionicons name="key-outline" size={22} color={focusedField === 'password' ? '#6366F1' : '#9ca3af'} />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingLeft: 12,
                    fontSize: 16,
                    color: '#111827',
                    fontWeight: '500'
                  }}
                  placeholder="Create a password"
                  placeholderTextColor="#9ca3af"
                  value={formData.password}
                  onChangeText={(v) => handleInputChange('password', v)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  returnKeyType="next"
                  ref={(ref) => inputRefs.current.password = ref}
                  onSubmitEditing={() => inputRefs.current.confirmPassword.focus()}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(!showPassword);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{ padding: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={focusedField === 'password' ? '#6366F1' : '#6b7280'}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
            {/* Confirm Password */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10, letterSpacing: -0.2 }}>Confirm Password</Text>
              <Animated.View style={getInputContainerStyle('confirmPassword')}>
                <Ionicons name="shield-checkmark-outline" size={22} color={focusedField === 'confirmPassword' ? '#6366F1' : '#9ca3af'} />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingLeft: 12,
                    fontSize: 16,
                    color: '#111827',
                    fontWeight: '500'
                  }}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={(v) => setConfirmPassword(v)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleBlur}
                  returnKeyType="done"
                  ref={(ref) => inputRefs.current.confirmPassword = ref}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{ padding: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={focusedField === 'confirmPassword' ? '#6366F1' : '#6b7280'}
                  />
                </TouchableOpacity>
              </Animated.View>
              {!!confirmPassword && formData.password !== confirmPassword && (
                <Text style={{ marginTop: 8, color: '#DC2626', fontSize: 13, fontWeight: '600' }}>⚠️ Passwords do not match</Text>
              )}
            </View>
            {/* Terms and Conditions */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                marginTop: 16,
                padding: 12,
                borderRadius: 12,
                backgroundColor: isTermsAccepted ? '#f0f4ff' : 'transparent',
                borderWidth: 2,
                borderColor: isTermsAccepted ? '#6366F1' : '#e5e7eb'
              }}
              onPress={() => {
                setIsTermsAccepted(!isTermsAccepted);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: isTermsAccepted ? '#6366F1' : '#9ca3af',
                backgroundColor: isTermsAccepted ? '#6366F1' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                {isTermsAccepted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={{ color: '#6b7280', fontSize: 14, flex: 1, fontWeight: '500' }}>
                I agree to the <Text style={{ color: '#6366F1', fontWeight: '700' }}>Terms of Service</Text> and <Text style={{ color: '#6366F1', fontWeight: '700' }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {/* Register Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPressIn={() => animatePress(buttonScale)}
                onPressOut={() => animateRelease(buttonScale)}
                onPress={async () => {
                  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  handleRegister();
                }}
                disabled={isLoading || !isTermsAccepted}
                activeOpacity={0.9}
                style={{
                  borderRadius: 16,
                  width: '100%',
                  shadowColor: '#6366F1',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 12
                }}
              >
                <LinearGradient
                  colors={isLoading || !isTermsAccepted ? ['#c7d2fe', '#dbeafe'] : ['#6366F1', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 18,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    opacity: isLoading ? 0.9 : 1
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="person-add-outline" size={22} color="#fff" />
                      <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 12, letterSpacing: -0.2 }}>Create Account</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            {/* Footer */}
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500' }}>
                Already have an account? <Text style={{ color: '#6366F1', fontWeight: '700' }}>Sign In</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default RegisterPage;