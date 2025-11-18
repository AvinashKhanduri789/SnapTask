import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusModal from "../../common/StatusModal";
import api from "../../../util/requester";
import { useApi } from "../../../util/useApi";

const CompletionRequestSection = ({ completion, taskId, onApproved }) => {
  const { request, isLoading } = useApi();

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    status: "",
    title: "",
    message: "",
  });

  const [confirmVisible, setConfirmVisible] = useState(false);

  if (!completion) return null;

  const handleApprove = async () => {
    setConfirmVisible(false);
    const response = await request(api.post(`/poster/${taskId}/approve_completion`));

    if (response.ok) {
      setModalConfig({
        visible: true,
        status: "success",
        title: "Task Approved!",
        message: "You’ve successfully approved this completion request.",
      });

      if (onApproved) onApproved(); 
    } else {
      const { error } = response;
      setModalConfig({
        visible: true,
        status: "error",
        title: "Approval Failed",
        message:
          error?.detail ||
          "Unable to approve the task at this time. Please try again later.",
      });
    }
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Ionicons name="checkmark-circle-outline" size={22} color="#16a34a" />
        <Text style={{ fontSize: 16, fontWeight: "700", marginLeft: 8, color: "#111827" }}>
          Completion Request
        </Text>
      </View>

      {/* Note */}
      <Text style={{ fontSize: 14, color: "#374151", lineHeight: 20 }}>
        {completion.note || "No note provided by the seeker."}
      </Text>

      {/* Submission Links */}
      {completion.submissionLinks?.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#111827" }}>
            Submission Links
          </Text>

          {completion.submissionLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(link)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Ionicons name="link-outline" size={18} color="#2563eb" />
              <Text
                numberOfLines={1}
                style={{
                  marginLeft: 6,
                  fontSize: 13,
                  color: "#2563eb",
                  textDecorationLine: "underline",
                }}
              >
                {link}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Approve Button */}
      <TouchableOpacity
        disabled={isLoading}
        onPress={() => setConfirmVisible(true)}
        style={{
          backgroundColor: isLoading ? "#9ca3af" : "#16a34a",
          paddingVertical: 12,
          borderRadius: 12,
          marginTop: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-done" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 8 }}>
              Accept Completion
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <StatusModal
        visible={confirmVisible}
        status="warning"
        title="Confirm Approval"
        message="Are you sure you want to accept this task completion? Once approved, you cannot undo this action."
        primaryActionLabel="Yes, Accept"
        onPrimaryAction={handleApprove}
        secondaryActionLabel="Cancel"
        onSecondaryAction={handleCancel}
        onClose={handleCancel} 
        showCloseButton={true}
      />

      {/*  Result Modal */}
      <StatusModal
        visible={modalConfig.visible}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleCloseModal}
        showCloseButton={true}
        primaryActionLabel="OK"
        onPrimaryAction={handleCloseModal}
      />
    </View>
  );
};

export default CompletionRequestSection;
