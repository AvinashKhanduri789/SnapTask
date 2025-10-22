package com.snaptask.server.snaptask_server.modals;

import com.snaptask.server.snaptask_server.enums.BidStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bids")
public class Bid {

    @Id
    private String id;

    @Indexed
    @Field("task_id")
    private String taskId;

    @Indexed
    @Field("seeker_id")
    private String seekerId;

    @Field("seeker_name")
    private String seekerName;

    @Field("tagline")
    private String tagline;

    @Field("bio")
    private String bio;

    @Field("rating")
    private double rating;

    @Field("completed_tasks")
    private int completedTasks;

    @Field("bid_amount")
    private double bidAmount;

    @Field("timeline")
    private String timeline;

    @Field("proposal")
    private String proposal;

    @Field("skills")
    private List<String> skills;

    @Field("portfolio")
    private String portfolio;

    @Field("response_time")
    private String responseTime;

    @Field("success_rate")
    private String successRate;

    @Field("member_since")
    private String memberSince;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    @Field("status")
    private BidStatus bidStatus;
}
