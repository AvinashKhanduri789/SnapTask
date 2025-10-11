import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const buttonScale = new Animated.Value(1);
  const inputScale = new Animated.Value(1);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Alert.alert('Success', 'Login successful!');
      router.replace('/poster');
    }, 1500);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const animatePress = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animateRelease = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animateInputFocus = () => {
    Animated.spring(inputScale, {
      toValue: 1.02,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animateInputBlur = () => {
    Animated.spring(inputScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    animateInputFocus();
  };

  const handleBlur = () => {
    setFocusedField('');
    animateInputBlur();
  };

  const isDisabled = !email || !password || isLoading;

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
                shadowColor: "#6366F1",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Ionicons name="lock-closed-outline" size={32} color="#FFFFFF" />
            </LinearGradient>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#1f2937', marginBottom: 8, letterSpacing: -0.5 }}>
              Welcome Back
            </Text>
            <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', lineHeight: 24 }}>
              Sign in to continue to your account
            </Text>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8, letterSpacing: -0.2 }}>
              Email Address
            </Text>
            <Animated.View style={{ 
              transform: [{ scale: focusedField === 'email' ? inputScale : 1 }],
              flexDirection: 'row', 
              alignItems: 'center',
              borderWidth: 2,
              borderColor: focusedField === 'email' ? '#6366F1' : '#e5e7eb',
              borderRadius: 16,
              paddingHorizontal: 16,
              backgroundColor: focusedField === 'email' ? '#fafbff' : '#ffffff',
              shadowColor: focusedField === 'email' ? "#6366F1" : "#000",
              shadowOffset: {
                width: 0,
                height: focusedField === 'email' ? 4 : 2,
              },
              shadowOpacity: focusedField === 'email' ? 0.1 : 0.05,
              shadowRadius: focusedField === 'email' ? 8 : 4,
              elevation: focusedField === 'email' ? 4 : 2,
            }}>
              <Ionicons 
                name="mail-outline" 
                size={22} 
                color={focusedField === 'email' ? '#6366F1' : '#9ca3af'} 
              />
              <TextInput
                style={{ 
                  flex: 1, 
                  paddingVertical: 16, 
                  paddingLeft: 12, 
                  fontSize: 16, 
                  color: '#111827',
                  fontWeight: '500',
                }}
                placeholder="your@email.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                returnKeyType="next"
              />
            </Animated.View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8, letterSpacing: -0.2 }}>
              Password
            </Text>
            <Animated.View style={{ 
              transform: [{ scale: focusedField === 'password' ? inputScale : 1 }],
              flexDirection: 'row', 
              alignItems: 'center',
              borderWidth: 2,
              borderColor: focusedField === 'password' ? '#6366F1' : '#e5e7eb',
              borderRadius: 16,
              paddingHorizontal: 16,
              backgroundColor: focusedField === 'password' ? '#fafbff' : '#ffffff',
              shadowColor: focusedField === 'password' ? "#6366F1" : "#000",
              shadowOffset: {
                width: 0,
                height: focusedField === 'password' ? 4 : 2,
              },
              shadowOpacity: focusedField === 'password' ? 0.1 : 0.05,
              shadowRadius: focusedField === 'password' ? 8 : 4,
              elevation: focusedField === 'password' ? 4 : 2,
            }}>
              <Ionicons 
                name="key-outline" 
                size={22} 
                color={focusedField === 'password' ? '#6366F1' : '#9ca3af'} 
              />
              <TextInput
                style={{ 
                  flex: 1,
                  paddingVertical: 16,
                  paddingLeft: 12,
                  fontSize: 16,
                  color: '#111827',
                  fontWeight: '500',
                }}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowPassword(!showPassword);
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

          {/* Forgot Password */}
          <TouchableOpacity 
            style={{ alignSelf: 'flex-end', marginBottom: 24 }}
            activeOpacity={0.7}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Text style={{ color: '#6366F1', fontSize: 14, fontWeight: '600' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPressIn={() => animatePress(buttonScale)}
              onPressOut={() => animateRelease(buttonScale)}
              onPress={async () => {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                handleLogin();
              }}
              disabled={isDisabled}
              activeOpacity={0.9}
              style={{ 
                borderRadius: 16, 
                width: '100%',
                shadowColor: "#6366F1",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: isDisabled ? 0.1 : 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={isDisabled ? ['#c7d2fe', '#dbeafe'] : ['#6366F1', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 18,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  opacity: isLoading ? 0.9 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={22} color="#fff" />
                    <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 12, letterSpacing: -0.2 }}>
                      Sign In
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
            <Text style={{ color: '#6b7280', fontSize: 14, fontWeight: '600', marginHorizontal: 16 }}>
              OR
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
          </View>

          {/* Create Account Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPressIn={() => animatePress(buttonScale)}
              onPressOut={() => animateRelease(buttonScale)}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/auth/register"); 
              }}
              activeOpacity={0.9}
              style={{
                borderRadius: 16,
                paddingVertical: 18,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                borderWidth: 2,
                borderColor: '#e5e7eb',
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name="person-add-outline" size={22} color="#6366F1" />
              <Text style={{ marginLeft: 12, color: '#6366F1', fontSize: 17, fontWeight: '700', letterSpacing: -0.2 }}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Text style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', lineHeight: 18 }}>
              By continuing, you agree to our{'\n'}
              <Text style={{ color: '#6366F1', fontWeight: '600' }}>Terms of Service</Text> and <Text style={{ color: '#6366F1', fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;