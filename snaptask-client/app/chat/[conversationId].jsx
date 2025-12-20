import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../_layout';
import { Ionicons } from '@expo/vector-icons';
import chatApi from '../../util/chat-serviceApi';
import { useApi } from '../../util/useApi';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = () => {
  
  const { conversationId } = useLocalSearchParams();
  const {name} = useLocalSearchParams();

 
  const router = useRouter();
  const socket = useSocket();
  const { userData } = useAuth();
  console.log("user at chat page is--->", userData);
  const { request } = useApi();

  // Refs
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // State
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const [istyping, setIstyping] = useState(false);
  const [otherUsertyping, setOtherUsertyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otherUserId, setOtherUserId] = useState(null);
  const [otherUserName, setOtherUserName] = useState('');

  useEffect(()=>{
    setOtherUserId(name);
  },[name]);

  
  const fetchMessages = useCallback(
    async (pageNumber = 1) => {
      if (pageNumber === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const result = await request(
        chatApi.get(`/conversation/${conversationId}/message`, {
          params: {
            page: pageNumber,
            limit: 20,
          },
        })
      );

      if (!result.ok) {
        Alert.alert("Error", result.error?.message || "Failed to load messages");
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

     
      const responseData = result.data.data;
      const { messages = [], pagination } = responseData;

      // set other user once
      if (messages.length > 0 && !otherUserId) {
        const firstMessage = messages[0];
        const otherUser =
          firstMessage.senderId === userData?.id
            ? firstMessage.receiverId
            : firstMessage.senderId;

        setOtherUserId(otherUser);
      }

      // merge messages
      if (pageNumber === 1) {
        setMessages(messages);
      } else {
        setMessages(prev => [...messages, ...prev]);
      }

      
      const hasMore =
        pagination.page < pagination.totalPages;

      setHasMoreMessages(hasMore);
      setPage(pageNumber);

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [conversationId, userData?.id, otherUserId]
  );

  // Fetch conversation details to get other user's name
  const fetchConversationDetails = useCallback(async () => {
    try {
      const result = await request(
        chatApi.get(`/conversation/${conversationId}`)
      );

      if (result.ok) {
        const conversationData = result.data.data;
        console.log("Conversation data:", conversationData);
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  }, [conversationId, userData?.id, request]);

  const loadOlderMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoadingMore || isLoading) return;

    await fetchMessages(page + 1);
  }, [fetchMessages, hasMoreMessages, isLoadingMore, isLoading, page]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isSending || !socket) return;

    const messageContent = inputText.trim();
    setInputText('');
    setIsSending(true);

    
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      conversationId,
      senderId: userData?.id,
      receiverId: otherUserId || '',
      content: messageContent,
      seen: false,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      socket.emit('send_message', {
        conversationId,
        content: messageContent,
      });

      socket.emit('typing_stop', { conversationId });

      Keyboard.dismiss();

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [inputText, isSending, socket, conversationId, userData?.id, otherUserId]);

  const handletyping = useCallback((text) => {
    setInputText(text);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!socket) return;

    if (text.trim()) {
      socket.emit('typing_start', { conversationId });
      setIstyping(true);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { conversationId });
        setIstyping(false);
      }, 2000);
    } else {
      socket.emit('typing_stop', { conversationId });
      setIstyping(false);
    }
  }, [conversationId, socket]);

  const markMessagesAsSeen = useCallback(() => {
    if (!socket) return;

    const unseenMessages = messages.filter(
      msg => msg.senderId !== userData?.id && !msg.seen
    );

    if (unseenMessages.length > 0) {
      socket.emit('mark_seen', { conversationId });

      setMessages(prev => prev.map(msg => ({
        ...msg,
        seen: msg.senderId !== userData?.id ? true : msg.seen
      })));
    }
  }, [messages, conversationId, socket, userData?.id]);

  const handleNewMessage = useCallback((message) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg._id === message._id || msg._id === `temp-${message._id}`);
      if (exists) {
        return prev.map(msg =>
          msg._id === `temp-${message._id}` ? message : msg
        );
      }
      return [...prev, message];
    });

    if (message.senderId !== userData?.id && !otherUserId) {
      setOtherUserId(message.senderId);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    if (message.receiverId === userData?.id) {
      socket?.emit('mark_seen', { conversationId });
    }
  }, [socket, conversationId, userData?.id, otherUserId]);

  const handletypingEvent = useCallback(({ userId, isTyping }) => {
    if (userId !== userData?.id) {
      setOtherUsertyping(isTyping);
    }
  }, [userData?.id]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('join_conversation', { conversationId });

    markMessagesAsSeen();

    socket.on('new_message', handleNewMessage);
    socket.on('typing', handletypingEvent);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handletypingEvent);
      socket.emit('typing_stop', { conversationId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, conversationId, handleNewMessage, handletypingEvent, markMessagesAsSeen]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      fetchConversationDetails();
    }
  }, [conversationId, fetchMessages, fetchConversationDetails]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length, isLoading]);

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderId === userData?.id;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.timestamp,
              isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
            ]}>
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            {isOwnMessage && (
              <View style={styles.seenIndicator}>
                {item.seen ? (
                  <Ionicons name="checkmark-done" size={14} color="#34B7F1" />
                ) : (
                  <Ionicons name="checkmark" size={14} color="#999" />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const rendertypingIndicator = () => {
    if (!otherUsertyping) return null;

    return (
      <View style={[styles.messageContainer, styles.otherMessageContainer]}>
        <View style={[styles.messageBubble, styles.otherMessageBubble]}>
          <View style={styles.typingDots}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#475569" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Loading...
            </Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isLoading && messages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#475569" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {name || 'Chat'}
            </Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={handletyping}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isSending) && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name="send"
                    size={22}
                    color={!inputText.trim() ? "#999" : "#FFFFFF"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {otherUserName || 'Chat'}
          </Text>
          {otherUsertyping && (
            <Text style={styles.typingStatus}>typing...</Text>
          )}
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onEndReached={loadOlderMessages}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <>
              {rendertypingIndicator()}
              {isLoadingMore && (
                <View style={styles.loadMoreContainer}>
                  <ActivityIndicator size="small" color="#007AFF" />
                </View>
              )}
            </>
          }
          ListHeaderComponent={
            !hasMoreMessages && messages.length > 0 ? (
              <View style={styles.chatStartContainer}>
                <Text style={styles.chatStartText}>
                  Start of conversation
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={handletyping}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isSending) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name="send"
                  size={22}
                  color={!inputText.trim() ? "#999" : "#FFFFFF"}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  typingStatus: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: '#f0f0f0',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ownMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#999',
  },
  seenIndicator: {
    marginLeft: 4,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 2,
    opacity: 0.6,
  },
  loadMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  chatStartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  chatStartText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    color: '#000000',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});

export default ChatScreen;