package com.snaptask.server.snaptask_server.dto.notification;

import com.snaptask.server.snaptask_server.enums.NotificationStatus;
import com.snaptask.server.snaptask_server.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PosterNotificationDto {
    private String id;
    private NotificationType type;
    private String seekerName;
    private String taskTitle;
    private String time; // raw ISO timestamp
    private Double seekerRating;
    private Integer completedTasks;
    private String message;
    private String bidAmount;
    private String timeline;
    private NotificationStatus status;
}