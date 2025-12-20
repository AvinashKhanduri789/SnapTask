package com.snaptask.server.snaptask_server.service;

import com.google.firebase.messaging.*;
import com.snaptask.server.snaptask_server.dto.notification.FCMNotificationDto;
import com.snaptask.server.snaptask_server.exceptions.customExceptions.NotificationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class FirebaseService {

    private static final Logger log = LoggerFactory.getLogger(FirebaseService.class);

    /**
     * Send a message to a topic asynchronously.
     */
    public CompletableFuture<String> sendMessageToTopicAsync(FCMNotificationDto request) {
        validateRequest(request);

        Message message = Message.builder()
                .setTopic(request.getTopicOrToken())
                .setNotification(buildNotification(request))
                .build();

        return sendAsync(message);
    }

    /**
     * Send a message to a specific device asynchronously.
     */
    public CompletableFuture<String> sendMessageToDeviceAsync(String deviceToken, FCMNotificationDto request) {
        Objects.requireNonNull(deviceToken, "Device token cannot be null");
        validateRequest(request);

        Message message = Message.builder()
                .setToken(deviceToken)
                .setNotification(buildNotification(request))
                .build();

        return sendAsync(message);
    }

    /**
     * Send notification to multiple devices efficiently (batch mode).
     * Firebase supports up to 500 tokens per request.
     */
    public CompletableFuture<BatchResponse> sendNotificationToMultipleDevicesAsync(List<String> deviceTokens, FCMNotificationDto request) {
        Objects.requireNonNull(deviceTokens, "Device token list cannot be null");
        if (deviceTokens.isEmpty()) {
            return CompletableFuture.completedFuture(null);
        }

        validateRequest(request);

        // Build one message for all tokens
        MulticastMessage message = MulticastMessage.builder()
                .addAllTokens(deviceTokens)
                .setNotification(Notification.builder()
                        .setTitle(request.getTitle())
                        .setBody(request.getBody())
                        .build())
                .putAllData(request.getData() != null ? request.getData() : Map.of())
                .build();

        return CompletableFuture.supplyAsync(() -> {
            try {
                BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(message);
                log.info("✅ Batch sent: {} success, {} failed", response.getSuccessCount(), response.getFailureCount());
                return response;
            } catch (FirebaseMessagingException e) {
                log.error("❌ Failed to send batch notification", e);
                throw new NotificationException("Error sending batch notifications", e);
            }
        });
    }

    /**
     * Build Firebase Notification object from request.
     */
    private Notification buildNotification(FCMNotificationDto request) {
        return Notification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .build();
    }

    /**
     * Send Firebase message asynchronously and return CompletableFuture.
     */
    private CompletableFuture<String> sendAsync(Message message) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = FirebaseMessaging.getInstance().sendAsync(message).get();
                log.info("Notification sent successfully. Response: {}", response);
                return response;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Notification sending interrupted", e);
                throw new NotificationException("Notification sending interrupted", e);
            } catch (ExecutionException e) {
                log.error("Error sending notification", e.getCause());
                throw new NotificationException("Error sending notification", e.getCause());
            }
        });
    }

    /**
     * Validate request object.
     */
    private void validateRequest(FCMNotificationDto request) {
        Objects.requireNonNull(request, "Notification request cannot be null");
        Objects.requireNonNull(request.getTitle(), "Notification title cannot be null");
        Objects.requireNonNull(request.getBody(), "Notification message cannot be null");
    }


}
