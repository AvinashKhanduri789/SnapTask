package com.snaptask.server.snaptask_server.modals;

import com.snaptask.server.snaptask_server.enums.TaskStatus;
import com.snaptask.server.snaptask_server.enums.WorkMode;
import com.snaptask.server.snaptask_server.modals.embedded.TimelineStage;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a posted task on SnapTask.
 * Optimized for scalability: minimal embedded objects, indexed key fields, and lightweight references.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
@CompoundIndex(def = "{'poster_id': 1, 'status': 1}")  //  speeds up frequent queries like find by poster + status
public class Task {

    @Id
    private String id;

    @Field("title")
    @Indexed  //  tasks are often searched by title/keywords
    private String title;

    @Field("description")
    private String description;

    @Field("category")
    @Indexed  //  filtering tasks by category (e.g., design, coding)
    private String category;

    @Field("budget")
    private Double budget;

    @Field("unpaid")
    private boolean isUnpaid;

    @Field("mode")
    private WorkMode mode;

    @Field("duration")
    private String duration;

    @Field("status")
    @Indexed
    @Builder.Default
    private TaskStatus status = TaskStatus.NEW;

    @Field("deadline")
    @Indexed
    private LocalDateTime deadline;

    @CreatedDate
    @Field("posted_on")
    @Builder.Default
    private LocalDateTime postedOn = LocalDateTime.now();

    @Field("poster_id")
    @Indexed
    private String posterId;

    @Field("assigned_seeker_id")
    private String assignedSeekerId;

    @Field("assigned_bid_id")
    private String assignedBidId;

    @Field("bid_ids")
    @Builder.Default
    private List<String> bidIds = List.of();


    @Field("bids_count")
    @Builder.Default
    private int bidsCount = 0;

    @Field("timeline")
    private List<TimelineStage> timeline;

    @LastModifiedDate
    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
