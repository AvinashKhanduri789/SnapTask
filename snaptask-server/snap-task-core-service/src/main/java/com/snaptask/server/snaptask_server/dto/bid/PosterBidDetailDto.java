package com.snaptask.server.snaptask_server.dto.bid;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PosterBidDetailDto {
    private String id;
    private String taskId;
    private String seekerName;
    private String tagline;
    private String bio;
    private String rating;
    private String completedTasks;
    private String bidAmount;
    private String timeline;
    private String proposal;
    private List<String> similarWorkLinks;
    private String canCompleteInTime;
    private String communicationPreference;
    private String communicationDetail;
    private String bidStatus;
    private String portfolio;
    private String responseTime;
    private String memberSince;
}
