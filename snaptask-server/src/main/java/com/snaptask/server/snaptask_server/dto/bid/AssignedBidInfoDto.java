package com.snaptask.server.snaptask_server.dto.bid;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AssignedBidInfoDto {

    private String bidId;
    private String seekerId;
    private String seekerName;
    private double seekerRating;
    private int seekerCompletedTasks;
    private String seekerBio;
    private String tagline;
    private double bidAmount;
    private String proposal;
    private String communicationPreference;
    private String communicationDetail;
    private List<String> similarWorks;
    private String portfolio;

}
