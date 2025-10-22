import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, View, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabSwitcher from "./TabSwitcher";
const TasksHeader = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  return (
    <View style={{ marginBottom: 0, position: "relative" }}>
      
      <LinearGradient
        colors={["#6366F1", "#4F46E5", "#3B82F6", "#60A5FA"]}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: -20,
          right: -20,
          height: 220, 
          borderBottomLeftRadius: 50, 
          borderBottomRightRadius: 50, 
          zIndex: 0,
          shadowColor: "#6366F1",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
      />
      
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)", "transparent"]}
        locations={[0, 0.3, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={{
          position: "absolute",
          top: 0,
          left: -20,
          right: -20,
          height: 220,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          zIndex: 1,
        }}
      />
      
      <View style={{ position: "absolute", top: 20, right: 30, zIndex: 1, opacity: 0.1 }}>
        <Ionicons name="document-text" size={60} color="#ffffff" />
      </View>
      <View style={{ position: "absolute", top: 60, left: 30, zIndex: 1, opacity: 0.08 }}>
        <Ionicons name="checkmark-circle" size={40} color="#ffffff" />
      </View>
      <View style={{ position: "absolute", top: 120, right: 60, zIndex: 1, opacity: 0.06 }}>
        <Ionicons name="time" size={35} color="#ffffff" />
      </View>
    
      <View style={{ zIndex: 2, position: "relative", paddingVertical: 40 }}>
        <View style={{ paddingHorizontal: 20 }}>
          
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }}
          >
          </Animated.View>
       
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginBottom: 2,
            }}
          >
            <Text
              style={{
                fontSize: 35,
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: -0.8,
                textShadowColor: "rgba(0,0,0,0.2)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
                marginBottom: 4,
              }}
            >
               Tasks
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Task Management
            </Text>
          </Animated.View>
         
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 2,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginRight: 6 }} />
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>2 Pending</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 6 }} />
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>5 In Progress</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 }} />
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>12 Completed</Text>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};
export default TasksHeader;