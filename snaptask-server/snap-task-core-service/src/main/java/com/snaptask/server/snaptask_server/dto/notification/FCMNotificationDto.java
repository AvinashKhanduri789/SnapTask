package com.snaptask.server.snaptask_server.dto.notification;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class FCMNotificationDto {
    private String title;
    private String body;
    private String topicOrToken;
    private Map<String, String> data;
}
