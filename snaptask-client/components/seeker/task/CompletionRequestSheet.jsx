import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../../util/requester";
import { useApi } from "../../../util/useApi";
import StatusModal from "../../common/StatusModal";

const CompletionRequestSheet = ({ taskId, onClose }) => {
  const insets = useSafeAreaInsets();
  const { request, isLoading } = useApi();
  const [note, setNote] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState([""]);

  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    status: "info",
    title: "",
    message: "",
  });

  const handleAddLink = () => setSubmissionLinks([...submissionLinks, ""]);

  const handleLinkChange = (text, index) => {
    const updated = [...submissionLinks];
    updated[index] = text;
    setSubmissionLinks(updated);
  };

  const handleRemoveLink = (index) => {
    setSubmissionLinks((prev) => prev.filter((_, i) => i !== index));
  };

const handleSubmit = async () => {
  const payload = { taskId, note, submissionLinks };
  const response = await request(api.post("/seeker/task/complete_request", payload));

  if (response.ok) {
   
    setModalConfig({
      status: "success",
      title: "Request Submitted!",
      message: "Your completion request has been successfully sent.",
    });
    setModalVisible(true);

    
    setTimeout(() => {
      setModalVisible(false);
      onClose();
    }, 1800);
  } else {
    const err = response.error || {};
    console.log("Completion request error:", err);

   
    const isInternal =
      err.status >= 500 || err.status === 0 || err.message?.includes("Network");

    setModalConfig({
      status: isInternal ? "error" : "info",
      title: isInternal ? "Request Failed" : "Reminder",
      message:
        err.detail ||
        err.message ||
        (isInternal
          ? "Something went wrong. Please try again later."
          : "Your request could not be processed."),
    });

    setModalVisible(true);
  }
};


  return (
    <>
      {/* Main Bottom Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        style={[
          styles.sheetContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Submit Completion Request</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Note Input */}
              <View style={styles.field}>
                <Text style={styles.label}>Note (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Write a short note (max 500 chars)"
                  style={styles.textArea}
                  multiline
                  maxLength={500}
                />
                <Text style={styles.charCount}>{note.length}/500</Text>
              </View>

              {/* Submission Links */}
              <View style={styles.field}>
                <Text style={styles.label}>Submission Links</Text>
                {submissionLinks.map((link, index) => (
                  <View key={index} style={styles.linkRow}>
                    <TextInput
                      value={link}
                      onChangeText={(text) => handleLinkChange(text, index)}
                      placeholder={`Link ${index + 1}`}
                      style={styles.linkInput}
                    />
                    {submissionLinks.length > 1 && (
                      <TouchableOpacity onPress={() => handleRemoveLink(index)}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity onPress={handleAddLink} style={styles.addLinkButton}>
                  <Ionicons name="add-circle-outline" size={20} color="#2563eb" />
                  <Text style={styles.addLinkText}>Add another link</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.footerButton, styles.cancelButton]}
              >
                <Text style={[styles.footerText, { color: "#1e293b" }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleSubmit}
                style={[styles.footerButton, styles.submitButton]}
              >
                <Text style={styles.footerText}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* ✅ Status Modal */}
      <StatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        showCloseButton={!isLoading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  field: {
    marginTop: 15,
  },
  label: {
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 10,
    minHeight: 90,
    textAlignVertical: "top",
    color: "#334155",
  },
  charCount: {
    textAlign: "right",
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  linkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    color: "#334155",
  },
  addLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addLinkText: {
    color: "#2563eb",
    marginLeft: 4,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#2563eb",
  },
  footerText: {
    color: "white",
    fontWeight: "600",
  },
});

export default CompletionRequestSheet;
