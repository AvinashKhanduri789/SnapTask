package com.snaptask.server.snaptask_server.modals;

import com.snaptask.server.snaptask_server.enums.NotificationStatus;
import com.snaptask.server.snaptask_server.enums.NotificationType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
@CompoundIndexes({
        @CompoundIndex(name = "user_seen_created_idx", def = "{'user_id': 1, 'is_seen': 1, 'created_at': -1}")
})
public class Notification {

    @Id
    private String id;

    @Indexed
    @Field("user_id")
    private String userId; // Receiver (poster or seeker)

    @Field("sender_id")
    private String senderId; // Optional: useful for linking profiles later

    @Field("sender_name")
    private String senderName;

    @Field("task_id")
    private String taskId;

    @Field("task_title")
    private String taskTitle;

    @Field("message")
    private String message;

    @Field("extra_info")
    private String extraInfo;

    @Field("type")
    private NotificationType type;

    @Field("status")
    private NotificationStatus status;

    @Field("user_role")
    private String userRole; // POSTER / SEEKER

    @Field("is_seen")
    @Builder.Default
    private boolean isSeen = false;

    @CreatedDate
    @Field("created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
