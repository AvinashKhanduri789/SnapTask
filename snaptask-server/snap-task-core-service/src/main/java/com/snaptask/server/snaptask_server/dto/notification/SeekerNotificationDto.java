package com.snaptask.server.snaptask_server.dto.notification;

import com.snaptask.server.snaptask_server.enums.NotificationStatus;
import com.snaptask.server.snaptask_server.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeekerNotificationDto {
    private String id;
    private NotificationType type;
    private String taskId;
    private String posterName;
    private String taskTitle;
    private String time;
    private Double posterRating;
    private String postedOn;
    private String message;
    private String budget;
    private String deadline;
    private String updateInfo;
    private NotificationStatus status;
}