package com.snaptask.server.snaptask_server.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ExpoPushService {

    private static final Logger log = LoggerFactory.getLogger(ExpoPushService.class);
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ExpoPushService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Async
    public void sendBatchNotifications(List<String> expoTokens, String title, String body, Map<String, Object> data) {
        if (expoTokens == null || expoTokens.isEmpty()) {
            log.warn("No Expo tokens provided for notification");
            return;
        }

        try {
            List<Map<String, Object>> messages = expoTokens.stream()
                    .map(token -> Map.of(
                            "to", token,
                            "sound", "default",
                            "title", title,
                            "body", body,
                            "data", data
                    ))
                    .toList();

            String response = restTemplate.postForObject(EXPO_PUSH_URL, messages, String.class);
            log.info("✅ Sent {} Expo notifications. Response: {}", messages.size(), response);

            if (response != null && response.contains("error")) {
                log.warn("Expo returned error: {}", response);
            }

        } catch (Exception e) {
            log.error("❌ Failed to send Expo notifications", e);
        }
    }

    /**
     * Send a single Expo push notification to one device token.
     * This method is synchronous and returns true if Expo accepted the message.
     *
     * Caller can run this in background or rely on a higher-level @Async method.
     *
     * @param expoToken Expo push token (ExponentPushToken[...])
     * @param title     notification title
     * @param body      notification body
     * @param data      custom data payload (may be null)
     * @return true if successfully sent/accepted by Expo, false otherwise
     */
    @Async
    public boolean sendNotification(String expoToken, String title, String body, Map<String, Object> data) {
        if (expoToken == null || expoToken.isBlank()) {
            log.warn("sendNotification called with null/blank token");
            return false;
        }

        Map<String, Object> message = Map.of(
                "to", expoToken,
                "sound", "default",
                "title", title,
                "body", body,
                "data", data != null ? data : Map.of()
        );

        int maxRetries = 3;
        int attempt = 0;
        long backoffMillis = 500; // initial backoff

        while (attempt < maxRetries) {
            attempt++;
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(EXPO_PUSH_URL, message, String.class);
                String responseBody = response.getBody();
                log.debug("Expo push response (attempt {}): status={}, body={}", attempt, response.getStatusCode(), responseBody);

                // Expo returns a JSON array when sending an array, but for a single message it returns an object.
                // We'll parse generically and check for "data" or "errors".
                if (response.getStatusCode().is2xxSuccessful() && responseBody != null && !responseBody.isBlank()) {
                    try {
                        JsonNode root = objectMapper.readTree(responseBody);

                        // If the response is an array (expo returns array for batch), handle first element
                        JsonNode entry = root.isArray() ? root.get(0) : root;

                        if (entry == null) {
                            log.warn("Unexpected empty response from Expo for token {}", expoToken);
                            return false;
                        }

                        // Check for success/ref
                        if (entry.has("data") && entry.get("data").has("status") &&
                                "ok".equalsIgnoreCase(entry.get("data").path("status").asText(null))) {
                            log.info("✅ Expo accepted message for token {} (expo id: {})", expoToken, entry.get("data").path("id").asText(null));
                            return true;
                        }

                        // Newer Expo responses can include "status" and "message" fields or "error"
                        if (entry.has("status") && "ok".equalsIgnoreCase(entry.get("status").asText())) {
                            log.info("✅ Expo accepted message for token {}", expoToken);
                            return true;
                        }

                        // Check for explicit error
                        if (entry.has("status") && "error".equalsIgnoreCase(entry.get("status").asText())) {
                            String err = entry.path("message").asText(entry.path("details").toString());
                            log.warn("Expo returned error for token {}: {}", expoToken, err);

                            // If it's an invalid token, caller should remove it from DB
                            if (err.toLowerCase().contains("device_not_registered") || err.toLowerCase().contains("invalid")) {
                                log.warn("Invalid/expired Expo token: {}", expoToken);
                                return false;
                            }

                            // otherwise, break/return false (non-retriable)
                            return false;
                        }

                        // If no clear success marker, treat as success for 2xx (best-effort)
                        log.info("Expo push response ambiguous but 2xx - treating as success for token {}", expoToken);
                        return true;

                    } catch (IOException e) {
                        log.warn("Failed to parse Expo response JSON: {}", e.getMessage());
                        // If parsing fails but HTTP was 2xx, consider success (or you can choose to retry)
                        return true;
                    }
                } else {
                    log.warn("Non-2xx response from Expo (attempt {}): status={}, body={}", attempt, response.getStatusCode(), responseBody);
                }
            } catch (Exception ex) {
                log.warn("Error sending notification to Expo (attempt {}): {}", attempt, ex.getMessage());
            }

            // Backoff before retrying
            try {
                Thread.sleep(backoffMillis);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.error("Interrupted while backing off retries", ie);
                return false;
            }
            backoffMillis *= 2;
        }

        log.error("Failed to send Expo notification to token {} after {} attempts", expoToken, maxRetries);
        return false;
    }


}

