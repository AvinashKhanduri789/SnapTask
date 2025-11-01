import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const HeaderSection = ({ onSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (onSearch) onSearch(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <View style={{ marginBottom: 24, position: "relative" }}>
      {/* 🌈 Extended Gradient Background - Fixed to top */}
      <LinearGradient
        colors={["#6366F1", "#3B82F6", "#60A5FA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: -60, // Increased negative margin to cover top gap
          left: -20,
          right: -20,
          height: 250, // Slightly increased height
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          zIndex: 0,
        }}
      />
      
      {/* 🧭 Header Content */}
      <View style={{ zIndex: 1, position: "relative" }}>
        {/* Greeting + Notification */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
            paddingTop: 8,
          }}
        >
          {/* Left Greeting */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.3)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "800", color: "#ffffff" }}
                >
                  A
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: 2,
                  }}
                >
                  Welcome back,
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: "#ffffff",
                    letterSpacing: -0.5,
                    textShadowColor: "rgba(0,0,0,0.1)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}
                >
                  Aviansh! 👋
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 12,
                alignSelf: "flex-start",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#ffffff",
                  fontWeight: "600",
                }}
              >
                🚀 Ready to post your next task?
              </Text>
            </View>
          </View>
          {/* 🔔 Notification Icon */}
          <TouchableOpacity
            style={{
              position: "relative",
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.3)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            <View
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "#ef4444",
                width: 10,
                height: 10,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            />
          </TouchableOpacity>
        </View>
        {/* 🔍 Search Bar now inside gradient zone */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 6,
            shadowColor: isSearchFocused ? "#6366F1" : "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isSearchFocused ? 0.2 : 0.1,
            shadowRadius: 16,
            elevation: 6,
            borderWidth: 2,
            borderColor: isSearchFocused ? "#6366F1" : "#ffffff",
          }}
        >
          <LinearGradient
            colors={["#6366F1", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
              shadowColor: "#6366F1",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="search" size={20} color="#ffffff" />
          </LinearGradient>
          {/* Text Field */}
          <View style={{ flex: 1, position: "relative" }}>
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1f2937",
                height: 40,
              }}
              placeholder="Search tasks, seekers, or categories..."
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
                backgroundColor: "#f3f4f6",
                width: 36,
                height: 36,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 8,
                elevation: 2,
              }}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
        {/* Search Result Hint */}
        {searchQuery && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              borderRadius: 10,
              alignSelf: "flex-start",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <Ionicons name="search" size={16} color="#6366F1" />
            <Text
              style={{
                fontSize: 14,
                color: "#6366F1",
                fontWeight: "600",
                marginLeft: 6,
              }}
            >
              Searching for "{searchQuery}"
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default HeaderSection;