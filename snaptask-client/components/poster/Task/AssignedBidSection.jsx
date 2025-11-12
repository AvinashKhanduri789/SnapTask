import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AssignedBidSection = ({ info }) => {
  if (!info) return null;

  const openLink = (url) => {
    if (url) Linking.openURL(url).catch(() => console.warn("Cannot open URL:", url));
  };

  return (
    <View className="bg-white rounded-3xl p-6 mt-6 mb-12 border border-slate-200 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center mb-5">
        <Ionicons name="person-circle-outline" size={26} color="#3b82f6" />
        <Text className="text-xl font-bold text-slate-900 ml-2">Assigned Seeker</Text>
      </View>

      {/* Seeker Info */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-slate-900 mb-1">{info.seekerName}</Text>
        {info.seekerBio && (
          <Text className="text-slate-600 text-sm leading-5 mb-2">{info.seekerBio}</Text>
        )}
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color="#f59e0b" />
          <Text className="text-slate-700 font-semibold ml-1">
            {info.seekerRating?.toFixed(1) ?? "N/A"}
          </Text>
          <Text className="text-slate-500 text-xs ml-2">
            ({info.seekerCompletedTasks ?? 0} tasks)
          </Text>
        </View>
      </View>

      {/* Separator */}
      <View className="h-px bg-slate-200 mb-6" />

      {/* Bid Details */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-slate-900 mb-2">Bid Details</Text>
        <Text className="text-slate-800 font-medium mb-1">{info.tagline}</Text>
        <Text className="text-slate-600 text-sm leading-5 mb-3">{info.proposal}</Text>

        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="cash" size={20} color="#10b981" />
            <Text className="text-slate-700 font-medium ml-2">Bid Amount</Text>
          </View>
          <Text className="text-green-600 font-bold text-lg">${info.bidAmount}</Text>
        </View>
      </View>

      {/* Communication */}
      {info.communicationPreference && (
        <>
          <View className="h-px bg-slate-200 mb-6" />
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-900 mb-2">Communication</Text>
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-ellipses" size={18} color="#6366f1" />
              <Text className="text-slate-700 ml-2">
                <Text className="font-medium">{info.communicationPreference}:</Text>{" "}
                {info.communicationDetail}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Similar Works */}
      {info.similarWorks?.length > 0 && (
        <>
          <View className="h-px bg-slate-200 mb-6" />
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-900 mb-3">Similar Works</Text>
            {info.similarWorks.map((url, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => openLink(url)}
                className="flex-row items-center py-2"
              >
                <Ionicons name="link-outline" size={18} color="#3b82f6" />
                <Text
                  className="text-blue-600 font-medium ml-2 flex-1"
                  numberOfLines={1}
                >
                  {url.replace(/(^\w+:|^)\/\//, "")}
                </Text>
                <Ionicons name="open-outline" size={16} color="#3b82f6" />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Portfolio */}
      {info.portfolio && (
        <>
          <View className="h-px bg-slate-200 mb-6" />
          <View>
            <Text className="text-lg font-bold text-slate-900 mb-3">Portfolio</Text>
            <TouchableOpacity
              onPress={() => openLink(info.portfolio)}
              className="flex-row items-center py-2"
            >
              <Ionicons name="globe-outline" size={18} color="#ec4899" />
              <Text
                className="text-blue-600 font-medium ml-2 flex-1"
                numberOfLines={1}
              >
                {info.portfolio.replace(/(^\w+:|^)\/\//, "")}
              </Text>
              <Ionicons name="open-outline" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default AssignedBidSection;
