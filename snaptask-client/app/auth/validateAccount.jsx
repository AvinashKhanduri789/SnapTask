import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useApi } from "../../util/useApi";
import { api } from "../../util/requester";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 900;

const ValidateAccount = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const buttonScale = useRef(new Animated.Value(1)).current;
  const hiddenInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const router = useRouter();
  const { request } = useApi();
  const mounted = useRef(true);
  const keyboardVisible = useRef(false);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (showOTP) {
      const t = setTimeout(() => {
        if (hiddenInputRef.current) {
          hiddenInputRef.current.focus();
        }
      }, 600);
      return () => clearTimeout(t);
    }
  }, [showOTP]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        keyboardVisible.current = true;
        setIsFocused(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        keyboardVisible.current = false;
        setIsFocused(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const animatePress = () => {
    Animated.spring(buttonScale, { toValue: 0.95, friction: 3, useNativeDriver: true }).start();
  };

  const animateRelease = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleEmailChange = (text) => {
    setEmail(text.trim());
  };

  const handleOTPChange = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
  };

  const handleSendOTP = async () => {
    if (isSending) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsSending(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const body = { email };
      const { ok, data, error } = await request(api.post("/auth/verify/resend-verification", body));

      if (!ok) throw error;

      // Save email for verification
      await AsyncStorage.setItem("pendingVerificationEmail", email);

      // Show OTP section and start resend timer
      setShowOTP(true);
      setResendTimer(RESEND_COOLDOWN);

      Alert.alert(
        "OTP Sent",
        "Verification code has been sent to your email address."
      );

    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.detail ||
        err?.message ||
        "Failed to send verification code. Please try again.";

      Alert.alert("Unable to send", msg);
    } finally {
      if (mounted.current) setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (isLoading) return;
    if (code.length !== OTP_LENGTH) {
      Alert.alert("Invalid Code", "Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const storedEmail = await AsyncStorage.getItem("pendingVerificationEmail");
      const verifyEmail = storedEmail || email;

      if (!verifyEmail) throw new Error("No email found for verification.");

      const body = { email: verifyEmail, otp: code };
      const { ok, data, error } = await request(api.post("/auth/verify", body));

      if (!ok) throw error;

      Alert.alert(
        data.title || "Success",
        data.detail || "Your account has been verified successfully 🎉"
      );

      await AsyncStorage.removeItem("pendingVerificationEmail");

      setTimeout(() => router.replace("/auth/login"), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.detail ||
        err?.message ||
        "Invalid or expired OTP.";

      Alert.alert("Verification Failed", msg);
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const storedEmail = await AsyncStorage.getItem("pendingVerificationEmail");
      const resendEmail = storedEmail || email;

      if (!resendEmail) {
        Alert.alert("Error", "No email found. Please enter your email again.");
        setShowOTP(false);
        return;
      }

      const body = { email: resendEmail };
      const { ok, data, error } = await request(api.post("/auth/verify/resend-verification", body));

      if (!ok) throw error;

      setResendTimer(RESEND_COOLDOWN);
      Alert.alert("OTP Resent", "New verification code has been sent to your email.");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.detail ||
        "Failed to resend verification code. Please try again.";
      Alert.alert("Resend Failed", msg);
    }
  };

  const focusHidden = () => {
    if (hiddenInputRef.current) {
      // Only focus if keyboard is not already visible
      if (!keyboardVisible.current) {
        hiddenInputRef.current.focus();
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderBox = (index) => {
    const char = code[index] || '';
    const focused = isFocused && index === Math.min(code.length, OTP_LENGTH - 1);
    const gradientColors = focused || char
      ? ['#6366F1', '#3B82F6']
      : ['#E5E7EB', '#E5E7EB'];
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={focusHidden}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 14, padding: 2 }}
        >
          <View style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', letterSpacing: 0 }}>
              {char}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
            paddingVertical: 20
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
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
                <Ionicons name="shield-checkmark-outline" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#1f2937', marginBottom: 8, letterSpacing: -0.5 }}>
                {showOTP ? 'Verify Your Account' : 'Verify Your Email'}
              </Text>
              <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', lineHeight: 24 }}>
                {showOTP
                  ? 'Enter the 6-digit code sent to your email'
                  : 'Enter your email to receive a verification code'
                }
              </Text>
            </View>

            {/* Email Input Section */}
            {!showOTP && (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Email Address
                </Text>
                <TextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="Enter your registered email"
                  placeholderTextColor="#9CA3AF"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2,
                    borderColor: '#E5E7EB',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: '#111827',
                    fontWeight: '500',
                  }}
                />
              </View>
            )}

            {/* OTP Section */}
            {showOTP && (
              <>
                {/* Email Display */}
                <View style={{ backgroundColor: '#F0F9FF', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E0F2FE' }}>
                  <Text style={{ fontSize: 14, color: '#0369A1', fontWeight: '600', textAlign: 'center' }}>
                    Code sent to: {email}
                  </Text>
                </View>

                {/* OTP Boxes */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                    Enter Verification Code
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {Array.from({ length: OTP_LENGTH }).map((_, i) => renderBox(i))}
                  </View>
                </View>

                {/* Transparent Touchable Area to Trigger Keyboard */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: 60,
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    opacity: 0,
                  }}
                  activeOpacity={1}
                  onPress={focusHidden}
                >
                  <View style={{ width: '100%', height: '100%' }} />
                </TouchableOpacity>

                {/* Hidden Input */}
                <View style={{
                  position: 'absolute',
                  width: '100%',
                  height: 60,
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  opacity: 0,
                }}>
                  <TextInput
                    ref={hiddenInputRef}
                    value={code}
                    onChangeText={handleOTPChange}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoComplete="one-time-code"
                    maxLength={OTP_LENGTH}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    showSoftInputOnFocus={true}
                    caretHidden={true}
                    contextMenuHidden={true}
                    underlineColorAndroid="transparent"
                    blurOnSubmit={false}
                    editable={true}
                    importantForAutofill="yes"
                    autoCorrect={false}
                    autoFocus={showOTP}
                  />
                </View>

                {/* Resend */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, marginTop: 8 }}>
                  <Text style={{ color: '#6b7280', fontSize: 14 }}>Didn't receive the code? </Text>
                  <TouchableOpacity
                    disabled={resendTimer > 0}
                    onPress={handleResend}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: resendTimer > 0 ? '#9ca3af' : '#6366F1', fontSize: 14, fontWeight: '700' }}>
                      {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : 'Resend'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Action Buttons */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              {!showOTP ? (
                // Send OTP Button
                <TouchableOpacity
                  onPressIn={animatePress}
                  onPressOut={animateRelease}
                  onPress={handleSendOTP}
                  disabled={isSending || !email}
                  activeOpacity={0.9}
                  style={{ borderRadius: 16, width: '100%', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 }}
                >
                  <LinearGradient
                    colors={isSending || !email ? ['#c7d2fe', '#dbeafe'] : ['#6366F1', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ paddingVertical: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', opacity: isSending ? 0.9 : 1 }}
                  >
                    {isSending ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Ionicons name="send-outline" size={22} color="#fff" />
                        <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 12, letterSpacing: -0.2 }}>Send OTP</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                // Verify Button
                <TouchableOpacity
                  onPressIn={animatePress}
                  onPressOut={animateRelease}
                  onPress={handleVerify}
                  disabled={isLoading || code.length !== OTP_LENGTH}
                  activeOpacity={0.9}
                  style={{ borderRadius: 16, width: '100%', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 }}
                >
                  <LinearGradient
                    colors={isLoading || code.length !== OTP_LENGTH ? ['#c7d2fe', '#dbeafe'] : ['#6366F1', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ paddingVertical: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', opacity: isLoading ? 0.9 : 1 }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                        <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 12, letterSpacing: -0.2 }}>Verify</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Footer */}
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500' }}>
                {showOTP
                  ? 'Enter the code to continue. Make sure you typed it correctly.'
                  : 'We will send a 6-digit verification code to your email address.'
                }
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ValidateAccount;