package com.snaptask.server.snaptask_server.modals;

import com.snaptask.server.snaptask_server.enums.NotificationStatus;
import com.snaptask.server.snaptask_server.enums.NotificationType;
import com.snaptask.server.snaptask_server.enums.UserRole;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
@CompoundIndexes({
        @CompoundIndex(
                name = "notif_query_idx",
                def = "{'user_id': 1, 'target_role': 1, 'status': 1, 'is_seen': 1, 'created_at': -1}"
        )
})
public class Notification {

    @Id
    private String id;

    @Indexed(name = "user_id_idx")
    @Field("user_id")
    private List<String> receiverIds; // All receiver user IDs

    @Field("sender_id")
    private String senderId;

    @Field("sender_name")
    private String senderName;

    @Field("task_id")
    private String taskId;

    @Field("task_title")
    private String taskTitle;

    @Field("message")
    private String message;

    @Field("extra_info")
    private String extraInfo; // flexible for optional info like update details

    @Indexed(name = "type_idx")
    @Field("type")
    private NotificationType type; // e.g. BID, COMPLETED, UPDATE

    @Indexed(name = "status_idx")
    @Field("status")
    private NotificationStatus status; // NEW, READ, ARCHIVED

    @Field("user_role")
    private UserRole userRole; // role of the sender (POSTER/SEEKER)

    @Field("target_role")
    private UserRole targetRole; // role of the receiver (POSTER/SEEKER)

    @Indexed(name = "is_seen_idx")
    @Field("is_seen")
    @Builder.Default
    private boolean isSeen = false;

    // --- Optional fields for each role context ---
    @Field("seeker_name")
    private String seekerName;

    @Field("seeker_rating")
    private Double seekerRating;

    @Field("completed_tasks")
    private Integer completedTasks;

    @Field("bid_amount")
    private String bidAmount;

    @Field("timeline")
    private String timeline;

    @Field("poster_name")
    private String posterName;

    @Field("poster_rating")
    private Double posterRating;

    @Field("budget")
    private String budget;

    @Field("deadline")
    private String deadline;

    @Field("update_info")
    private String updateInfo;

    @CreatedDate
    @Field("created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
